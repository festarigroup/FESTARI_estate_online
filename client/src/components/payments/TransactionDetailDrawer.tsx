"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Drawer } from "@/components/ui/Drawer";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { cn } from "@/lib/cn";
import { getReceipt } from "@/lib/mocks/payments";
import { ENTITY_TYPE_LABEL, STATUS_META, formatMoney, isReceiptEligible, type Transaction } from "@/types/payment";

/**
 * The Transaction detail drawer — every field the spec names (reference,
 * amount/currency, payee, purpose, linked entity, masked payment method,
 * status timeline, receipt). Status is read-only here: no control on this
 * panel ever lets a user set a transaction's status directly, per spec
 * ("the real status must come from a backend webhook, never a client
 * action") — this only ever displays what `lib/mocks/payments.ts`'s own
 * timed webhook-simulation already decided.
 */
export function TransactionDetailDrawer({ transaction, onClose }: { transaction: Transaction; onClose: () => void }) {
  const [downloading, setDownloading] = useState(false);
  const statusMeta = STATUS_META[transaction.status];
  const eligible = isReceiptEligible(transaction.status);

  async function handleDownloadReceipt() {
    if (!eligible || downloading) return;
    setDownloading(true);
    try {
      // No real file exists behind this mock — there's no server in this
      // branch to generate or host one (per non-goals). This just proves
      // out the eligibility gate end-to-end rather than performing an
      // actual download.
      const { url } = await getReceipt(transaction.id);
      toast.success(`Receipt ready: ${url.split("/").pop()}`);
    } catch {
      toast.error("Receipt isn't available for this transaction.");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <Drawer open onClose={onClose} title="Transaction Details">
      <div className="flex flex-col gap-5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-heading text-lg font-semibold text-ink">{formatMoney(transaction.amount, transaction.currency)}</p>
            <p className="text-xs text-muted">{transaction.reference}</p>
          </div>
          <span className={cn("flex items-center gap-1 rounded px-2 py-1 text-[10px] font-semibold tracking-[0.5px] uppercase", statusMeta.className)}>
            <DynamicIcon name={statusMeta.icon} className="size-3" />
            {statusMeta.label}
          </span>
        </div>

        <dl className="flex flex-col gap-3 text-sm">
          <Field label="Purpose" value={transaction.purpose} />
          <Field label="Payee" value={transaction.payee} />
          <Field label="Payment method" value={transaction.maskedMethod} />
          <div className="flex items-center justify-between gap-2">
            <dt className="text-xs font-semibold text-muted">Linked to</dt>
            <dd className="text-right text-sm text-ink">
              {transaction.linkedEntity.href ? (
                <Link href={transaction.linkedEntity.href} className="font-semibold text-brand-navy hover:underline">
                  {transaction.linkedEntity.label}
                </Link>
              ) : (
                transaction.linkedEntity.label
              )}
              <span className="block text-[11px] text-muted">{ENTITY_TYPE_LABEL[transaction.linkedEntity.type]}</span>
            </dd>
          </div>
        </dl>

        <div className="flex flex-col gap-2 border-t border-border-subtle pt-4">
          <p className="text-xs font-semibold text-ink">Status timeline</p>
          <ol className="flex flex-col gap-3">
            {transaction.timeline.map((entry, i) => (
              <li key={i} className="flex items-center gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-surface-muted">
                  <DynamicIcon name={STATUS_META[entry.status].icon} className="size-3.5 text-brand-navy" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm text-ink">{STATUS_META[entry.status].label}</p>
                  <p className="text-[11px] text-muted">{new Date(entry.at).toLocaleString()}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Receipts vs invoices are distinguished per spec — this drawer
            only ever offers a receipt (proof of what was actually paid),
            never an invoice (a bill for what's owed); an invoice would
            belong to the Partially Paid/Balance Due side of this same
            status, which isn't built out here. The button itself is
            hidden entirely for an ineligible status, not just disabled —
            there's nothing useful to explain about a receipt that will
            never exist for a failed/disputed/still-pending transaction. */}
        {eligible && (
          <div className="border-t border-border-subtle pt-4">
            <button
              onClick={handleDownloadReceipt}
              disabled={downloading}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-navy px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-navy-light disabled:cursor-not-allowed disabled:opacity-50"
            >
              <DynamicIcon name="Download" className="size-4" />
              {downloading ? "Preparing..." : "Download Receipt"}
            </button>
          </div>
        )}
      </div>
    </Drawer>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <dt className="text-xs font-semibold text-muted">{label}</dt>
      <dd className="text-right text-sm text-ink">{value}</dd>
    </div>
  );
}
