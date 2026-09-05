import { VERIFICATION_DOMAINS, type DomainStatus, type DomainVerification, type VerificationDomain } from "@/types/verification";

/**
 * Mock stand-in for the real verification endpoints (server side, Phase 1
 * — not built in this branch):
 *   POST /api/verification/:domain/submit -> submitVerification
 *   GET  /api/verification/status         -> getVerificationStatus
 *   POST /api/verification/:id/appeal     -> appealVerification
 *
 * Every function here is the ONE swap point for its matching endpoint —
 * nothing outside this file should import MOCK_STATUS directly. The five
 * domains are independent records in one object, mutated in place, so a
 * submission is reflected immediately everywhere this data is read from.
 */

const LATENCY_MS = 200;

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), LATENCY_MS));
}

function nowIso(): string {
  return new Date().toISOString();
}

function daysFromNow(days: number): string {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
}

const MOCK_STATUS: Record<VerificationDomain, DomainVerification> = {
  identity: {
    domain: "identity",
    status: "verified",
    submittedAt: daysFromNow(-90),
  },
  property_relationship: {
    domain: "property_relationship",
    status: "expiring_soon",
    submittedAt: daysFromNow(-300),
    expiresAt: daysFromNow(12),
  },
  professional_credential: {
    domain: "professional_credential",
    status: "rejected",
    submittedAt: daysFromNow(-5),
    reviewNote: "The uploaded certificate photo was too blurry to verify the license number. Please resubmit a clearer copy.",
  },
  artisan_trade_credential: {
    domain: "artisan_trade_credential",
    status: "not_started",
  },
  business: {
    domain: "business",
    status: "under_review",
    submittedAt: daysFromNow(-2),
  },
};

/** Any status with a currently-set expiry that's now passed is treated as
 * "expired" and one within the warning window as "expiring_soon" — the
 * spec models these as sequential states a verified record moves through
 * on its own, not something a submit/appeal action ever sets directly. */
const EXPIRING_SOON_WINDOW_DAYS = 30;

function withDerivedExpiry(record: DomainVerification): DomainVerification {
  if (!record.expiresAt) return record;
  if (record.status !== "verified_with_expiry" && record.status !== "expiring_soon" && record.status !== "expired") {
    return record;
  }
  const daysLeft = (new Date(record.expiresAt).getTime() - Date.now()) / (24 * 60 * 60 * 1000);
  const status: DomainStatus = daysLeft < 0 ? "expired" : daysLeft <= EXPIRING_SOON_WINDOW_DAYS ? "expiring_soon" : "verified_with_expiry";
  return { ...record, status };
}

export function getVerificationStatus(): Promise<Record<VerificationDomain, DomainVerification>> {
  const derived = Object.fromEntries(
    VERIFICATION_DOMAINS.map((domain) => [domain, withDerivedExpiry(MOCK_STATUS[domain])]),
  ) as Record<VerificationDomain, DomainVerification>;
  return delay(derived);
}

export function getDomainVerification(domain: VerificationDomain): Promise<DomainVerification> {
  return delay(withDerivedExpiry(MOCK_STATUS[domain]));
}

export interface SubmitVerificationResult {
  domain: VerificationDomain;
  status: "submitted";
}

/** POST /api/verification/:domain/submit — moves that domain straight to
 * "submitted", clearing any prior rejection note/expiry (a fresh
 * submission supersedes the old record entirely). No file actually
 * uploads anywhere — there's no storage/upload logic in this branch, per
 * its own non-goals; the file input on the Centre page just proves the
 * submit action out. */
export function submitVerification(domain: VerificationDomain): Promise<SubmitVerificationResult> {
  MOCK_STATUS[domain] = {
    domain,
    status: "submitted",
    submittedAt: nowIso(),
  };
  return delay({ domain, status: "submitted" });
}

export interface AppealVerificationResult {
  status: "under_review";
}

/** POST /api/verification/:id/appeal — for a rejected/revoked domain,
 * disputes the decision without a brand-new submission (distinct from
 * submitVerification: no new document, just "please look at this again").
 * Keyed by domain here rather than a separate numeric id — this mock has
 * exactly one record per domain, so the domain itself is a stable id. */
export function appealVerification(domain: VerificationDomain): Promise<AppealVerificationResult> {
  MOCK_STATUS[domain] = { ...MOCK_STATUS[domain], status: "under_review" };
  return delay({ status: "under_review" });
}
