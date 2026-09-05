"use client";

import { useEffect, useMemo, useState } from "react";
import { TransactionCard } from "@/components/payments/TransactionCard";
import { TransactionDetailDrawer } from "@/components/payments/TransactionDetailDrawer";
import { listTransactions } from "@/lib/mocks/payments";
import { STATUS_META, type Transaction, type TransactionStatus } from "@/types/payment";

type StatusFilter = "all" | TransactionStatus;

const FILTERS: StatusFilter[] = [
  "all",
  "initiated",
  "pending_authorising",
  "successful",
  "partially_paid",
  "refund_pending",
  "refunded",
  "failed",
  "disputed",
];

/**
 * Payments, Billing & Transactions — a private financial activity centre,
 * explicitly NOT a wallet (per spec): there's no balance shown or top-up
 * action anywhere on this page, only a history of individual payments
 * each tied to something else (a Stay booking, a Service engagement, a
 * Verification fee, ...) via `linkedEntity`.
 */
export default function PaymentsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [openTransactionId, setOpenTransactionId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    listTransactions()
      .then((result) => {
        if (!cancelled) setTransactions(result.items);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(
    () => (statusFilter === "all" ? transactions : transactions.filter((t) => t.status === statusFilter)),
    [transactions, statusFilter],
  );

  const openTransaction = transactions.find((t) => t.id === openTransactionId) ?? null;

  return (
    <div className="mx-auto flex max-w-[900px] flex-col gap-4 px-4 py-6 sm:px-6 lg:px-0">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-[28px] font-semibold text-ink">Payments & Transactions</h1>
        <p className="text-sm text-muted">
          Every payment you&apos;ve made or received, linked back to what it was for. Status updates come from the
          payment provider — this list only ever reflects them.
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {FILTERS.map((filter) => (
          <button
            key={filter}
            onClick={() => setStatusFilter(filter)}
            className={`flex shrink-0 items-center rounded-full border px-4 py-2 text-xs font-semibold whitespace-nowrap ${
              statusFilter === filter
                ? "border-brand-navy bg-brand-navy text-white"
                : "border-border-subtle bg-white text-ink hover:bg-surface-muted"
            }`}
          >
            {filter === "all" ? "All" : STATUS_META[filter].label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="py-8 text-center text-sm text-muted">Loading transactions...</p>
      ) : filtered.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted">No transactions in this status yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((transaction) => (
            <TransactionCard key={transaction.id} transaction={transaction} onOpen={() => setOpenTransactionId(transaction.id)} />
          ))}
        </div>
      )}

      {openTransaction && <TransactionDetailDrawer transaction={openTransaction} onClose={() => setOpenTransactionId(null)} />}
    </div>
  );
}
