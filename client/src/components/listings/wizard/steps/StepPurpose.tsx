import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { cn } from "@/lib/cn";
import { LISTING_PURPOSES, PROPERTY_CATEGORIES, type Listing } from "@/types/listing";

interface StepProps {
  draft: Listing;
  onChange: (patch: Partial<Listing>) => void;
}

/** Step 1 — Listing Purpose: what the listing is for (Sale/Rent/Lease) and
 * which top-level category it belongs to. Category drives which field
 * groups Step 4 (Property Details) shows, so it's asked up front rather
 * than folded into Step 2. */
export function StepPurpose({ draft, onChange }: StepProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="font-heading text-base text-ink">What is this listing for?</h2>
        <div className="grid grid-cols-3 gap-3">
          {LISTING_PURPOSES.map((purpose) => (
            <button
              key={purpose.id}
              type="button"
              onClick={() => onChange({ purpose: purpose.id })}
              className={cn(
                "rounded-lg border px-4 py-3 text-sm font-semibold",
                draft.purpose === purpose.id
                  ? "border-brand-navy bg-brand-navy text-white"
                  : "border-border-subtle text-ink hover:bg-surface-muted",
              )}
            >
              {purpose.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="font-heading text-base text-ink">Property category</h2>
        <div className="grid grid-cols-3 gap-3">
          {PROPERTY_CATEGORIES.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => onChange({ category: category.id })}
              className={cn(
                "flex flex-col items-center gap-2 rounded-lg border px-4 py-4 text-sm font-semibold",
                draft.category === category.id
                  ? "border-brand-navy bg-brand-navy text-white"
                  : "border-border-subtle text-ink hover:bg-surface-muted",
              )}
            >
              <DynamicIcon name={category.icon} className="size-5" />
              {category.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
