"use client";

import { useState } from "react";
import { StayBrowser } from "@/components/stay/StayBrowser";
import { StayCommunityBanner } from "@/components/stay/StayCommunityBanner";
import { PropertyMapPanel } from "@/components/properties/PropertyMapPanel";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
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

/** "Stay" page — Figma node 3393:16310. An 8/4-column grid, matching
 * Figma's own "Feed Column (8 columns)" / "Right Sidebar (4 columns)"
 * layer names, and mirroring PropertiesBrowser's own internal
 * grid-cols-12 split between its cards and map columns.
 *
 * CSS Grid's default `align-items: stretch` is what actually makes the
 * sidebar's sticky map hold through the *whole* scroll range: it
 * stretches <aside> to match <section>'s height automatically, so the
 * map's own direct parent (its sticky containing block) has real room to
 * clamp within. A plain flex row with `items-start` (this page's previous
 * implementation) left <aside> only as tall as its own content, which
 * silently starves any sticky element inside it of room to stick once
 * that content runs out — this is the same mechanism that makes
 * Properties' own map reliable; this page just wasn't using it.
 *
 * The title lives here rather than in StayBrowser, mirroring
 * properties/page.tsx owning Properties' own title while PropertiesBrowser
 * only owns the filter row + listing grid beneath it. */
export default function StayPage() {
  const [mapExpanded, setMapExpanded] = useState(false);

  return (
    <div
      className={cn(
        // py-6 top matches Properties' own gap below TopNavBar exactly
        // (both pages sit under the same 64px <main> clearance, so the
        // extra 24px here is what actually creates the breathing room
        // below it -- dropping it entirely, like an earlier pass did,
        // left Stay's title flush while Properties' stayed at a 24px
        // gap, which read as inconsistent between the two pages).
        //
        // No lg:px, for the same reason on the *horizontal* axis:
        // DashboardShell's <main> already clears SideNavBar with its own
        // 24px gap built in (lg:pl-[sidebar-w+48px]) plus a 24px right
        // margin (lg:pr-6) -- adding lg:px-10 on top of that doubled the
        // margin on both sides to ~64px, well past Figma's ~24-36px. Below
        // `lg` there's no floating sidebar to clear, so px-4/sm:px-6 still
        // apply there as this page's only source of side margin.
        "mx-auto flex max-w-[1400px] flex-col gap-6 px-4 py-6 sm:px-6 lg:gap-6 lg:px-0",
        !mapExpanded && "lg:grid lg:grid-cols-12",
      )}
    >
      <section className={cn("flex w-full flex-col gap-6", mapExpanded ? "hidden" : "lg:col-span-8")}>
        <div className="flex flex-col gap-1">
          <h1 className="text-[30px] font-bold tracking-[-0.9px] text-[#334154]">Stay (Hotels)</h1>
          <p className="text-sm text-[#475568]">Discover hotels, resorts, and unique stays shared by the community.</p>
        </div>

        <StayBrowser initialListings={STAY_LISTINGS} />

        <StayCommunityBanner />
      </section>

      <aside className={cn("flex w-full flex-col gap-6", mapExpanded ? "pb-12" : "pb-12 lg:col-span-4")}>
        {!mapExpanded && (
          // Sticky at the same top-16 offset as StayFilterRow's own sticky
          // row, so this stays visible ("inline with the filters") while
          // scrolling instead of scrolling away before the map does.
          <div className="flex justify-end lg:sticky lg:top-16 lg:z-10">
            <button
              onClick={() => setMapExpanded(true)}
              className="flex items-center gap-2 rounded-full bg-brand-navy px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-brand-navy-light"
            >
              <DynamicIcon name="Layers" className="size-3.5" />
              Full Map View
            </button>
          </div>
        )}
        <PropertyMapPanel
          listings={MAP_LISTINGS}
          expanded={mapExpanded}
          onExpand={() => setMapExpanded(true)}
          onCollapse={() => setMapExpanded(false)}
          // Follows right below the sticky button above it: 64 (button's
          // own stuck top) + 32 (its measured height) + 24 (the aside's
          // gap-6 between them) = 120, instead of just top-16/64 alone.
          className="lg:top-[120px] lg:h-[calc(100vh-144px)]"
        />
      </aside>
    </div>
  );
}
