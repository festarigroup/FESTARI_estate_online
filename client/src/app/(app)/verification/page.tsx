"use client";

import { useEffect, useState } from "react";
import { VerificationDomainCard } from "@/components/verification/VerificationDomainCard";
import { getVerificationStatus } from "@/lib/mocks/verification";
import { VERIFICATION_DOMAINS, type DomainVerification, type VerificationDomain } from "@/types/verification";

/**
 * Verification Centre — a single hub covering five INDEPENDENT domains
 * (Identity, Property Identity, Professional Credential, Artisan Trade
 * Credential, Business), each with its own status and its own submit/
 * resubmit/appeal action. Nothing on this page mentions a subscription or
 * paid plan, anywhere — per the spec's hard rule, verification must read
 * as entirely unrelated to billing.
 */
export default function VerificationCentrePage() {
  const [status, setStatus] = useState<Record<VerificationDomain, DomainVerification> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getVerificationStatus()
      .then((result) => {
        if (!cancelled) setStatus(result);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  function handleChanged(updated: DomainVerification) {
    setStatus((prev) => (prev ? { ...prev, [updated.domain]: updated } : prev));
  }

  return (
    <div className="mx-auto flex max-w-[900px] flex-col gap-4 px-4 py-6 sm:px-6 lg:px-0">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-[28px] font-semibold text-ink">Verification Centre</h1>
        <p className="text-sm text-muted">
          Each of these is verified independently — being verified for one doesn&apos;t carry over to another.
        </p>
      </div>

      {loading || !status ? (
        <p className="py-8 text-center text-sm text-muted">Loading verification status...</p>
      ) : (
        <div className="flex flex-col gap-3">
          {VERIFICATION_DOMAINS.map((domain) => (
            <VerificationDomainCard key={domain} verification={status[domain]} onChanged={handleChanged} />
          ))}
        </div>
      )}
    </div>
  );
}
