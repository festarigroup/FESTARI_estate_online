"use client";

import { Dropdown, DropdownItem } from "@/components/ui/Dropdown";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { cn } from "@/lib/cn";

interface FilterPillProps {
  label: string;
  active: boolean;
  bind: { onClick: () => void; "aria-expanded": boolean };
}

function FilterPill({ label, active, bind }: FilterPillProps) {
  return (
    <button
      {...bind}
      className={cn(
        "flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold whitespace-nowrap",
        active
          ? "border-brand-navy bg-brand-navy text-white"
          : "border-border-subtle bg-white text-ink hover:bg-surface-muted",
      )}
    >
      {label}
      <DynamicIcon name="ChevronDown" className="size-3" />
    </button>
  );
}

interface PropertiesFilterRowProps {
  propertyType: string;
  propertyTypeOptions: string[];
  onPropertyTypeChange: (value: string) => void;
  priceRange: string;
  priceRangeOptions: string[];
  onPriceRangeChange: (value: string) => void;
  location: string;
  locationOptions: string[];
  onLocationChange: (value: string) => void;
  activeFilterCount: number;
  onClearFilters: () => void;
}

const ALL_TYPES = "All Types";
const ANY_PRICE = "Any Price";
const ALL_LOCATIONS = "All Locations";

/** Filter row from the Properties page (Figma node 3340:2394), made
 * functional: Property Type/Price Range/Location each narrow
 * PROPERTY_LISTINGS client-side (see PropertiesBrowser, which owns the
 * actual filtering logic — this component is just the UI for it). "All
 * Filters" resets everything at once, enabled only once a filter is
 * active. "Map View" stays decorative — the feed and map are already both
 * visible side by side on desktop, so there's nothing for it to toggle. */
export function PropertiesFilterRow({
  propertyType,
  propertyTypeOptions,
  onPropertyTypeChange,
  priceRange,
  priceRangeOptions,
  onPriceRangeChange,
  location,
  locationOptions,
  onLocationChange,
  activeFilterCount,
  onClearFilters,
}: PropertiesFilterRowProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
      <div className="flex flex-wrap items-center gap-3">
        <Dropdown
          align="left"
          trigger={(bind) => <FilterPill label={propertyType} active={propertyType !== ALL_TYPES} bind={bind} />}
        >
          {propertyTypeOptions.map((option) => (
            <DropdownItem key={option} label={option} onClick={() => onPropertyTypeChange(option)} />
          ))}
        </Dropdown>

        <Dropdown
          align="left"
          trigger={(bind) => <FilterPill label={priceRange} active={priceRange !== ANY_PRICE} bind={bind} />}
        >
          {priceRangeOptions.map((option) => (
            <DropdownItem key={option} label={option} onClick={() => onPriceRangeChange(option)} />
          ))}
        </Dropdown>

        <Dropdown
          align="left"
          trigger={(bind) => <FilterPill label={location} active={location !== ALL_LOCATIONS} bind={bind} />}
        >
          {locationOptions.map((option) => (
            <DropdownItem key={option} label={option} onClick={() => onLocationChange(option)} />
          ))}
        </Dropdown>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={onClearFilters}
          disabled={activeFilterCount === 0}
          className="flex items-center gap-2 rounded-full border border-border-subtle bg-white px-4 py-2 text-xs font-semibold text-ink hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-50"
        >
          <DynamicIcon name="Settings2" className="size-3.5" />
          All Filters
          {activeFilterCount > 0 && (
            <span className="flex size-4 items-center justify-center rounded-full bg-brand-gold-dark text-[10px] text-white">
              {activeFilterCount}
            </span>
          )}
        </button>
        <button className="flex items-center gap-2 rounded-full bg-brand-navy px-4 py-2 text-xs font-semibold text-white shadow-sm">
          <DynamicIcon name="Layers" className="size-3.5" />
          Map View
        </button>
      </div>
    </div>
  );
}
