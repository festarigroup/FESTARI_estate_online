import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { cn } from "@/lib/cn";
import { STATUS_META, formatMoney, type Transaction } from "@/types/payment";

/** One row in the transaction list — reference, purpose, linked entity,
 * status badge, amount, masked method. Clicking it opens
 * TransactionDetailDrawer (owned by the page, not this component). */
export function TransactionCard({ transaction, onOpen }: { transaction: Transaction; onOpen: () => void }) {
  const statusMeta = STATUS_META[transaction.status];

  return (
    <button
      onClick={onOpen}
      className="flex w-full flex-col gap-2 rounded-[19px] border border-border-subtle bg-white p-4 text-left hover:bg-surface-muted lg:rounded-[24px]"
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-ink">{transaction.purpose}</p>
          <p className="text-xs text-muted">{transaction.reference}</p>
        </div>
        <span className={cn("flex shrink-0 items-center gap-1 rounded px-2 py-1 text-[10px] font-semibold tracking-[0.5px] uppercase", statusMeta.className)}>
          <DynamicIcon name={statusMeta.icon} className="size-3" />
          {statusMeta.label}
        </span>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border-subtle pt-2">
        <p className="flex items-center gap-1.5 text-xs text-muted">
          <DynamicIcon name="CreditCard" className="size-3.5" />
          {transaction.maskedMethod}
        </p>
        <p className="font-heading text-base font-semibold text-brand-navy">
          {formatMoney(transaction.amount, transaction.currency)}
        </p>
      </div>
    </button>
  );
}
