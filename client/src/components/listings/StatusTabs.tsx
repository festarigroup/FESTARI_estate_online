import { cn } from "@/lib/cn";
import { LISTING_STATUSES, STATUS_META, type ListingStatus } from "@/types/listing";

interface StatusTabsProps {
  active: ListingStatus | "all";
  counts: Record<ListingStatus, number>;
  total: number;
  onChange: (status: ListingStatus | "all") => void;
}

/** Status tabs across every stage of the lifecycle (Draft through
 * Archived) plus "All" — a horizontally-scrolling rail, same convention as
 * CategoryChips/the wizard's own step rail, since eleven-plus tabs don't
 * fit one line at any reasonable width. */
export function StatusTabs({ active, counts, total, onChange }: StatusTabsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <Tab label="All" count={total} active={active === "all"} onClick={() => onChange("all")} />
      {LISTING_STATUSES.map((status) => (
        <Tab
          key={status}
          label={STATUS_META[status].label}
          count={counts[status]}
          active={active === status}
          onClick={() => onChange(status)}
        />
      ))}
    </div>
  );
}

function Tab({ label, count, active, onClick }: { label: string; count: number; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-semibold whitespace-nowrap",
        active ? "border-brand-navy bg-brand-navy text-white" : "border-border-subtle bg-white text-ink hover:bg-surface-muted",
      )}
    >
      {label}
      <span
        className={cn(
          "flex min-w-[18px] items-center justify-center rounded-full px-1 text-[10px]",
          active ? "bg-white/20" : "bg-surface-muted",
        )}
      >
        {count}
      </span>
    </button>
  );
}
