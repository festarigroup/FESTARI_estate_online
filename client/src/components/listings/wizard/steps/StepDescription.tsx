import { FieldLabel } from "@/components/listings/wizard/WizardShell";
import type { Listing } from "@/types/listing";

interface StepProps {
  draft: Listing;
  onChange: (patch: Partial<Listing>) => void;
}

const MAX_LENGTH = 2000;

/** Step 7 — Description: the listing's free-form public write-up. */
export function StepDescription({ draft, onChange }: StepProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <FieldLabel>Description</FieldLabel>
      <textarea
        value={draft.description}
        onChange={(e) => onChange({ description: e.target.value.slice(0, MAX_LENGTH) })}
        rows={8}
        placeholder="Describe the property — layout, condition, neighborhood, what makes it stand out..."
        className="w-full resize-none rounded-lg border border-border-subtle p-3 text-sm text-ink placeholder:text-muted focus:outline-2 focus:outline-brand-gold"
      />
      <p className="self-end text-xs text-muted">
        {draft.description.length}/{MAX_LENGTH}
      </p>
    </div>
  );
}
