"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { cn } from "@/lib/cn";
import { listingActions } from "@/components/listings/listingActions";
import type { Listing } from "@/types/listing";

interface ListingActionButtonsProps {
  listing: Listing;
  onUpdated: (updated: Listing) => void;
  className?: string;
}

/** The status-appropriate action buttons for one listing (Continue
 * editing/Submit for a Draft, Publish for Pending/Paused, Pause/Mark
 * Under Offer/Sold for Published, etc.) — shared between the grid card and
 * the table row so the two views never offer different actions for the
 * same listing. Every action calls straight through to the mock module and
 * reflects the result immediately, per spec ("must immediately update the
 * visible status tab"). */
export function ListingActionButtons({ listing, onUpdated, className }: ListingActionButtonsProps) {
  const [runningLabel, setRunningLabel] = useState<string | null>(null);
  const actions = listingActions(listing);

  async function run(action: (typeof actions)[number]) {
    setRunningLabel(action.label);
    try {
      const updated = await action.run(listing);
      onUpdated(updated);
      toast.success(`${listing.title || "Listing"} → ${updated.status.replace(/_/g, " ")}`);
    } catch {
      toast.error("Couldn't update this listing.");
    } finally {
      setRunningLabel(null);
    }
  }

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {listing.status === "draft" && (
        <Link
          href={`/my-listings/new?id=${listing.id}&step=1`}
          className="rounded-full border border-border-subtle px-3 py-1.5 text-xs font-semibold text-ink hover:bg-surface-muted"
        >
          Continue editing
        </Link>
      )}
      {actions.map((action) => (
        <button
          key={action.label}
          onClick={() => run(action)}
          disabled={runningLabel !== null}
          className={cn(
            "rounded-full px-3 py-1.5 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-50",
            action.variant === "primary"
              ? "bg-brand-navy text-white hover:bg-brand-navy-light"
              : "border border-border-subtle text-ink hover:bg-surface-muted",
          )}
        >
          {runningLabel === action.label ? "Updating..." : action.label}
        </button>
      ))}
    </div>
  );
}
