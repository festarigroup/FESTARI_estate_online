import Image from "next/image";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { cn } from "@/lib/cn";
import {
  FEATURES,
  PROPERTY_CATEGORIES,
  STATUS_META,
  VIEWING_MODES,
  formatListingPrice,
  isListingLive,
  type Listing,
} from "@/types/listing";

/** Formats the public-facing address per the location's own precision
 * setting — never more detail than the owner chose to expose, regardless
 * of what the owner's own workspace shows them. */
function formatPublicLocation(location: Listing["location"]): string {
  if (location.precision === "exact") {
    return [location.address, location.area, location.city, location.region].filter(Boolean).join(", ");
  }
  if (location.precision === "approximate") {
    return [location.area, location.city].filter(Boolean).join(", ");
  }
  return [location.city, location.region].filter(Boolean).join(", ");
}

/** The category-specific facts strip — residential/land/commercial each
 * get their own field group, per spec ("distinct field groups for
 * residential/land/commercial"). */
function CategoryFacts({ listing }: { listing: Listing }) {
  if (listing.category === "land") {
    const { plotSize, plotUnit, titleType, topography } = listing.land;
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {plotSize != null && <Fact icon="Ruler" label="Plot Size" value={`${plotSize} ${plotUnit ?? "sqm"}`} />}
        {titleType && <Fact icon="ShieldCheck" label="Title Type" value={titleType} />}
        {topography && <Fact icon="Mountain" label="Topography" value={topography} />}
      </div>
    );
  }
  if (listing.category === "commercial") {
    const { floorAreaSqm, unitsCount, zoning, floorLevel } = listing.commercial;
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {floorAreaSqm != null && <Fact icon="Ruler" label="Floor Area" value={`${floorAreaSqm} sqm`} />}
        {unitsCount != null && <Fact icon="Building" label="Units" value={String(unitsCount)} />}
        {zoning && <Fact icon="MapPinned" label="Zoning" value={zoning} />}
        {floorLevel && <Fact icon="Building2" label="Floor" value={floorLevel} />}
      </div>
    );
  }
  const { bedrooms, bathrooms, areaSqm, parkingSpaces, yearBuilt } = listing.residential;
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {bedrooms != null && <Fact icon="BedDouble" label="Bedrooms" value={String(bedrooms)} />}
      {bathrooms != null && <Fact icon="Bath" label="Bathrooms" value={String(bathrooms)} />}
      {areaSqm != null && <Fact icon="Ruler" label="Area" value={`${areaSqm} sqm`} />}
      {parkingSpaces != null && <Fact icon="ParkingCircle" label="Parking" value={String(parkingSpaces)} />}
      {yearBuilt != null && <Fact icon="Calendar" label="Year Built" value={String(yearBuilt)} />}
    </div>
  );
}

function Fact({ icon, label, value }: { icon: Parameters<typeof DynamicIcon>[0]["name"]; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-surface-muted px-3 py-2">
      <DynamicIcon name={icon} className="size-4 shrink-0 text-brand-navy" />
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-ink">{value}</p>
        <p className="truncate text-[11px] text-muted">{label}</p>
      </div>
    </div>
  );
}

interface PropertyDetailsViewProps {
  listing: Listing;
  /** True when rendered inside the creation wizard's Preview & Submit
   * step — shows a "this is a preview" banner and never gates the
   * enquiry/viewing block behind `isListingLive` (a draft has no public
   * audience to gate from yet; the gate matters once this same component
   * renders on a listing's real, published-or-not public page). */
  previewMode?: boolean;
}

/**
 * The one component that renders a property listing's public Property
 * Details output — used by the creation wizard's Preview & Submit step so
 * "what you're about to publish" can never drift from what actually
 * renders once it's live, per spec ("reuse the real Property Details
 * component so nothing can drift"). This is the first real implementation
 * of that rendering surface in the app — `/properties/[id]` is still a
 * "Coming Soon" stub for its own separate concerns (photo gallery, floor
 * plan, inquiry form as a full page); this component is the reusable
 * content block that page will eventually render, not a replacement for
 * it.
 */
export function PropertyDetailsView({ listing, previewMode = false }: PropertyDetailsViewProps) {
  const categoryMeta = PROPERTY_CATEGORIES.find((c) => c.id === listing.category);
  const statusMeta = STATUS_META[listing.status];
  const live = isListingLive(listing.status);
  const hero = listing.media[0];
  const rest = listing.media.slice(1, 5);

  return (
    <div className="flex flex-col gap-5 rounded-[19px] border border-border-subtle bg-white p-5 lg:rounded-[24px] lg:p-6">
      {previewMode && (
        <div className="flex items-center gap-2 rounded-lg bg-brand-gold/15 px-4 py-2.5 text-sm font-semibold text-brand-navy">
          <DynamicIcon name="Eye" className="size-4 shrink-0" />
          Preview — this is exactly how the listing will appear once published. It is not live yet.
        </div>
      )}

      {/* Media gallery */}
      {listing.media.length === 0 ? (
        <div className="flex h-[220px] w-full items-center justify-center rounded-lg bg-surface-muted">
          <DynamicIcon name="ImageIcon" className="size-8 text-muted" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-1 sm:grid-cols-4">
          <div className="relative h-[260px] w-full overflow-hidden rounded-lg sm:col-span-3">
            <Image
              src={hero.url}
              alt={listing.title}
              fill
              sizes="(max-width: 640px) 100vw, 75vw"
              className="object-cover"
            />
          </div>
          {rest.length > 0 && (
            <div className="grid grid-cols-4 gap-1 sm:grid-cols-1">
              {rest.map((item, i) => (
                <div key={i} className="relative h-[62px] overflow-hidden rounded-lg sm:h-auto">
                  <Image src={item.url} alt="" fill sizes="150px" className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          {categoryMeta && (
            <span className="flex items-center gap-1 rounded bg-brand-gold-dark px-2 py-1 text-[10px] font-semibold tracking-[0.5px] text-white uppercase">
              <DynamicIcon name={categoryMeta.icon} className="size-3" />
              {categoryMeta.label}
            </span>
          )}
          <span className={cn("rounded px-2 py-1 text-[10px] font-semibold tracking-[0.5px] uppercase", statusMeta.className)}>
            {statusMeta.label}
          </span>
        </div>
        <h1 className="font-heading text-xl font-semibold text-ink">{listing.title || "Untitled listing"}</h1>
        <p className="flex items-center gap-1.5 text-sm text-muted">
          <DynamicIcon name="MapPin" className="size-4 shrink-0" />
          {formatPublicLocation(listing.location) || "Location not set"}
        </p>
        <p className="font-heading text-2xl font-semibold text-brand-navy">{formatListingPrice(listing.pricing)}</p>
      </div>

      <CategoryFacts listing={listing} />

      {listing.description && <p className="text-sm leading-relaxed whitespace-pre-line text-ink">{listing.description}</p>}

      {listing.features.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {listing.features.map((id) => {
            const feature = FEATURES.find((f) => f.id === id);
            if (!feature) return null;
            return (
              <span
                key={id}
                className="flex items-center gap-1.5 rounded-full bg-surface-muted-2 px-3 py-1.5 text-xs text-muted"
              >
                <DynamicIcon name={feature.icon} className="size-3.5" />
                {feature.label}
              </span>
            );
          })}
        </div>
      )}

      {/* Viewing & Contact — gated by isListingLive, per spec */}
      <div className="border-t border-border-subtle pt-4">
        {live || previewMode ? (
          listing.viewingContact ? (
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted">
                {VIEWING_MODES.find((m) => m.id === listing.viewingContact!.viewingMode)?.label ?? "By Appointment"} ·{" "}
                Prefers contact by {listing.viewingContact.preferredContactMethod}
              </p>
              <button
                disabled={!live}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-navy px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-navy-light disabled:cursor-not-allowed disabled:opacity-50"
              >
                <DynamicIcon name="MessageCircle" className="size-4" />
                {live ? "Enquire / Request Viewing" : "Enquire / Request Viewing (preview)"}
              </button>
            </div>
          ) : (
            <p className="text-sm text-muted">Viewing & contact details have not been set yet.</p>
          )
        ) : (
          <p className="flex items-center gap-2 text-sm text-muted">
            <DynamicIcon name="Ban" className="size-4 shrink-0" />
            This listing is {statusMeta.label.toLowerCase()} and is not currently accepting enquiries or viewing requests.
          </p>
        )}
      </div>
    </div>
  );
}
