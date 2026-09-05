"use client";

import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { cn } from "@/lib/cn";

export const WIZARD_STEPS = [
  "Listing Purpose",
  "Property Identity",
  "Location",
  "Property Details",
  "Pricing & Terms",
  "Features & Amenities",
  "Description",
  "Media",
  "Viewing & Contact",
  "Authority & Verification",
  "Preview & Submit",
] as const;

export const WIZARD_STEP_COUNT = WIZARD_STEPS.length;

interface WizardShellProps {
  step: number;
  children: React.ReactNode;
  onBack: () => void;
  onNext: () => void;
  /** The final step renders its own submit action instead of "Next" —
   * passed in rather than hardcoded so the shell stays step-agnostic. */
  nextLabel?: string;
  nextDisabled?: boolean;
  busy?: boolean;
}

/** The 11-step wizard's shared chrome — step indicator up top, the actual
 * step content in the middle, Back/Next footer pinned at the bottom. Every
 * step component is just the content between those two; none of them own
 * navigation. */
export function WizardShell({ step, children, onBack, onNext, nextLabel = "Next", nextDisabled, busy }: WizardShellProps) {
  return (
    <div className="mx-auto flex max-w-[900px] flex-col gap-6 px-4 py-6 sm:px-6 lg:px-0">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-[28px] font-semibold text-ink">Create Property Listing</h1>
        <p className="text-sm text-muted">
          Step {step} of {WIZARD_STEP_COUNT} — {WIZARD_STEPS[step - 1]}
        </p>
      </div>

      {/* Step indicator — a horizontally-scrolling rail of dots rather than
          11 full labels (no reasonable width fits all 11 legibly), matching
          CategoryChips' own scroll-rail convention for a long, fixed-height
          row of many items. */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {WIZARD_STEPS.map((label, i) => {
          const stepNumber = i + 1;
          const done = stepNumber < step;
          const active = stepNumber === step;
          return (
            <div
              key={label}
              title={label}
              className={cn(
                "flex h-1.5 min-w-[28px] flex-1 shrink-0 rounded-full",
                done ? "bg-brand-navy" : active ? "bg-brand-gold-dark" : "bg-border-subtle",
              )}
            />
          );
        })}
      </div>

      <div className="rounded-[19px] border border-border-subtle bg-white p-5 lg:rounded-[24px] lg:p-6">{children}</div>

      <div className="flex items-center justify-between gap-3 pb-6">
        <button
          onClick={onBack}
          disabled={step === 1 || busy}
          className="flex items-center gap-2 rounded-full border border-border-subtle bg-white px-5 py-2.5 text-sm font-semibold text-ink hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-50"
        >
          <DynamicIcon name="ChevronLeft" className="size-4" />
          Back
        </button>
        <button
          onClick={onNext}
          disabled={nextDisabled || busy}
          className="flex items-center gap-2 rounded-full bg-brand-navy px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-navy-light disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy ? "Saving..." : nextLabel}
          {step < WIZARD_STEP_COUNT && !busy && <DynamicIcon name="ChevronRight" className="size-4" />}
        </button>
      </div>
    </div>
  );
}

export function FieldLabel({ children }: { children: React.ReactNode }) {
  return <span className="text-xs font-semibold text-ink">{children}</span>;
}

export const FIELD_CLASS =
  "w-full rounded-lg border border-border-subtle px-3 py-2 text-sm text-ink placeholder:text-muted focus:outline-2 focus:outline-brand-gold";
