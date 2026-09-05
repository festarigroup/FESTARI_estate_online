"use client";

import { useState } from "react";
import { DynamicIcon } from "@/components/ui/DynamicIcon";

interface MarketplaceSearchBarProps {
  initialQuery: string;
  initialLocation: string;
  onSearch: (values: { query: string; location: string }) => void;
}

/** The universal search bar — one free-text field ("2 bedroom apartment
 * Tarkwa", "excavator hire", "electrician near me") plus a location
 * refinement, submitted together as a single query. Category narrowing is
 * a separate control (CategoryChips, below this bar on the page) rather
 * than a third field here, so there's exactly one place that sets category
 * instead of two controls that could disagree.
 *
 * Search only fires on submit (Enter or the button), not per keystroke —
 * matching how a real paginated backend search should behave, and avoiding
 * a network round-trip (mocked or not) on every character typed. */
export function MarketplaceSearchBar({ initialQuery, initialLocation, onSearch }: MarketplaceSearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const [location, setLocation] = useState(initialLocation);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSearch({ query: query.trim(), location: location.trim() });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 rounded-2xl border border-border-subtle bg-white p-3 sm:flex-row sm:items-center"
    >
      <div className="flex flex-1 items-center gap-2 rounded-full border border-border-subtle bg-surface-muted px-4 py-2.5">
        <DynamicIcon name="Search" className="size-4 shrink-0 text-muted" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search properties, stays, artisans, materials, equipment..."
          className="w-full bg-transparent text-sm text-ink placeholder:text-muted focus:outline-none"
        />
      </div>

      <div className="flex items-center gap-2 rounded-full border border-border-subtle bg-surface-muted px-4 py-2.5 sm:w-64">
        <DynamicIcon name="MapPin" className="size-4 shrink-0 text-muted" />
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location (e.g. Tarkwa)"
          className="w-full bg-transparent text-sm text-ink placeholder:text-muted focus:outline-none"
        />
      </div>

      <button
        type="submit"
        className="flex items-center justify-center gap-2 rounded-full bg-brand-navy px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-navy-light"
      >
        <DynamicIcon name="Search" className="size-4" />
        Search
      </button>
    </form>
  );
}
