"use client";

import { useEffect, useState } from "react";
import { PropertiesBrowser } from "@/components/properties/PropertiesBrowser";
import { listPosts } from "@/lib/api/feed";
import { mapPost } from "@/lib/adapters";
import type { PropertyPost } from "@/types/home";

/** "Properties" page — Figma node 3340:1485. Header, then PropertiesBrowser
 * owns the filter row + the split layout: a scrollable feed of listing
 * cards on the left (7/12) and a sticky map on the right (5/12), matching
 * the page's exact 7:5 column split. Desktop-focused per this app's
 * standing scope decision — below `lg:` the map just stacks under the
 * feed instead of sitting beside it. */
export default function PropertiesPage() {
  const [listings, setListings] = useState<PropertyPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listPosts({ kind: "property", limit: 50 })
      .then(({ items }) => setListings(items.map(mapPost).filter((p): p is PropertyPost => p.kind === "property")))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    // No lg:px -- <main> already clears SideNavBar with its own 24px gap
    // and gives a 24px right margin; stacking lg:px-10 on top doubled the
    // margin past Figma's ~24px on both sides.
    <div className="mx-auto flex max-w-[1400px] flex-col gap-4 px-4 py-6 sm:px-6 lg:px-0">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-[28px] font-semibold text-ink">Properties</h1>
        <p className="text-sm text-muted">Discover properties shared by owners, agents and developers.</p>
      </div>

      {loading ? (
        <p className="py-8 text-center text-sm text-muted">Loading properties...</p>
      ) : (
        <PropertiesBrowser listings={listings} />
      )}
    </div>
  );
}
