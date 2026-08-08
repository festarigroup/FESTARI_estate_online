import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { cn } from "@/lib/cn";
import type { PropertyPost } from "@/types/home";

/** Right: Interactive Map (Desktop Sticky) — Figma node 3340:2569.
 * Not a live/interactive map: there's no map provider (Google Maps/Mapbox)
 * wired into this app, and adding one wasn't part of this request. What
 * IS reproduced faithfully is the actual exported map image Figma uses for
 * its own "Map Canvas Area" (node 3340:2571, downloaded to
 * public/images/property-map-canvas.png) — a flat gradient stood in for
 * it in an earlier pass, which is why the map looked blank; every other
 * post/story image in this app comes from a real exported asset, so this
 * one should too. The toolbar/pins/"Search this area" chrome sits on top,
 * same as before. */
export function PropertyMapPanel({ listings }: { listings: PropertyPost[] }) {
  // Spread pins out over the canvas rather than pinning them to the exact
  // Figma coordinates (which were relative to Accra's real street grid at
  // Figma's own map zoom/pan, which this static image doesn't reproduce
  // pixel-for-pixel) — position is illustrative here.
  const positions = [
    { top: "28%", left: "38%" },
    { top: "58%", left: "62%" },
    { top: "70%", left: "22%" },
  ];

  return (
    <div className="hidden overflow-hidden rounded-xl border border-border-subtle bg-[#e3e2e5] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] lg:sticky lg:top-[89px] lg:block lg:h-[calc(100vh-113px)]">
      <div className="relative size-full bg-[url('/images/property-map-canvas.png')] bg-cover bg-center">
        {/* Subtle navy tint over the map, matching Figma's own overlay on
            this layer (node 3340:2572). */}
        <div
          className="pointer-events-none absolute inset-0 mix-blend-multiply"
          style={{ backgroundImage: "linear-gradient(109deg, rgba(1,28,58,0) 0%, rgba(1,28,58,0.05) 100%)" }}
        />

        <div className="absolute inset-x-4 top-4 flex items-start justify-between">
          <span className="flex items-center gap-1.5 rounded-lg border border-border-subtle bg-white/90 px-3 py-2 text-xs font-semibold text-ink shadow-sm backdrop-blur-sm">
            <DynamicIcon name="MapPin" className="size-3.5" />
            Accra, Ghana
          </span>
          <div className="flex flex-col gap-2">
            <button
              aria-label="Zoom in"
              className="flex size-10 items-center justify-center rounded-full border border-border-subtle bg-white shadow-sm hover:bg-surface-muted"
            >
              <DynamicIcon name="Plus" className="size-4" />
            </button>
            <button
              aria-label="Zoom out"
              className="flex size-10 items-center justify-center rounded-full border border-border-subtle bg-white shadow-sm hover:bg-surface-muted"
            >
              <DynamicIcon name="Minus" className="size-4" />
            </button>
            <button
              aria-label="Map layers"
              className="flex size-10 items-center justify-center rounded-full border border-border-subtle bg-white shadow-sm hover:bg-surface-muted"
            >
              <DynamicIcon name="Layers" className="size-4" />
            </button>
          </div>
        </div>

        {listings.map((listing, i) => {
          const pos = positions[i % positions.length];
          return (
            <span
              key={listing.id}
              className={cn(
                "absolute -translate-x-1/2 rounded-full px-3 py-1.5 text-xs font-bold whitespace-nowrap text-white shadow-md",
                "bg-brand-gold-dark",
              )}
              style={pos}
            >
              {listing.price}
            </span>
          );
        })}

        <button className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-border-subtle bg-white px-6 py-2 text-xs font-semibold text-ink shadow-md hover:bg-surface-muted">
          <DynamicIcon name="Search" className="size-3.5" />
          Search this area
        </button>
      </div>
    </div>
  );
}
