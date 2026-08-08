import { PropertiesFilterRow } from "@/components/properties/PropertiesFilterRow";
import { PropertyListingCard } from "@/components/properties/PropertyListingCard";
import { PropertyMapPanel } from "@/components/properties/PropertyMapPanel";
import { PROPERTY_LISTINGS } from "@/lib/mock-data";

/** "Properties" page — Figma node 3340:1485. Header + filter row, then a
 * split layout: a scrollable feed of listing cards on the left (7/12) and
 * a sticky map on the right (5/12), matching the page's exact 7:5 column
 * split. Desktop-focused per this app's standing scope decision — below
 * `lg:` the map just stacks under the feed instead of sitting beside it. */
export default function PropertiesPage() {
  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-4 px-4 py-6 sm:px-6 lg:px-10">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-[28px] font-semibold text-ink">Properties</h1>
        <p className="text-sm text-muted">Discover properties shared by owners, agents and developers.</p>
      </div>

      <PropertiesFilterRow />

      <div className="grid grid-cols-1 gap-6 pt-2 lg:grid-cols-12">
        <div className="flex flex-col gap-6 pb-12 lg:col-span-7">
          {PROPERTY_LISTINGS.map((listing) => (
            <PropertyListingCard key={listing.id} listing={listing} />
          ))}
        </div>
        <div className="lg:col-span-5">
          <PropertyMapPanel listings={PROPERTY_LISTINGS} />
        </div>
      </div>
    </div>
  );
}
