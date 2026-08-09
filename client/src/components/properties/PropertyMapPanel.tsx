"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { cn } from "@/lib/cn";
import type { GalleryImage } from "@/types/home";

/** The minimal shape this map actually needs — just enough to drop a pin
 * and show a preview popup. Kept generic (rather than typed to
 * `PropertyPost`) so the Stay page's venue listings can reuse this same
 * map without forcing GeneralPost to carry property-only fields. */
export interface MapListing {
  id: string;
  price: string;
  propertyType: string;
  images: GalleryImage[];
}

interface PropertyMapPanelProps {
  listings: MapListing[];
  /** True once the caller has switched to the full-width map layout —
   * changes sizing/stickiness and swaps the toolbar's expand control for a
   * collapse one. */
  expanded?: boolean;
  /** Only called from the mini (non-expanded) map — the "Accra, Ghana"
   * badge doubles as a "expand this" affordance, same destination as the
   * filter row's "Map View" button. */
  onExpand?: () => void;
  onCollapse?: () => void;
  /** Builds the popup's "View Details" link href for a given listing id.
   * Omit to hide that link entirely — the Stay page has no per-venue detail
   * route yet, so its map just doesn't offer one. */
  detailHref?: (id: string) => string;
}

/** Right: Interactive Map (Desktop Sticky) — Figma node 3340:2569.
 * Not a live/interactive map: there's no map provider (Google Maps/Mapbox)
 * wired into this app, and adding one wasn't part of this request. What
 * IS reproduced faithfully is the actual exported map image Figma uses for
 * its own "Map Canvas Area" (node 3340:2571, downloaded to
 * public/images/property-map-canvas.png). The toolbar/pins/"Search this
 * area" chrome sits on top.
 *
 * "Interactive" here means what's actually achievable without a real map
 * provider: price pins are clickable and pop up that listing's preview
 * (photo, price, a link into it), and the whole thing can expand from the
 * sidebar-sized mini map into a full-width view via either the filter
 * row's "Map View" button or clicking the map's own location badge. */
export function PropertyMapPanel({ listings, expanded, onExpand, onCollapse, detailHref }: PropertyMapPanelProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = listings.find((l) => l.id === selectedId) ?? null;

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
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border-subtle bg-[#e3e2e5] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]",
        expanded
          ? "block h-[75vh] w-full"
          : "hidden lg:sticky lg:top-[131px] lg:block lg:h-[calc(100vh-155px)]",
      )}
    >
      <div className="relative size-full bg-[url('/images/property-map-canvas.png')] bg-cover bg-center">
        {/* Subtle navy tint over the map, matching Figma's own overlay on
            this layer (node 3340:2572). */}
        <div
          className="pointer-events-none absolute inset-0 mix-blend-multiply"
          style={{ backgroundImage: "linear-gradient(109deg, rgba(1,28,58,0) 0%, rgba(1,28,58,0.05) 100%)" }}
        />

        <div className="absolute inset-x-4 top-4 flex items-start justify-between">
          {onExpand ? (
            <button
              onClick={onExpand}
              className="flex items-center gap-1.5 rounded-lg border border-border-subtle bg-white/90 px-3 py-2 text-xs font-semibold text-ink shadow-sm backdrop-blur-sm hover:bg-white"
            >
              <DynamicIcon name="MapPin" className="size-3.5" />
              Accra, Ghana
              <DynamicIcon name="Maximize2" className="size-3 text-muted" />
            </button>
          ) : (
            <span className="flex items-center gap-1.5 rounded-lg border border-border-subtle bg-white/90 px-3 py-2 text-xs font-semibold text-ink shadow-sm backdrop-blur-sm">
              <DynamicIcon name="MapPin" className="size-3.5" />
              Accra, Ghana
            </span>
          )}
          <div className="flex flex-col gap-2">
            {expanded && (
              <button
                onClick={onCollapse}
                aria-label="Collapse map"
                className="flex size-10 items-center justify-center rounded-full border border-border-subtle bg-white shadow-sm hover:bg-surface-muted"
              >
                <DynamicIcon name="X" className="size-4" />
              </button>
            )}
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
            <button
              key={listing.id}
              onClick={() => setSelectedId((current) => (current === listing.id ? null : listing.id))}
              className={cn(
                "absolute -translate-x-1/2 rounded-full px-3 py-1.5 text-xs font-bold whitespace-nowrap text-white shadow-md transition-transform hover:scale-105",
                selectedId === listing.id ? "z-10 bg-brand-navy ring-2 ring-white" : "bg-brand-gold-dark",
              )}
              style={pos}
            >
              {listing.price}
            </button>
          );
        })}

        {selected && (
          <div
            className="absolute z-20 w-56 -translate-x-1/2 -translate-y-[calc(100%+14px)] rounded-xl border border-border-subtle bg-white p-3 shadow-xl"
            style={{ top: positions[listings.indexOf(selected) % positions.length].top, left: positions[listings.indexOf(selected) % positions.length].left }}
          >
            {/* z-10: without an explicit stack order, this positioned
                sibling loses to the image wrapper below purely on DOM
                order (both are position:relative/absolute with z-index:auto,
                so the later one paints on top) -- that silently made this
                button unclickable, covered by its own thumbnail. */}
            <button
              onClick={() => setSelectedId(null)}
              aria-label="Close"
              className="absolute top-2 right-2 z-10 text-muted hover:text-ink"
            >
              <DynamicIcon name="X" className="size-3.5" />
            </button>
            <div className="relative mb-2 h-24 w-full overflow-hidden rounded-lg">
              <Image src={selected.images[0].src} alt={selected.images[0].alt} fill className="object-cover" />
            </div>
            <p className="text-sm font-semibold text-ink">{selected.price}</p>
            <p className="text-xs text-muted">{selected.propertyType}</p>
            {detailHref && (
              <Link
                href={detailHref(selected.id)}
                className="mt-2 flex items-center gap-1 text-xs font-semibold text-brand-gold-dark hover:underline"
              >
                View Details
                <DynamicIcon name="ArrowRight" className="size-3" />
              </Link>
            )}
          </div>
        )}

        <button className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-border-subtle bg-white px-6 py-2 text-xs font-semibold text-ink shadow-md hover:bg-surface-muted">
          <DynamicIcon name="Search" className="size-3.5" />
          Search this area
        </button>
      </div>
    </div>
  );
}
