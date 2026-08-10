"use client";

import { useMemo, useState } from "react";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { PropertiesFilterRow } from "@/components/properties/PropertiesFilterRow";
import { PropertyListingCard } from "@/components/properties/PropertyListingCard";
import { PropertyMapPanel } from "@/components/properties/PropertyMapPanel";
import type { PropertyPost } from "@/types/home";

const ALL_TYPES = "All Types";
const ANY_PRICE = "Any Price";
const ALL_LOCATIONS = "All Locations";

// Buckets straddle the sale/rent scale on purpose (rent runs a few
// thousand a month, sale runs into the millions) rather than needing two
// separate range sets — "Under GHS 100,000" naturally catches every rental
// in this data without a rent/sale switch on the filter itself.
const PRICE_RANGES: { label: string; test: (n: number) => boolean }[] = [
  { label: ANY_PRICE, test: () => true },
  { label: "Under GHS 100,000", test: (n) => n < 100_000 },
  { label: "GHS 100,000 – 1,000,000", test: (n) => n >= 100_000 && n < 1_000_000 },
  { label: "GHS 1,000,000 – 5,000,000", test: (n) => n >= 1_000_000 && n < 5_000_000 },
  { label: "Above GHS 5,000,000", test: (n) => n >= 5_000_000 },
];

function parsePrice(price: string): number {
  const match = price.replace(/,/g, "").match(/[\d.]+/);
  return match ? Number(match[0]) : 0;
}

/** Owns the Properties page's filter state and applies it client-side —
 * Figma's filter row (node 3340:2394) doesn't specify what these
 * dropdowns actually filter by, so the categories/ranges here are this
 * app's own reasonable default, not a pulled design. Property Type and
 * Location options are derived from whatever's actually in `listings`
 * rather than a fixed list, so they never offer a choice that would
 * return zero results. */
export function PropertiesBrowser({ listings }: { listings: PropertyPost[] }) {
  const [propertyType, setPropertyType] = useState(ALL_TYPES);
  const [priceRange, setPriceRange] = useState(ANY_PRICE);
  const [location, setLocation] = useState(ALL_LOCATIONS);
  const [mapExpanded, setMapExpanded] = useState(false);

  const propertyTypeOptions = useMemo(
    () => [ALL_TYPES, ...new Set(listings.map((l) => l.propertyType))],
    [listings],
  );
  const locationOptions = useMemo(() => [ALL_LOCATIONS, ...new Set(listings.map((l) => l.location))], [listings]);
  const priceRangeOptions = useMemo(() => PRICE_RANGES.map((r) => r.label), []);

  const filtered = useMemo(() => {
    const priceTest = PRICE_RANGES.find((r) => r.label === priceRange)?.test ?? (() => true);
    return listings.filter(
      (listing) =>
        (propertyType === ALL_TYPES || listing.propertyType === propertyType) &&
        (location === ALL_LOCATIONS || listing.location === location) &&
        priceTest(parsePrice(listing.price)),
    );
  }, [listings, propertyType, location, priceRange]);

  const activeFilterCount = [propertyType !== ALL_TYPES, priceRange !== ANY_PRICE, location !== ALL_LOCATIONS].filter(
    Boolean,
  ).length;

  function handleClearFilters() {
    setPropertyType(ALL_TYPES);
    setPriceRange(ANY_PRICE);
    setLocation(ALL_LOCATIONS);
  }

  return (
    <>
      <PropertiesFilterRow
        propertyType={propertyType}
        propertyTypeOptions={propertyTypeOptions}
        onPropertyTypeChange={setPropertyType}
        priceRange={priceRange}
        priceRangeOptions={priceRangeOptions}
        onPriceRangeChange={setPriceRange}
        location={location}
        locationOptions={locationOptions}
        onLocationChange={setLocation}
        activeFilterCount={activeFilterCount}
        onClearFilters={handleClearFilters}
        mapExpanded={mapExpanded}
        onToggleMapView={() => setMapExpanded((v) => !v)}
      />

      {mapExpanded ? (
        <div className="pt-2 pb-12">
          <PropertyMapPanel
            listings={filtered}
            expanded
            onCollapse={() => setMapExpanded(false)}
            detailHref={(id) => `/properties/${id}`}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 pt-2 lg:grid-cols-12">
          <div className="flex flex-col gap-6 pb-12 lg:col-span-7">
            {filtered.length > 0 ? (
              filtered.map((listing) => <PropertyListingCard key={listing.id} listing={listing} />)
            ) : (
              <div className="flex flex-col items-center gap-3 rounded-[39px] border border-dashed border-border-subtle bg-white py-16 text-center">
                <span className="flex size-12 items-center justify-center rounded-full bg-surface-muted">
                  <DynamicIcon name="Search" className="size-5 text-muted" />
                </span>
                <p className="text-sm font-semibold text-ink">No properties match these filters</p>
                <button onClick={handleClearFilters} className="text-sm font-semibold text-brand-navy hover:underline">
                  Clear filters
                </button>
              </div>
            )}
          </div>
          <div className="lg:col-span-5">
            <PropertyMapPanel
              listings={filtered}
              onExpand={() => setMapExpanded(true)}
              detailHref={(id) => `/properties/${id}`}
            />
          </div>
        </div>
      )}
    </>
  );
}
