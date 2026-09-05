"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { SubmitVerificationModal } from "@/components/verification/SubmitVerificationModal";
import { cn } from "@/lib/cn";
import { appealVerification } from "@/lib/mocks/verification";
import { DOMAIN_META, DOMAIN_STATUS_META, daysUntil, type DomainVerification } from "@/types/verification";

interface VerificationDomainCardProps {
  verification: DomainVerification;
  onChanged: (updated: DomainVerification) => void;
}

/** One domain's own card on the Verification Centre — its current status,
 * an expiry countdown where relevant, and whichever action makes sense
 * for that status (Submit/Resubmit, or Appeal for a rejected/revoked
 * record). Every domain here is independent — this card never reads or
 * shows anything about any other domain, or about a subscription/plan. */
export function VerificationDomainCard({ verification, onChanged }: VerificationDomainCardProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [appealing, setAppealing] = useState(false);
  const meta = DOMAIN_META[verification.domain];
  const statusMeta = DOMAIN_STATUS_META[verification.status];

  const canSubmit = verification.status === "not_started" || verification.status === "more_info_required" || verification.status === "rejected" || verification.status === "expired" || verification.status === "revoked";
  const canAppeal = verification.status === "rejected" || verification.status === "revoked";
  const submitLabel = verification.status === "not_started" ? "Submit" : "Resubmit";

  async function handleAppeal() {
    setAppealing(true);
    try {
      await appealVerification(verification.domain);
      onChanged({ ...verification, status: "under_review" });
      toast.success("Appeal submitted — this will move to Under Review.");
    } catch {
      toast.error("Couldn't submit your appeal.");
    } finally {
      setAppealing(false);
    }
  }

  return (
    <div className="flex flex-col gap-3 rounded-[19px] border border-border-subtle bg-white p-5 lg:rounded-[24px]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface-muted">
            <DynamicIcon name={meta.icon} className="size-5 text-brand-navy" />
          </span>
          <div>
            <p className="font-heading text-sm font-semibold text-ink">{meta.label}</p>
            <p className="text-xs text-muted">{meta.description}</p>
          </div>
        </div>
        <span className={cn("flex shrink-0 items-center gap-1 rounded px-2 py-1 text-[10px] font-semibold tracking-[0.5px] uppercase", statusMeta.className)}>
          <DynamicIcon name={statusMeta.icon} className="size-3" />
          {statusMeta.label}
        </span>
      </div>

      {verification.expiresAt && (verification.status === "verified_with_expiry" || verification.status === "expiring_soon") && (
        <p className="text-xs text-muted">Expires in {daysUntil(verification.expiresAt)} days.</p>
      )}
      {verification.expiresAt && verification.status === "expired" && (
        <p className="text-xs text-red-700">Expired {Math.abs(daysUntil(verification.expiresAt))} days ago.</p>
      )}
      {verification.reviewNote && (verification.status === "more_info_required" || verification.status === "rejected") && (
        <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-900">{verification.reviewNote}</p>
      )}

      {(canSubmit || canAppeal) && (
        <div className="flex gap-2 pt-1">
          {canSubmit && (
            <button
              onClick={() => setModalOpen(true)}
              className="rounded-full bg-brand-navy px-4 py-2 text-xs font-semibold text-white hover:bg-brand-navy-light"
            >
              {submitLabel}
            </button>
          )}
          {canAppeal && (
            <button
              onClick={handleAppeal}
              disabled={appealing}
              className="rounded-full border border-border-subtle px-4 py-2 text-xs font-semibold text-ink hover:bg-surface-muted disabled:opacity-50"
            >
              {appealing ? "Submitting..." : "Appeal"}
            </button>
          )}
        </div>
      )}

      <SubmitVerificationModal
        domain={verification.domain}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmitted={() => onChanged({ domain: verification.domain, status: "submitted", submittedAt: new Date().toISOString() })}
      />
    </div>
  );
}
