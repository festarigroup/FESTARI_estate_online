import { DynamicIcon } from "@/components/ui/DynamicIcon";

/** Step 10 — Authority & Verification. Stubbed per spec: no real document
 * upload or verification logic, just the "pending" state a real
 * Verification Centre (out of scope for this branch) would eventually
 * replace. Every draft's `authority.status` starts and stays "pending" —
 * there's nothing here to change yet. */
export function StepAuthority() {
  return (
    <div className="flex flex-col items-center gap-3 py-8 text-center">
      <span className="flex size-14 items-center justify-center rounded-full bg-surface-muted">
        <DynamicIcon name="ShieldAlert" className="size-6 text-brand-navy" />
      </span>
      <h2 className="font-heading text-base text-ink">Verification pending</h2>
      <p className="max-w-sm text-sm text-muted">
        Ownership/authority verification isn&apos;t available yet — this listing will be marked as pending verification
        until that feature is built. You can still continue and submit for review.
      </p>
      <button
        disabled
        className="flex items-center gap-2 rounded-full border border-border-subtle bg-white px-5 py-2.5 text-sm font-semibold text-muted opacity-60"
      >
        <DynamicIcon name="FileText" className="size-4" />
        Upload ownership document (coming soon)
      </button>
    </div>
  );
}
