import { db } from "#app/db/db.js";
import { artisanHireRequests, hotelBookings, paystackWebhookEvents } from "#app/db/schema/index.js";
import paymentsService from "#app/services/paymentsService.js";
import subscriptionsService from "#app/services/subscriptionsService.js";
import { eq } from "drizzle-orm";

const recordWebhookEvent = async (eventId: string, eventType: string, reference?: string) => {
  try {
    await db.insert(paystackWebhookEvents).values({
      event_id: eventId,
      event_type: eventType,
      reference: reference ?? null,
    });
    return true;
  } catch {
    return false;
  }
};

const activateSubscriptionFromPayment = async (targetId: string, paystackData?: any) => {
  const subscription = await subscriptionsService.getById(targetId);
  const plan = subscription ? await subscriptionsService.getPlanById(subscription.plan_id) : null;

  const intervalDays = plan?.interval === "yearly" ? 365 : 30;
  const expiresAt = new Date(Date.now() + intervalDays * 24 * 60 * 60 * 1000);

  await subscriptionsService.activateSubscription(targetId, {
    subscription_code: paystackData?.subscription_code,
    paystack_customer_code: paystackData?.customer?.customer_code,
    expires_at: expiresAt,
  });
};

const processSuccessfulPayment = async (reference: string, paystackData?: unknown) => {
  const payment = await paymentsService.getByReference(reference);

  if (!payment || payment.status === "success") {
    return payment;
  }

  await paymentsService.updateByReference(reference, {
    status: "success",
    metadata: (paystackData as Record<string, unknown>) ?? payment.metadata,
    paid_at: new Date(),
  });

  if (!payment.target_id) {
    return payment;
  }

  switch (payment.payment_type) {
    case "subscription":
      await activateSubscriptionFromPayment(payment.target_id, paystackData);
      break;
    case "hotel_booking":
      await db
        .update(hotelBookings)
        .set({ status: "confirmed", updated_at: new Date() })
        .where(eq(hotelBookings.id, payment.target_id));
      break;
    case "artisan_hire":
      await db
        .update(artisanHireRequests)
        .set({ status: "accepted", updated_at: new Date() })
        .where(eq(artisanHireRequests.id, payment.target_id));
      break;
  }

  return payment;
};

export default { recordWebhookEvent, processSuccessfulPayment };
