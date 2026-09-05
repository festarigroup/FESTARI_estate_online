"use client";

import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { cn } from "@/lib/cn";
import { CATEGORY_META, MARKETPLACE_CATEGORIES, type MarketplaceCategory } from "@/types/marketplace";

interface CategoryChipsProps {
  active: MarketplaceCategory | "all";
  onChange: (category: MarketplaceCategory | "all") => void;
}

/** Category taxonomy filter — one chip per Biltlinx Marketplace category
 * plus "All", matching CATEGORY_META (the same registry each card's own
 * badge reads from, so the chip label always matches what a matching card
 * displays). A horizontally-scrolling row rather than wrapping: ten
 * categories plus "All" don't fit one line at any reasonable width, and a
 * scroll rail (same idea as StayCategoryNav's tabs) keeps the row a single
 * fixed height instead of growing the page. */
export function CategoryChips({ active, onChange }: CategoryChipsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <button
        onClick={() => onChange("all")}
        className={cn(
          "flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold whitespace-nowrap",
          active === "all"
            ? "border-brand-navy bg-brand-navy text-white"
            : "border-border-subtle bg-white text-ink hover:bg-surface-muted",
        )}
      >
        All Categories
      </button>
      {MARKETPLACE_CATEGORIES.map((category) => {
        const meta = CATEGORY_META[category];
        const isActive = active === category;
        return (
          <button
            key={category}
            onClick={() => onChange(category)}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold whitespace-nowrap",
              isActive
                ? "border-brand-navy bg-brand-navy text-white"
                : "border-border-subtle bg-white text-ink hover:bg-surface-muted",
            )}
          >
            <DynamicIcon name={meta.icon} className="size-3.5" />
            {meta.label}
          </button>
        );
      })}
    </div>
  );
}
