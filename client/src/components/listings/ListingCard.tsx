import Image from "next/image";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { ListingActionButtons } from "@/components/listings/ListingActionButtons";
import { cn } from "@/lib/cn";
import { PROPERTY_CATEGORIES, STATUS_META, formatListingPrice, type Listing } from "@/types/listing";

/** One listing, grid view — the portfolio's default presentation. Table
 * view (ListingTableRow) shows the same fields as compact rows instead,
 * for scanning many listings at once. */
export function ListingCard({ listing, onUpdated }: { listing: Listing; onUpdated: (updated: Listing) => void }) {
  const categoryMeta = PROPERTY_CATEGORIES.find((c) => c.id === listing.category);
  const statusMeta = STATUS_META[listing.status];
  const media = listing.media[0];

  return (
    <div className="flex flex-col overflow-hidden rounded-[19px] border border-border-subtle bg-white lg:rounded-[24px]">
      <div className="relative h-[140px] w-full shrink-0 bg-surface-muted">
        {media ? (
          <Image src={media.url} alt={listing.title} fill sizes="(max-width: 1024px) 50vw, 25vw" className="object-cover" />
        ) : (
          <div className="flex size-full items-center justify-center">
            <DynamicIcon name={categoryMeta?.icon ?? "Home"} className="size-7 text-muted" />
          </div>
        )}
        <span className={cn("absolute top-3 left-3 rounded px-2 py-1 text-[10px] font-semibold tracking-[0.5px] uppercase", statusMeta.className)}>
          {statusMeta.label}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="truncate font-heading text-sm font-semibold text-ink">{listing.title || "Untitled listing"}</h3>
        <p className="truncate text-xs text-muted">{listing.propertyType || "Property type not set"}</p>
        <p className="font-heading text-base font-semibold text-brand-navy">{formatListingPrice(listing.pricing)}</p>
        <p className="text-[11px] text-muted">Updated {new Date(listing.updatedAt).toLocaleDateString()}</p>
        <ListingActionButtons listing={listing} onUpdated={onUpdated} className="mt-auto pt-2" />
      </div>
    </div>
  );
}
