import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { FIELD_CLASS, FieldLabel } from "@/components/listings/wizard/WizardShell";
import { cn } from "@/lib/cn";
import type { AddressPrecision, Listing } from "@/types/listing";

interface StepProps {
  draft: Listing;
  onChange: (patch: Partial<Listing>) => void;
  /** A same-address, same-category listing already owned by this user, if
   * the mock duplicate check found one — see findDuplicateListing(). */
  duplicate?: Listing | null;
}

const PRECISION_OPTIONS: { id: AddressPrecision; label: string; description: string }[] = [
  { id: "exact", label: "Exact", description: "Shows the full street address publicly." },
  { id: "approximate", label: "Approximate", description: "Shows only the area and city publicly." },
  { id: "hidden", label: "Hidden", description: "Shows only the city and region publicly." },
];

/** Step 3 — Location: address fields, a map-pin placeholder (no real map
 * integration in this mock — see PropertyMapPanel for the app's one real
 * map, which renders a list of already-published listings rather than
 * picking a single new coordinate), and the public-address precision
 * control the spec calls out by name. Surfaces the duplicate-listing
 * warning inline once an address+city match this owner's own other
 * listing. */
export function StepLocation({ draft, onChange, duplicate }: StepProps) {
  const location = draft.location;

  function updateLocation(patch: Partial<Listing["location"]>) {
    onChange({ location: { ...location, ...patch } });
  }

  return (
    <div className="flex flex-col gap-4">
      {duplicate && (
        <div className="flex items-start gap-2 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <DynamicIcon name="TriangleAlert" className="size-4 shrink-0 translate-y-0.5" />
          <span>
            You already have a listing at this address: <strong>{duplicate.title || "Untitled listing"}</strong> (
            {duplicate.status.replace(/_/g, " ")}). Double-check this isn&apos;t a duplicate before continuing.
          </span>
        </div>
      )}

      <label className="flex flex-col gap-1.5">
        <FieldLabel>Street address</FieldLabel>
        <input
          value={location.address}
          onChange={(e) => updateLocation({ address: e.target.value })}
          placeholder="e.g. 12 Ridge Avenue"
          className={FIELD_CLASS}
        />
      </label>
      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col gap-1.5">
          <FieldLabel>Area / Suburb</FieldLabel>
          <input
            value={location.area}
            onChange={(e) => updateLocation({ area: e.target.value })}
            placeholder="e.g. East Legon"
            className={FIELD_CLASS}
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <FieldLabel>City</FieldLabel>
          <input
            value={location.city}
            onChange={(e) => updateLocation({ city: e.target.value })}
            placeholder="e.g. Accra"
            className={FIELD_CLASS}
          />
        </label>
      </div>
      <label className="flex flex-col gap-1.5">
        <FieldLabel>Region</FieldLabel>
        <input
          value={location.region}
          onChange={(e) => updateLocation({ region: e.target.value })}
          placeholder="e.g. Greater Accra"
          className={FIELD_CLASS}
        />
      </label>

      {/* Map-pin placeholder — this mock has no real map picker; it just
          reflects that a pin would live here, and lets a value be nudged
          for demo purposes. */}
      <div className="flex flex-col gap-2">
        <FieldLabel>Map pin</FieldLabel>
        <div className="relative flex h-[160px] items-center justify-center overflow-hidden rounded-lg bg-surface-muted">
          <DynamicIcon name="MapPinned" className="size-8 text-brand-navy" />
          <button
            type="button"
            onClick={() => updateLocation({ lat: 5.6037, lng: -0.187 })}
            className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-brand-navy shadow-sm hover:bg-surface-muted"
          >
            <DynamicIcon name="Navigation" className="size-3.5" />
            Drop pin at current location
          </button>
        </div>
        {location.lat != null && (
          <p className="text-xs text-muted">
            Pin set at {location.lat.toFixed(4)}, {location.lng?.toFixed(4)}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <FieldLabel>Public address precision</FieldLabel>
        <div className="grid grid-cols-3 gap-3">
          {PRECISION_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => updateLocation({ precision: option.id })}
              title={option.description}
              className={cn(
                "rounded-lg border px-3 py-2.5 text-left text-sm font-semibold",
                location.precision === option.id
                  ? "border-brand-navy bg-brand-navy text-white"
                  : "border-border-subtle text-ink hover:bg-surface-muted",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
        <p className="text-xs text-muted">
          {PRECISION_OPTIONS.find((o) => o.id === location.precision)?.description}
        </p>
      </div>
    </div>
  );
}
