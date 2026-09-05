import type { IconName } from "@/components/ui/DynamicIcon";

/**
 * Verification Centre — five INDEPENDENT domains, each with its own
 * status. Per spec, these must never be conflated: being Identity Verified
 * says nothing about whether a listing's Property Relationship is
 * verified, and neither says anything about a paid plan (hard rule: never
 * show or imply verification status is affected by a subscription —
 * nothing in this module, or anything that reads from it, may reference
 * billing/plan/subscription at all).
 */
export type VerificationDomain =
  | "identity"
  | "property_relationship"
  | "professional_credential"
  | "artisan_trade_credential"
  | "business";

export const VERIFICATION_DOMAINS: VerificationDomain[] = [
  "identity",
  "property_relationship",
  "professional_credential",
  "artisan_trade_credential",
  "business",
];

export const DOMAIN_META: Record<VerificationDomain, { label: string; description: string; icon: IconName }> = {
  identity: {
    label: "Identity",
    description: "Confirms who you are — a government-issued ID check.",
    icon: "BadgeCheck",
  },
  property_relationship: {
    label: "Property Identity",
    description: "Confirms your relationship to a property you've listed (owner, agent, or authorized manager).",
    icon: "Home",
  },
  professional_credential: {
    label: "Professional Credential",
    description: "Confirms a professional license or membership (e.g. estate agent, surveyor).",
    icon: "Award",
  },
  artisan_trade_credential: {
    label: "Artisan Trade Credential",
    description: "Confirms a trade qualification or certification (e.g. electrician, plumber).",
    icon: "HardHat",
  },
  business: {
    label: "Business",
    description: "Confirms your business registration.",
    icon: "Building2",
  },
};

/**
 * The full per-domain lifecycle shown on the Verification Centre's own
 * cards — richer than what an external badge ever needs to show (a
 * profile header or a listing card has no reason to distinguish "Under
 * Review" from "More Information Required"; both just mean "not verified
 * yet" from the outside). See `toBadgeStatus` for how this collapses down
 * to `BadgeStatus`.
 */
export type DomainStatus =
  | "not_started"
  | "submitted"
  | "under_review"
  | "more_info_required"
  | "verified"
  | "verified_with_expiry"
  | "expiring_soon"
  | "expired"
  | "rejected"
  | "revoked";

/** The narrower set VerificationBadge itself renders — every value the
 * spec names for that component, verbatim. */
export type BadgeStatus =
  | "not_verified"
  | "verified"
  | "verified_with_expiry"
  | "expiring_soon"
  | "expired"
  | "rejected"
  | "revoked";

/** Collapses the full lifecycle down to what an external badge shows —
 * not_started/submitted/under_review/more_info_required all read as
 * "not verified" from outside the Verification Centre itself; there's
 * nothing a prospect or another user needs to know beyond that. */
export function toBadgeStatus(status: DomainStatus): BadgeStatus {
  switch (status) {
    case "verified":
    case "verified_with_expiry":
    case "expiring_soon":
    case "expired":
    case "rejected":
    case "revoked":
      return status;
    default:
      return "not_verified";
  }
}

export const DOMAIN_STATUS_META: Record<DomainStatus, { label: string; className: string; icon: IconName }> = {
  not_started: { label: "Not Started", className: "bg-surface-muted text-ink", icon: "ShieldOff" },
  submitted: { label: "Submitted", className: "bg-blue-100 text-blue-800", icon: "Clock" },
  under_review: { label: "Under Review", className: "bg-blue-100 text-blue-800", icon: "Clock" },
  more_info_required: { label: "More Information Required", className: "bg-amber-100 text-amber-800", icon: "FileWarning" },
  verified: { label: "Verified", className: "bg-green-100 text-green-800", icon: "ShieldCheck" },
  verified_with_expiry: { label: "Verified", className: "bg-green-100 text-green-800", icon: "ShieldCheck" },
  expiring_soon: { label: "Expiring Soon", className: "bg-amber-100 text-amber-800", icon: "ShieldAlert" },
  expired: { label: "Expired", className: "bg-red-100 text-red-800", icon: "ShieldX" },
  rejected: { label: "Rejected", className: "bg-red-100 text-red-800", icon: "ShieldX" },
  revoked: { label: "Revoked", className: "bg-red-100 text-red-800", icon: "ShieldOff" },
};

export const BADGE_STATUS_META: Record<BadgeStatus, { label: string; className: string; icon: IconName }> = {
  not_verified: { label: "Not Verified", className: "bg-surface-muted text-muted", icon: "ShieldOff" },
  verified: { label: "Verified", className: "bg-green-100 text-green-800", icon: "ShieldCheck" },
  verified_with_expiry: { label: "Verified", className: "bg-green-100 text-green-800", icon: "ShieldCheck" },
  expiring_soon: { label: "Expiring Soon", className: "bg-amber-100 text-amber-800", icon: "ShieldAlert" },
  expired: { label: "Expired", className: "bg-red-100 text-red-800", icon: "ShieldX" },
  rejected: { label: "Rejected", className: "bg-red-100 text-red-800", icon: "ShieldX" },
  revoked: { label: "Revoked", className: "bg-red-100 text-red-800", icon: "ShieldOff" },
};

export interface DomainVerification {
  domain: VerificationDomain;
  status: DomainStatus;
  /** Only meaningful for verified_with_expiry/expiring_soon/expired. */
  expiresAt?: string;
  submittedAt?: string;
  /** Reviewer-facing reason shown back to the user for
   * more_info_required/rejected — never anything about billing/plans. */
  reviewNote?: string;
}

export function daysUntil(iso: string): number {
  return Math.ceil((new Date(iso).getTime() - Date.now()) / (24 * 60 * 60 * 1000));
}
