import { FIELD_CLASS, FieldLabel } from "@/components/listings/wizard/WizardShell";
import type { Listing } from "@/types/listing";

interface StepProps {
  draft: Listing;
  onChange: (patch: Partial<Listing>) => void;
}

const PROPERTY_TYPE_PLACEHOLDER: Record<NonNullable<Listing["category"]>, string> = {
  residential: "e.g. 4 Bedroom Detached House",
  land: "e.g. Residential Plot",
  commercial: "e.g. Office Suite",
};

/** Step 2 — Property Identity: the listing's title and a free-text
 * property type, both of which read back on every card and on
 * PropertyDetailsView exactly as typed here. */
export function StepIdentity({ draft, onChange }: StepProps) {
  return (
    <div className="flex flex-col gap-4">
      <label className="flex flex-col gap-1.5">
        <FieldLabel>Listing title</FieldLabel>
        <input
          value={draft.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="e.g. 4 Bedroom Detached House, East Legon"
          className={FIELD_CLASS}
        />
      </label>
      <label className="flex flex-col gap-1.5">
        <FieldLabel>Property type</FieldLabel>
        <input
          value={draft.propertyType}
          onChange={(e) => onChange({ propertyType: e.target.value })}
          placeholder={draft.category ? PROPERTY_TYPE_PLACEHOLDER[draft.category] : "e.g. Detached House"}
          className={FIELD_CLASS}
        />
      </label>
      {draft.category === "residential" && (
        <label className="flex items-center gap-2 text-sm text-ink">
          <input
            type="checkbox"
            checked={draft.residential.furnished ?? false}
            onChange={(e) => onChange({ residential: { ...draft.residential, furnished: e.target.checked } })}
            className="size-4 rounded border-border-subtle accent-brand-navy"
          />
          Furnished
        </label>
      )}
    </div>
  );
}
