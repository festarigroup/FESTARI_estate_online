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

// Measured: <section> stacks a title block + its gap-6 to StayCategoryNav +
// StayCategoryNav's own height + its gap-6 to StayFilterRow above the
// filter row -- 187px of content <aside> doesn't have above its own
// button. Without this, the button's static (pre-scroll) position sits
// 187px higher up the page than the filter row's, so it reaches its stuck
// `top-16` offset well before the filter row does and the two drift apart
// for that whole stretch of scroll. Padding rather than a spacer div so it
// doesn't count as an extra flex child needing its own gap-6.
const SIDEBAR_TOP_SPACER = "lg:pt-[187px]";

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
 * only owns the filter row + listing grid beneath it.
 *
 * The sidebar's button and map are two *separate* sticky elements (not one
 * merged into StayFilterRow the way Properties merges its "Map View"
 * toggle into its own filter row) — matching Figma's actual column split,
 * where the button/map both belong to the "Right Sidebar", not the "Feed
 * Column". Two things make them behave as if they were one unit anyway:
 *
 * 1. `SIDEBAR_TOP_SPACER` levels their *starting* position with
 *    StayFilterRow's, so both reach their own stuck `top` offset at the
 *    exact same scroll position instead of drifting apart mid-scroll.
 * 2. The button's own wrapper carries the same py-3 StayFilterRow uses
 *    around its pills, so the visible button lines up with the visible
 *    pills (not just their containers) rather than sitting ~12px higher
 *    where its own padding-free wrapper would otherwise put it.
 * 3. The map's own `top` offset (144px) is exactly the button's `top-16`
 *    (64px) plus its wrapper's measured height (56px, button + that same
 *    py-3) plus the gap-6 between them (24px) — the same gap StayFilterRow
 *    keeps from the first card below it. Because that gap matches the
 *    *offset* gap between the two `top` values, the map keeps pace with
 *    the button through the entire scroll (not just at the moment both
 *    first stick): once the button hits top-16 and stops, the map —
 *    already the same distance below it it'll occupy once stuck — has
 *    nowhere left to go either, so it stops in the same instant rather
 *    than continuing to slide up underneath it. */
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

      <aside
        className={cn(
          "flex w-full flex-col gap-6",
          mapExpanded ? "pb-12" : cn("pb-12 lg:col-span-4", SIDEBAR_TOP_SPACER),
        )}
      >
        {!mapExpanded && (
          // py-3 matches StayFilterRow's own row padding -- without it the
          // button (which has no padding of its own above it) rendered ~12px
          // higher than the pills, which sit 12px below their row's top
          // edge because of that same py-3. Same padding on both is what
          // actually lines up the two visible rows, not just their
          // containers' bounding boxes.
          <div className="flex justify-end py-3 lg:sticky lg:top-16 lg:z-10">
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
          // 64 (button's own stuck top) + 56 (its wrapper's measured
          // height, including the py-3 that lines the button up with
          // StayFilterRow's own pills) + 24 (the aside's gap-6 between
          // them, same gap-6 StayFilterRow keeps from the first card below
          // it) = 144 -- see doc comment above for why this specific
          // arithmetic is what keeps the map from drifting once the
          // button's already stuck.
          //
          // -260 rather than PropertyMapPanel's own default -146 (or the
          // -168 this page used before): with the spacer/button/gap now
          // eating into <aside>'s stretched height above the map (see doc
          // comment above), the old, taller height left the map with more
          // height than the room actually remaining beneath those, so the
          // browser eased its `top` back down near the end of the scroll
          // to avoid overflowing past <aside>'s own bottom padding --
          // exactly the "map moves near the bottom" behaviour this was
          // fixed to remove. -260 was found empirically (binary search
          // against this page's actual current content -- 640px was the
          // largest height that held at top-[144px] all the way to the end
          // of scroll before it started easing) and has ~10-15px of margin
          // below that threshold for cross-browser rounding.
          className="lg:top-[144px] lg:h-[calc(100vh-260px)]"
        />
      </aside>
    </div>
  );
}
