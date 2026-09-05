"use client";

import { useEffect, useState } from "react";
import { CategoryChips } from "@/components/marketplace/CategoryChips";
import { MarketplaceSearchBar } from "@/components/marketplace/MarketplaceSearchBar";
import { UniversalCard } from "@/components/marketplace/UniversalCard";
import { fetchMarketplaceSearch } from "@/lib/mocks/marketplace";
import type { MarketplaceCategory, MarketplaceItem } from "@/types/marketplace";

/** Biltlinx Marketplace — the price-first aggregator that searches across
 * every category (Properties, Stay, Professionals, Artisans, Services,
 * Materials, Equipment, Projects) from one entry point. Mirrors Properties'
 * and Stay's own page shape (title block, then the actual browsing UI)
 * rather than inventing a new page layout convention.
 *
 * Calls `fetchMarketplaceSearch()` only — never imports mock data directly
 * — so swapping in the real `GET /api/marketplace/search` endpoint later is
 * a one-line change inside that function, not a change here. */
export default function MarketplacePage() {
  const [category, setCategory] = useState<MarketplaceCategory | "all">("all");
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [page, setPage] = useState(1);

  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // `loading` is only ever set to `true` from the event handlers below (the
  // initial search-on-mount starts from useState(true)'s own default) — the
  // effect itself only ever turns it back off once a response lands. Purely
  // calling setLoading(true) synchronously inside the effect body would
  // cascade an extra render on every dependency change for no benefit.
  useEffect(() => {
    let cancelled = false;
    fetchMarketplaceSearch({ category, query, location, page })
      .then((result) => {
        if (cancelled) return;
        setItems(result.items);
        setTotal(result.total);
      })
      .catch(() => {
        if (!cancelled) {
          setItems([]);
          setTotal(0);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [category, query, location, page]);

  const limit = 12;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  function handleSearch(values: { query: string; location: string }) {
    setLoading(true);
    setPage(1);
    setQuery(values.query);
    setLocation(values.location);
  }

  function handleCategoryChange(next: MarketplaceCategory | "all") {
    setLoading(true);
    setPage(1);
    setCategory(next);
  }

  function handlePageChange(next: number) {
    setLoading(true);
    setPage(next);
  }

  return (
    // No lg:px -- <main> already clears SideNavBar with its own 24px gap
    // and gives a 24px right margin, matching Properties'/Stay's own pages.
    <div className="mx-auto flex max-w-[1400px] flex-col gap-4 px-4 py-6 sm:px-6 lg:px-0">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-[28px] font-semibold text-ink">Marketplace</h1>
        <p className="text-sm text-muted">
          Search properties, stays, professionals, artisans, materials, equipment and projects — all in one place.
        </p>
      </div>

      <MarketplaceSearchBar initialQuery={query} initialLocation={location} onSearch={handleSearch} />

      <CategoryChips active={category} onChange={handleCategoryChange} />

      {loading ? (
        <p className="py-8 text-center text-sm text-muted">Searching the marketplace...</p>
      ) : items.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted">No results match your search. Try a different category or location.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((item) => (
              <UniversalCard key={item.id} item={item} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => handlePageChange(Math.max(1, page - 1))}
                disabled={page <= 1}
                className="rounded-full border border-border-subtle bg-white px-4 py-2 text-xs font-semibold text-ink hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-xs text-muted">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
                disabled={page >= totalPages}
                className="rounded-full border border-border-subtle bg-white px-4 py-2 text-xs font-semibold text-ink hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
