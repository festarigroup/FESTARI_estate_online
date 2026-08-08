import { DynamicIcon } from "@/components/ui/DynamicIcon";

const FILTER_PILLS = ["Property Type", "Price Range", "Location"];

/** Filter row from the Properties page (Figma node 3340:2394). Visual only:
 * Figma doesn't specify what these dropdowns actually filter by or what
 * "Map View" switches to, and wiring real search/filter logic wasn't part
 * of this request — the feed and map are already both visible side by
 * side on desktop, so there's nothing for "Map View" to toggle here. This
 * reproduces the exact chrome as a starting point for that logic later. */
export function PropertiesFilterRow() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
      <div className="flex flex-wrap items-center gap-3">
        {FILTER_PILLS.map((label) => (
          <button
            key={label}
            className="flex items-center gap-2 rounded-full border border-border-subtle bg-white px-4 py-2 text-xs font-semibold text-ink hover:bg-surface-muted"
          >
            {label}
            <DynamicIcon name="ChevronDown" className="size-3" />
          </button>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <button className="flex items-center gap-2 rounded-full border border-border-subtle bg-white px-4 py-2 text-xs font-semibold text-ink hover:bg-surface-muted">
          <DynamicIcon name="Settings2" className="size-3.5" />
          All Filters
        </button>
        <button className="flex items-center gap-2 rounded-full bg-brand-navy px-4 py-2 text-xs font-semibold text-white shadow-sm">
          <DynamicIcon name="Layers" className="size-3.5" />
          Map View
        </button>
      </div>
    </div>
  );
}
