import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { PropertyDetailsView } from "@/components/properties/PropertyDetailsView";
import { validateListing, type Listing } from "@/types/listing";

interface StepProps {
  draft: Listing;
  duplicate?: Listing | null;
}

/** Step 11 — Preview & Submit. Renders the exact public Property Details
 * output via PropertyDetailsView (see that component's own doc comment for
 * why it's the one place this rendering logic lives), plus a completion
 * checklist that separates blocking errors from warnings per spec. The
 * actual "Submit for Review" action lives in the wizard page/shell, not
 * here — this step is read-only. */
export function StepPreview({ draft, duplicate }: StepProps) {
  const { errors, warnings } = validateListing(draft);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 rounded-lg border border-border-subtle p-4">
        <h2 className="font-heading text-base text-ink">Completion checklist</h2>

        {duplicate && (
          <ChecklistRow tone="warning" text={`Possible duplicate of "${duplicate.title || "Untitled listing"}".`} />
        )}
        {errors.map((message) => (
          <ChecklistRow key={message} tone="error" text={message} />
        ))}
        {warnings.map((message) => (
          <ChecklistRow key={message} tone="warning" text={message} />
        ))}
        {errors.length === 0 && warnings.length === 0 && !duplicate && (
          <ChecklistRow tone="ok" text="Everything looks good — this listing is ready to submit for review." />
        )}

        {errors.length > 0 && (
          <p className="text-xs font-semibold text-red-700">
            Fix the errors above before submitting — warnings won&apos;t block submission.
          </p>
        )}
      </div>

      <PropertyDetailsView listing={draft} previewMode />
    </div>
  );
}

function ChecklistRow({ tone, text }: { tone: "error" | "warning" | "ok"; text: string }) {
  const icon = tone === "error" ? "CircleAlert" : tone === "warning" ? "TriangleAlert" : "CircleCheck";
  const className = tone === "error" ? "text-red-700" : tone === "warning" ? "text-amber-700" : "text-green-700";
  return (
    <p className={`flex items-start gap-2 text-sm ${className}`}>
      <DynamicIcon name={icon} className="size-4 shrink-0 translate-y-0.5" />
      <span>{text}</span>
    </p>
  );
}
