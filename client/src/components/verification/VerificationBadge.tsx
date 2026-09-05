import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { cn } from "@/lib/cn";
import { BADGE_STATUS_META, DOMAIN_META, daysUntil, type BadgeStatus, type VerificationDomain } from "@/types/verification";

interface VerificationBadgeProps {
  domain: VerificationDomain;
  status: BadgeStatus;
  /** Only rendered for verified_with_expiry/expiring_soon, as a small
   * "Expires in N days" suffix — optional since not every caller has
   * (or needs) this on hand. */
  expiresAt?: string;
  className?: string;
}

/**
 * The one badge every domain's verification status renders through,
 * anywhere in the app a scope-specific fact needs to be shown — a profile
 * header, a listing card, wherever. Always shows the domain label
 * alongside the status ("Identity · Verified", "Property Identity ·
 * Expiring Soon") — never a bare "Verified" checkmark, per spec: two
 * different domains being verified are two different facts, and
 * collapsing them to the same unlabeled checkmark would blur that.
 *
 * Never reads or shows anything plan/subscription-related — there's
 * nothing in `BadgeStatus`/`VerificationDomain` that could even express
 * that, by design (see types/verification.ts's own doc comment on the
 * hard rule this enforces).
 */
export function VerificationBadge({ domain, status, expiresAt, className }: VerificationBadgeProps) {
  const domainMeta = DOMAIN_META[domain];
  const statusMeta = BADGE_STATUS_META[status];
  const showExpiry = expiresAt && (status === "verified_with_expiry" || status === "expiring_soon");

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap",
        statusMeta.className,
        className,
      )}
    >
      <DynamicIcon name={statusMeta.icon} className="size-3.5 shrink-0" />
      {domainMeta.label} · {statusMeta.label}
      {showExpiry && <span className="opacity-80">(expires in {daysUntil(expiresAt)}d)</span>}
    </span>
  );
}
