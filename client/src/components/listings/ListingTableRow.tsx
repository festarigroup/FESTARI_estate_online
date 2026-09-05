import { ListingActionButtons } from "@/components/listings/ListingActionButtons";
import { cn } from "@/lib/cn";
import { STATUS_META, formatListingPrice, type Listing } from "@/types/listing";

/** One listing, table view — the same fields ListingCard shows, as a
 * compact row for scanning many listings at once. */
export function ListingTableRow({ listing, onUpdated }: { listing: Listing; onUpdated: (updated: Listing) => void }) {
  const statusMeta = STATUS_META[listing.status];

  return (
    <tr className="border-b border-border-subtle last:border-0">
      <td className="py-3 pr-4">
        <p className="font-heading text-sm font-semibold text-ink">{listing.title || "Untitled listing"}</p>
        <p className="text-xs text-muted">{listing.propertyType || "Property type not set"}</p>
      </td>
      <td className="py-3 pr-4">
        <span className={cn("rounded px-2 py-1 text-[10px] font-semibold tracking-[0.5px] uppercase", statusMeta.className)}>
          {statusMeta.label}
        </span>
      </td>
      <td className="py-3 pr-4 text-sm font-semibold text-brand-navy">{formatListingPrice(listing.pricing)}</td>
      <td className="py-3 pr-4 text-xs text-muted">{new Date(listing.updatedAt).toLocaleDateString()}</td>
      <td className="py-3">
        <ListingActionButtons listing={listing} onUpdated={onUpdated} />
      </td>
    </tr>
  );
}
