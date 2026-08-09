import { db } from "#app/db/db.js";
import { ledger, paystack_webhook_events, paymentTransactions } from "#app/db/schema.js";
import requestService from "#app/services/requestsService.js";
import walletService from "#app/services/walletService.js";
import { eq } from "drizzle-orm";

const recordWebhookEvent = async (eventId: string, eventType: string, reference?: string) => {
  try {
    await db.insert(paystack_webhook_events).values({
      event_id: eventId,
      event_type: eventType,
      reference: reference ?? null,
    });
    return true;
  } catch {
    return false;
  }
};

const processSuccessfulPayment = async (reference: string, paystackData?: unknown) => {
  const transaction = await db
    .select()
    .from(paymentTransactions)
    .where(eq(paymentTransactions.reference, reference))
    .then((rows) => rows[0]);

  if (!transaction || transaction.status === "success") {
    return transaction;
  }

  await db
    .update(paymentTransactions)
    .set({
      status: "success",
      paystack_data: paystackData ?? transaction.paystack_data,
      paid_at: new Date(),
      updated_at: new Date(),
    })
    .where(eq(paymentTransactions.reference, reference));

  const metadata = (transaction.metadata ?? {}) as Record<string, unknown>;
  const purpose = metadata.purpose as string | undefined;

  if (purpose === "wallet_deposit" && transaction.user_id) {
    await db.transaction(async (tx) => {
      await walletService.creditWalletTx(tx, {
        userId: transaction.user_id!,
        amount: Number(transaction.amount),
        referenceId: transaction.id,
        paymentMethod: "mobile_money",
        paymentTransactionId: transaction.id,
        transactionType: "top_up",
      });
    });
  } else if (transaction.request_id) {
    const paymentMethod =
      transaction.payment_method === "mobile_money" ? "mobile_money" : "card";
    await requestService.updateRequestStatus(transaction.request_id, {
      status: "paid",
      transaction_reference: reference,
      payment_date: new Date(),
      payment_method: paymentMethod,
    });

    if (transaction.user_id) {
      await db.transaction(async (tx) => {
        const wallet = await walletService.getOrCreateWalletTx(tx, transaction.user_id!);
        await tx.insert(ledger).values({
          wallet_id: wallet.id,
          amount: Number(transaction.amount).toFixed(2),
          transaction_type: "payment",
          reference_id: transaction.request_id!,
          payment_method: paymentMethod,
          payment_transaction_id: transaction.id,
        });
      });
    }
  }

  return transaction;
};

export default { recordWebhookEvent, processSuccessfulPayment };
