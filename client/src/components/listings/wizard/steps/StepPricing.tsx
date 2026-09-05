import { FIELD_CLASS, FieldLabel } from "@/components/listings/wizard/WizardShell";
import { cn } from "@/lib/cn";
import type { Listing, ListingPricing } from "@/types/listing";

interface StepProps {
  draft: Listing;
  onChange: (patch: Partial<Listing>) => void;
}

const UNIT_OPTIONS: { id: ListingPricing["unit"]; label: string }[] = [
  { id: "total", label: "Total" },
  { id: "per_month", label: "Per Month" },
  { id: "per_year", label: "Per Year" },
  { id: "per_plot", label: "Per Plot" },
];

/** Step 5 — Pricing & Terms. Defaults the unit to something sensible for
 * the purpose/category picked in Step 1 (rent -> per month, land -> per
 * plot, everything else -> total) the first time this step is reached,
 * rather than always defaulting to "Total" regardless of context. */
export function StepPricing({ draft, onChange }: StepProps) {
  const pricing: ListingPricing = draft.pricing ?? {
    amount: 0,
    currency: "GHS",
    unit: draft.purpose === "rent" || draft.purpose === "lease" ? "per_month" : draft.category === "land" ? "per_plot" : "total",
    negotiable: false,
  };

  function updatePricing(patch: Partial<ListingPricing>) {
    onChange({ pricing: { ...pricing, ...patch } });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col gap-1.5">
          <FieldLabel>Currency</FieldLabel>
          <input value={pricing.currency} onChange={(e) => updatePricing({ currency: e.target.value })} className={FIELD_CLASS} />
        </label>
        <label className="flex flex-col gap-1.5">
          <FieldLabel>Amount</FieldLabel>
          <input
            type="number"
            min="0"
            value={pricing.amount || ""}
            onChange={(e) => updatePricing({ amount: Number(e.target.value) || 0 })}
            placeholder="e.g. 850000"
            className={FIELD_CLASS}
          />
        </label>
      </div>

      <div className="flex flex-col gap-1.5">
        <FieldLabel>Unit</FieldLabel>
        <div className="grid grid-cols-4 gap-2">
          {UNIT_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => updatePricing({ unit: option.id })}
              className={cn(
                "rounded-lg border px-3 py-2 text-xs font-semibold",
                pricing.unit === option.id
                  ? "border-brand-navy bg-brand-navy text-white"
                  : "border-border-subtle text-ink hover:bg-surface-muted",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-ink">
        <input
          type="checkbox"
          checked={pricing.negotiable}
          onChange={(e) => updatePricing({ negotiable: e.target.checked })}
          className="size-4 rounded border-border-subtle accent-brand-navy"
        />
        Price is negotiable
      </label>
    </div>
  );
}
