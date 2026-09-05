import { FIELD_CLASS, FieldLabel } from "@/components/listings/wizard/WizardShell";
import type { Listing } from "@/types/listing";

interface StepProps {
  draft: Listing;
  onChange: (patch: Partial<Listing>) => void;
}

function numberOrUndefined(value: string): number | undefined {
  return value.trim() === "" ? undefined : Number(value);
}

/** Step 4 — Property Details: a distinct field group per category
 * (residential/land/commercial), switched on `draft.category` rather than
 * showing all three at once — the spec calls these out as "distinct field
 * groups", not one shared form. */
export function StepDetails({ draft, onChange }: StepProps) {
  if (draft.category === "land") {
    const land = draft.land;
    return (
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1.5">
            <FieldLabel>Plot size</FieldLabel>
            <input
              type="number"
              min="0"
              value={land.plotSize ?? ""}
              onChange={(e) => onChange({ land: { ...land, plotSize: numberOrUndefined(e.target.value) } })}
              placeholder="e.g. 100"
              className={FIELD_CLASS}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <FieldLabel>Unit</FieldLabel>
            <select
              value={land.plotUnit ?? "plots"}
              onChange={(e) => onChange({ land: { ...land, plotUnit: e.target.value as "sqm" | "acres" | "plots" } })}
              className={FIELD_CLASS}
            >
              <option value="plots">Plots</option>
              <option value="acres">Acres</option>
              <option value="sqm">sqm</option>
            </select>
          </label>
        </div>
        <label className="flex flex-col gap-1.5">
          <FieldLabel>Title type</FieldLabel>
          <input
            value={land.titleType ?? ""}
            onChange={(e) => onChange({ land: { ...land, titleType: e.target.value } })}
            placeholder="e.g. Registered, Indenture"
            className={FIELD_CLASS}
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <FieldLabel>Topography</FieldLabel>
          <input
            value={land.topography ?? ""}
            onChange={(e) => onChange({ land: { ...land, topography: e.target.value } })}
            placeholder="e.g. Flat, Sloped, Coastal"
            className={FIELD_CLASS}
          />
        </label>
      </div>
    );
  }

  if (draft.category === "commercial") {
    const commercial = draft.commercial;
    return (
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1.5">
            <FieldLabel>Floor area (sqm)</FieldLabel>
            <input
              type="number"
              min="0"
              value={commercial.floorAreaSqm ?? ""}
              onChange={(e) => onChange({ commercial: { ...commercial, floorAreaSqm: numberOrUndefined(e.target.value) } })}
              className={FIELD_CLASS}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <FieldLabel>Units</FieldLabel>
            <input
              type="number"
              min="0"
              value={commercial.unitsCount ?? ""}
              onChange={(e) => onChange({ commercial: { ...commercial, unitsCount: numberOrUndefined(e.target.value) } })}
              className={FIELD_CLASS}
            />
          </label>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1.5">
            <FieldLabel>Zoning</FieldLabel>
            <input
              value={commercial.zoning ?? ""}
              onChange={(e) => onChange({ commercial: { ...commercial, zoning: e.target.value } })}
              placeholder="e.g. Commercial, Mixed-Use"
              className={FIELD_CLASS}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <FieldLabel>Floor level</FieldLabel>
            <input
              value={commercial.floorLevel ?? ""}
              onChange={(e) => onChange({ commercial: { ...commercial, floorLevel: e.target.value } })}
              placeholder="e.g. 3rd Floor"
              className={FIELD_CLASS}
            />
          </label>
        </div>
      </div>
    );
  }

  // Residential (also the fallback if no category was picked yet).
  const residential = draft.residential;
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-3">
        <label className="flex flex-col gap-1.5">
          <FieldLabel>Bedrooms</FieldLabel>
          <input
            type="number"
            min="0"
            value={residential.bedrooms ?? ""}
            onChange={(e) => onChange({ residential: { ...residential, bedrooms: numberOrUndefined(e.target.value) } })}
            className={FIELD_CLASS}
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <FieldLabel>Bathrooms</FieldLabel>
          <input
            type="number"
            min="0"
            step="0.5"
            value={residential.bathrooms ?? ""}
            onChange={(e) => onChange({ residential: { ...residential, bathrooms: numberOrUndefined(e.target.value) } })}
            className={FIELD_CLASS}
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <FieldLabel>Area (sqm)</FieldLabel>
          <input
            type="number"
            min="0"
            value={residential.areaSqm ?? ""}
            onChange={(e) => onChange({ residential: { ...residential, areaSqm: numberOrUndefined(e.target.value) } })}
            className={FIELD_CLASS}
          />
        </label>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col gap-1.5">
          <FieldLabel>Parking spaces</FieldLabel>
          <input
            type="number"
            min="0"
            value={residential.parkingSpaces ?? ""}
            onChange={(e) => onChange({ residential: { ...residential, parkingSpaces: numberOrUndefined(e.target.value) } })}
            className={FIELD_CLASS}
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <FieldLabel>Year built</FieldLabel>
          <input
            type="number"
            min="0"
            value={residential.yearBuilt ?? ""}
            onChange={(e) => onChange({ residential: { ...residential, yearBuilt: numberOrUndefined(e.target.value) } })}
            className={FIELD_CLASS}
          />
        </label>
      </div>
    </div>
  );
}
