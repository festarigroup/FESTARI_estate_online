"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Modal } from "@/components/ui/Modal";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { createPaymentIntent, simulatePaymentProcessing } from "@/lib/mocks/payments";
import { STATUS_META, formatMoney, type LinkedEntityType, type TransactionStatus } from "@/types/payment";

type FlowState = "idle" | "processing" | "successful" | "failed";

interface PayNowButtonProps {
  entityType: LinkedEntityType;
  entityId: string;
  amount: number;
  currency?: string;
  /** Shown as the transaction's own `purpose`/linked-entity label — pass
   * whatever the calling feature's own copy for this payment is (e.g. "2
   * nights at Labadi Beach Hotel"). Falls back to a generic label built
   * from `entityType`/`entityId` so this still works with zero extra
   * props from a caller that hasn't decided its own copy yet. */
  label?: string;
  payee?: string;
  className?: string;
}

/**
 * Drop-in "Pay Now" action for any feature with something to charge for —
 * Stay booking, Service engagement, a listing's Verification fee, etc.
 * None of those flows exist yet (out of scope for this branch, per its
 * own non-goals); this button is deliberately generic so whichever one
 * gets built later just renders `<PayNowButton entityType="stay_booking"
 * entityId={booking.id} amount={total} />` and is done.
 *
 * On click: calls the mock `createPaymentIntent()`, then walks through a
 * simple "processing -> success/fail" flow that stands in for the real
 * processor redirect/3DS challenge during frontend development. The
 * resulting Transaction is real (mock) data — it shows up on
 * /payments immediately after.
 */
export function PayNowButton({ entityType, entityId, amount, currency = "GHS", label, payee, className }: PayNowButtonProps) {
  const [open, setOpen] = useState(false);
  const [flow, setFlow] = useState<FlowState>("idle");
  const [liveStatus, setLiveStatus] = useState<TransactionStatus>("initiated");

  async function handlePay() {
    setOpen(true);
    setFlow("processing");
    setLiveStatus("initiated");
    try {
      const { transactionId } = await createPaymentIntent({
        entityType,
        entityId,
        amount,
        currency,
        purpose: label,
        payee,
        linkedEntityLabel: label ?? `${entityType.replace(/_/g, " ")} ${entityId}`,
      });
      const finalStatus = await simulatePaymentProcessing(transactionId, setLiveStatus);
      setFlow(finalStatus === "successful" ? "successful" : "failed");
      if (finalStatus === "successful") toast.success("Payment successful.");
    } catch {
      setFlow("failed");
      toast.error("Payment couldn't be processed.");
    }
  }

  function handleClose() {
    setOpen(false);
    setFlow("idle");
  }

  return (
    <>
      <button
        onClick={handlePay}
        className={
          className ??
          "inline-flex items-center justify-center gap-2 rounded-full bg-brand-navy px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-navy-light"
        }
      >
        <DynamicIcon name="CreditCard" className="size-4" />
        Pay {formatMoney(amount, currency)}
      </button>

      <Modal open={open} onClose={flow === "processing" ? () => {} : handleClose} title="Payment">
        <div className="flex flex-col items-center gap-4 py-4 text-center">
          {flow === "processing" && (
            <>
              <DynamicIcon name="RefreshCcw" className="size-8 animate-spin text-brand-navy" />
              <p className="text-sm font-semibold text-ink">{STATUS_META[liveStatus].label}</p>
              <p className="text-xs text-muted">Don&apos;t close this window — confirming your payment...</p>
            </>
          )}
          {flow === "successful" && (
            <>
              <DynamicIcon name="CircleCheck" className="size-10 text-green-600" />
              <p className="text-sm font-semibold text-ink">Payment successful</p>
              <p className="text-xs text-muted">{formatMoney(amount, currency)} — a receipt will be available on your Payments page.</p>
              <button onClick={handleClose} className="rounded-full bg-brand-navy px-6 py-2 text-sm font-semibold text-white hover:bg-brand-navy-light">
                Done
              </button>
            </>
          )}
          {flow === "failed" && (
            <>
              <DynamicIcon name="XCircle" className="size-10 text-red-600" />
              <p className="text-sm font-semibold text-ink">Payment failed</p>
              <p className="text-xs text-muted">Nothing was charged. You can try again.</p>
              <button onClick={handleClose} className="rounded-full border border-border-subtle px-6 py-2 text-sm font-semibold text-ink hover:bg-surface-muted">
                Close
              </button>
            </>
          )}
        </div>
      </Modal>
    </>
  );
}
