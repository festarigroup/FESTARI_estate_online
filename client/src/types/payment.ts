import type { IconName } from "@/components/ui/DynamicIcon";

/**
 * Payments, Billing & Transactions — a private financial activity centre,
 * NOT a wallet: there's no balance to hold or top up here, every row is
 * just the record of one payment tied to something else the app already
 * has (a Stay booking, a Service engagement, a Verification fee, ...).
 *
 * Status is display-only everywhere in this module. Per spec, the real
 * status can only ever come from a backend webhook — nothing in this UI
 * (including the mock) exposes a "change status" control the way the
 * Leads pipeline exposes a stage selector. `lib/mocks/payments.ts`'s own
 * timed auto-advance (initiated -> pending -> successful/failed) stands
 * in for that webhook; it is never triggered by a click on an existing
 * transaction, only by creating a new one via PayNowButton.
 */

export type TransactionStatus =
  | "initiated"
  | "pending_authorising"
  | "successful"
  | "partially_paid"
  | "refund_pending"
  | "refunded"
  | "failed"
  | "disputed";

export const STATUS_META: Record<TransactionStatus, { label: string; className: string; icon: IconName }> = {
  initiated: { label: "Initiated", className: "bg-surface-muted text-ink", icon: "Clock" },
  pending_authorising: { label: "Pending / Authorising", className: "bg-brand-gold/15 text-brand-navy", icon: "Clock" },
  successful: { label: "Successful / Paid", className: "bg-green-100 text-green-800", icon: "CircleCheck" },
  partially_paid: { label: "Partially Paid / Balance Due", className: "bg-amber-100 text-amber-800", icon: "CircleAlert" },
  refund_pending: { label: "Refund Pending", className: "bg-blue-100 text-blue-800", icon: "RefreshCcw" },
  refunded: { label: "Refunded", className: "bg-blue-100 text-blue-800", icon: "RefreshCcw" },
  failed: { label: "Failed", className: "bg-red-100 text-red-800", icon: "XCircle" },
  disputed: { label: "Disputed", className: "bg-red-100 text-red-800", icon: "TriangleAlert" },
};

/** Only these two statuses may ever produce a receipt, per spec — a
 * partial payment still gets one (it's a receipt for what WAS paid), an
 * initiated/pending/refunded/failed/disputed transaction never does. This
 * is the one place that rule lives; both the UI gate (hide/disable the
 * button) and the mock's own `getReceipt()` re-check against it. */
export function isReceiptEligible(status: TransactionStatus): boolean {
  return status === "successful" || status === "partially_paid";
}

export type LinkedEntityType = "stay_booking" | "service_engagement" | "verification_fee" | "listing_promotion" | "other";

export const ENTITY_TYPE_LABEL: Record<LinkedEntityType, string> = {
  stay_booking: "Stay Booking",
  service_engagement: "Service Engagement",
  verification_fee: "Verification Fee",
  listing_promotion: "Listing Promotion",
  other: "Other",
};

export interface LinkedEntity {
  type: LinkedEntityType;
  /** Display label — e.g. "Labadi Beach Hotel, 2 nights". */
  label: string;
  /** Only set when a real page for this entity actually exists to link to
   * — none of Stay booking/Service engagement have one yet (out of scope
   * for this branch, per its own non-goals), so most seeded transactions
   * leave this unset and the drawer just shows plain text instead of a
   * dead link. */
  href?: string;
}

export interface TransactionTimelineEntry {
  status: TransactionStatus;
  at: string;
}

/** The one place a transaction's amount gets turned into display text —
 * matches the "GHS X,XXX" convention used everywhere else in this app. */
export function formatMoney(amount: number, currency: string): string {
  return `${currency} ${amount.toLocaleString()}`;
}

export interface Transaction {
  id: string;
  /** Human-readable reference shown to the user — distinct from `id`,
   * which is just this mock's own key. */
  reference: string;
  amount: number;
  currency: string;
  payee: string;
  purpose: string;
  linkedEntity: LinkedEntity;
  /** Never the real PAN/account number — always pre-masked, e.g. "Visa
   * •••• 4242" or "MTN MoMo •••• 4455". This mock never handles real
   * payment details, per this branch's own non-goals. */
  maskedMethod: string;
  status: TransactionStatus;
  timeline: TransactionTimelineEntry[];
  createdAt: string;
  updatedAt: string;
}
