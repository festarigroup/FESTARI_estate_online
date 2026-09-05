import { DynamicIcon } from "@/components/ui/DynamicIcon";
import type { IconName } from "@/components/ui/DynamicIcon";
import type { Listing, ListingStatus } from "@/types/listing";

interface SummaryCard {
  label: string;
  value: number | "—";
  icon: IconName;
  /** Set on a genuinely stubbed metric (Enquiries/Leads is out of scope for
   * this branch, per spec) — rendered as "—" with this note rather than a
   * fake zero, so it reads as "not built yet", not "confirmed zero". */
  note?: string;
}

function isExpiringSoon(listing: Listing, withinDays: number): boolean {
  if (listing.status !== "published" || !listing.expiresAt) return false;
  const daysLeft = (new Date(listing.expiresAt).getTime() - Date.now()) / (24 * 60 * 60 * 1000);
  return daysLeft >= 0 && daysLeft <= withinDays;
}

/** Portfolio summary cards — the six per spec (active, drafts, needs
 * action, new enquiries, upcoming viewings, expiring soon). Enquiries and
 * Viewings are honest stubs (no Enquiries/Leads system exists yet, per
 * this branch's own non-goals); the rest are real counts over the
 * portfolio's own mock data. */
export function PortfolioSummaryCards({ items, counts }: { items: Listing[]; counts: Record<ListingStatus, number> }) {
  const cards: SummaryCard[] = [
    { label: "Active", value: counts.published, icon: "CircleCheck" },
    { label: "Drafts", value: counts.draft, icon: "FileText" },
    {
      label: "Needs Action",
      value: counts.pending_verification + counts.pending_review + counts.rejected,
      icon: "TriangleAlert",
    },
    { label: "New Enquiries", value: "—", icon: "MessageCircle", note: "Enquiries & Leads not built yet" },
    { label: "Upcoming Viewings", value: "—", icon: "Calendar", note: "Viewing scheduling not built yet" },
    { label: "Expiring Soon", value: items.filter((l) => isExpiringSoon(l, 14)).length, icon: "Clock" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {cards.map((card) => (
        <div key={card.label} className="flex flex-col gap-2 rounded-[19px] border border-border-subtle bg-white p-4 lg:rounded-[24px]">
          <div className="flex items-center gap-2 text-muted">
            <DynamicIcon name={card.icon} className="size-4" />
            <span className="text-xs font-semibold">{card.label}</span>
          </div>
          <p className="font-heading text-2xl font-semibold text-ink">{card.value}</p>
          {card.note && <p className="text-[10px] text-muted">{card.note}</p>}
        </div>
      ))}
    </div>
  );
}
