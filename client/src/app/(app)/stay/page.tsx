"use client";

import { useState } from "react";
import { StayBrowser } from "@/components/stay/StayBrowser";
import { StayCommunityBanner } from "@/components/stay/StayCommunityBanner";
import { PropertyMapPanel } from "@/components/properties/PropertyMapPanel";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { WhoToFollow } from "@/components/home/WhoToFollow";
import { TrendingProperties } from "@/components/home/TrendingProperties";
import { TopServiceProviders } from "@/components/home/TopServiceProviders";
import { cn } from "@/lib/cn";
import { STAY_LISTINGS } from "@/lib/mock-data";

// The sidebar's map (Figma node 3384:8508) sits outside the feed column
// entirely, unlike the Properties page's own map (which shares its
// browser's filter state) -- so this always shows every seeded venue,
// regardless of which category tab or filter is active in the feed beside
// it, rather than lifting StayBrowser's filter state up just to keep them
// in sync.
const MAP_LISTINGS = STAY_LISTINGS.filter((listing) => listing.venueDetails).map((listing) => ({
  id: listing.id,
  price: `GHS ${listing.venueDetails!.pricePerNight.toLocaleString()} /night`,
  propertyType: listing.venueDetails!.category,
  images: listing.images ?? [],
}));

/** "Stay" page — Figma node 3393:16310. A 2/3-1/3 split matching the Home
 * feed's own column proportions: StayBrowser owns the page title, category
 * tabs, filter row (all now grouped in one card — see its own doc comment)
 * and the venue feed on the left; the right sidebar carries a preview map
 * plus the same WhoToFollow/TrendingProperties/TopServiceProviders widgets
 * Home uses.
 *
 * The map's expand/collapse mechanic mirrors PropertiesBrowser's exactly
 * (same PropertyMapPanel, same `expanded` full-width takeover) — the
 * `section` just gets `hidden` rather than being unmounted while expanded,
 * so StayBrowser's category/filter/listings state survives collapsing back. */
export default function StayPage() {
  const [mapExpanded, setMapExpanded] = useState(false);

  return (
    <div
      className={cn(
        "mx-auto flex max-w-[1400px] flex-col gap-6 px-4 py-6 sm:px-6 lg:gap-6 lg:px-10",
        !mapExpanded && "lg:flex-row lg:items-start",
      )}
    >
      <section className={cn("flex w-full flex-col gap-6", mapExpanded ? "hidden" : "lg:w-2/3")}>
        <StayBrowser initialListings={STAY_LISTINGS} />

        <StayCommunityBanner />
      </section>

      <aside className={cn("flex w-full flex-col gap-6", mapExpanded ? "pb-12" : "pb-12 lg:w-1/3")}>
        {!mapExpanded && (
          <button
            onClick={() => setMapExpanded(true)}
            className="flex items-center gap-2 self-end rounded-full bg-brand-navy px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-brand-navy-light"
          >
            <DynamicIcon name="Layers" className="size-3.5" />
            Full Map View
          </button>
        )}
        <PropertyMapPanel
          listings={MAP_LISTINGS}
          expanded={mapExpanded}
          onExpand={() => setMapExpanded(true)}
          onCollapse={() => setMapExpanded(false)}
          className="lg:top-16 lg:h-[calc(100vh-88px)]"
        />

        {!mapExpanded && (
          <>
            <WhoToFollow />
            <TrendingProperties />
            <TopServiceProviders />
          </>
        )}
      </aside>
    </div>
  );
}
