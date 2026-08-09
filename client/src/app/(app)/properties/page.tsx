import { PropertiesBrowser } from "@/components/properties/PropertiesBrowser";
import { PROPERTY_LISTINGS } from "@/lib/mock-data";

/** "Properties" page — Figma node 3340:1485. Header, then PropertiesBrowser
 * owns the filter row + the split layout: a scrollable feed of listing
 * cards on the left (7/12) and a sticky map on the right (5/12), matching
 * the page's exact 7:5 column split. Desktop-focused per this app's
 * standing scope decision — below `lg:` the map just stacks under the
 * feed instead of sitting beside it. */
export default function PropertiesPage() {
  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-4 px-4 py-6 sm:px-6 lg:px-10">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-[28px] font-semibold text-ink">Properties</h1>
        <p className="text-sm text-muted">Discover properties shared by owners, agents and developers.</p>
      </div>

      <PropertiesBrowser listings={PROPERTY_LISTINGS} />
    </div>
  );
}
