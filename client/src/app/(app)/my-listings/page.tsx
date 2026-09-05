"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { PortfolioSummaryCards } from "@/components/listings/PortfolioSummaryCards";
import { StatusTabs } from "@/components/listings/StatusTabs";
import { ListingCard } from "@/components/listings/ListingCard";
import { ListingTableRow } from "@/components/listings/ListingTableRow";
import { listMyListings, countsByStatus } from "@/lib/mocks/listings";
import { cn } from "@/lib/cn";
import type { Listing, ListingStatus } from "@/types/listing";

type ViewMode = "grid" | "table";

function MyListingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const statusParam = searchParams.get("status");
  const activeStatus: ListingStatus | "all" = statusParam && statusParam !== "all" ? (statusParam as ListingStatus) : "all";

  const [items, setItems] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<ViewMode>("grid");

  useEffect(() => {
    let cancelled = false;
    listMyListings()
      .then((result) => {
        if (!cancelled) setItems(result.items);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const counts = useMemo(() => countsByStatus(items), [items]);
  const filtered = useMemo(
    () => (activeStatus === "all" ? items : items.filter((listing) => listing.status === activeStatus)),
    [items, activeStatus],
  );

  function handleStatusChange(status: ListingStatus | "all") {
    router.replace(status === "all" ? "/my-listings" : `/my-listings?status=${status}`);
  }

  function handleUpdated(updated: Listing) {
    setItems((prev) => prev.map((listing) => (listing.id === updated.id ? updated : listing)));
  }

  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-4 px-4 py-6 sm:px-6 lg:px-0">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="font-heading text-[28px] font-semibold text-ink">My Listings</h1>
          <p className="text-sm text-muted">Your property portfolio — create, edit, and manage every listing you own.</p>
        </div>
        <Link
          href="/my-listings/new"
          className="flex items-center gap-2 rounded-full bg-brand-gold px-5 py-2.5 text-sm font-semibold text-brand-navy hover:brightness-95"
        >
          <DynamicIcon name="Plus" className="size-4" />
          New Listing
        </Link>
      </div>

      <PortfolioSummaryCards items={items} counts={counts} />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <StatusTabs active={activeStatus} counts={counts} total={items.length} onChange={handleStatusChange} />
        <div className="flex shrink-0 items-center gap-1 rounded-full border border-border-subtle bg-white p-1">
          <button
            onClick={() => setView("grid")}
            aria-label="Grid view"
            className={cn("rounded-full p-1.5", view === "grid" ? "bg-brand-navy text-white" : "text-muted hover:bg-surface-muted")}
          >
            <DynamicIcon name="LayoutGrid" className="size-4" />
          </button>
          <button
            onClick={() => setView("table")}
            aria-label="Table view"
            className={cn("rounded-full p-1.5", view === "table" ? "bg-brand-navy text-white" : "text-muted hover:bg-surface-muted")}
          >
            <DynamicIcon name="List" className="size-4" />
          </button>
        </div>
      </div>

      {loading ? (
        <p className="py-8 text-center text-sm text-muted">Loading your listings...</p>
      ) : filtered.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted">No listings in this status yet.</p>
      ) : view === "grid" ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((listing) => (
            <ListingCard key={listing.id} listing={listing} onUpdated={handleUpdated} />
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-[19px] border border-border-subtle bg-white p-4 lg:rounded-[24px]">
          <table className="w-full min-w-[720px] text-left">
            <thead>
              <tr className="border-b border-border-subtle text-xs font-semibold text-muted">
                <th className="pb-2 pr-4 font-semibold">Listing</th>
                <th className="pb-2 pr-4 font-semibold">Status</th>
                <th className="pb-2 pr-4 font-semibold">Price</th>
                <th className="pb-2 pr-4 font-semibold">Updated</th>
                <th className="pb-2 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((listing) => (
                <ListingTableRow key={listing.id} listing={listing} onUpdated={handleUpdated} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function MyListingsPage() {
  return (
    <Suspense fallback={<p className="py-20 text-center text-sm text-muted">Loading...</p>}>
      <MyListingsContent />
    </Suspense>
  );
}
