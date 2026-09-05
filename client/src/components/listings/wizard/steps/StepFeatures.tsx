import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { cn } from "@/lib/cn";
import { FEATURES, type Listing } from "@/types/listing";

interface StepProps {
  draft: Listing;
  onChange: (patch: Partial<Listing>) => void;
}

/** Step 6 — Features & Amenities: a toggleable chip grid. Uses its own
 * FEATURES list rather than the Stay page's AMENITIES — hotel amenities
 * (WiFi/Pool/Dining) and a house's own features (security, borehole,
 * solar) are different domains that happen to overlap on a couple of
 * entries, not one shared taxonomy. */
export function StepFeatures({ draft, onChange }: StepProps) {
  function toggle(id: string) {
    const next = draft.features.includes(id) ? draft.features.filter((f) => f !== id) : [...draft.features, id];
    onChange({ features: next });
  }

  return (
    <div className="flex flex-wrap gap-2">
      {FEATURES.map((feature) => {
        const active = draft.features.includes(feature.id);
        return (
          <button
            key={feature.id}
            type="button"
            onClick={() => toggle(feature.id)}
            className={cn(
              "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold",
              active
                ? "border-brand-gold-dark bg-brand-gold-dark/10 text-brand-gold-dark"
                : "border-border-subtle text-muted hover:bg-surface-muted",
            )}
          >
            <DynamicIcon name={feature.icon} className="size-3.5" />
            {feature.label}
          </button>
        );
      })}
    </div>
  );
}
