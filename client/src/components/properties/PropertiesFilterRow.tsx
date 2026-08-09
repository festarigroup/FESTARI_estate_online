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
  mapExpanded: boolean;
  onToggleMapView: () => void;
}

const ALL_TYPES = "All Types";
const ANY_PRICE = "Any Price";
const ALL_LOCATIONS = "All Locations";

/** Filter row from the Properties page (Figma node 3340:2394), made
 * functional: Property Type/Price Range/Location each narrow
 * PROPERTY_LISTINGS client-side (see PropertiesBrowser, which owns the
 * actual filtering logic — this component is just the UI for it). "All
 * Filters" resets everything at once, enabled only once a filter is
 * active. "Map View" toggles PropertiesBrowser's expanded map layout —
 * swaps to "List View" once expanded, so there's always an obvious way
 * back. Sticky below the fixed TopNavBar so the filters (and the map
 * toggle) stay reachable while scrolling a long results list — not a
 * Figma spec, just this app's own call, same as ConciergeCard's. */
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
  mapExpanded,
  onToggleMapView,
}: PropertiesFilterRowProps) {
  return (
    <div className="sticky top-[73px] z-10 flex flex-wrap items-center justify-between gap-3 bg-background py-3 lg:top-[112px]">
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
        <button
          onClick={onToggleMapView}
          className="flex items-center gap-2 rounded-full bg-brand-navy px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-brand-navy-light"
        >
          <DynamicIcon name={mapExpanded ? "Building2" : "Layers"} className="size-3.5" />
          {mapExpanded ? "List View" : "Map View"}
        </button>
      </div>
    </div>
  );
}
