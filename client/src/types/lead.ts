/**
 * Property Enquiries & Lead Management — every enquiry on a listing
 * becomes a Lead with a stage, an optional assignee, and private internal
 * notes. Business accounts (estate/hotel managers) see the full pipeline
 * (assignment + Kanban); individual owners see the same underlying object
 * through simpler "Enquiry" terminology — see `isBusinessAccount` and
 * `LEAD_TERMS` below, the one place that distinction is decided.
 */

export type LeadStage =
  | "new"
  | "contacted"
  | "qualified"
  | "viewing_requested"
  | "viewing_scheduled"
  | "viewed"
  | "negotiating"
  | "decision_pending"
  | "closed_won"
  | "closed_lost";

/** In pipeline order — also the Kanban board's column order. */
export const LEAD_STAGES: LeadStage[] = [
  "new",
  "contacted",
  "qualified",
  "viewing_requested",
  "viewing_scheduled",
  "viewed",
  "negotiating",
  "decision_pending",
  "closed_won",
  "closed_lost",
];

export const STAGE_META: Record<LeadStage, { label: string; className: string }> = {
  new: { label: "New", className: "bg-surface-muted text-ink" },
  contacted: { label: "Contacted", className: "bg-blue-100 text-blue-800" },
  qualified: { label: "Qualified", className: "bg-blue-100 text-blue-800" },
  viewing_requested: { label: "Viewing Requested", className: "bg-brand-gold/15 text-brand-navy" },
  viewing_scheduled: { label: "Viewing Scheduled", className: "bg-brand-gold/15 text-brand-navy" },
  viewed: { label: "Viewed", className: "bg-amber-100 text-amber-800" },
  negotiating: { label: "Negotiating", className: "bg-amber-100 text-amber-800" },
  decision_pending: { label: "Decision Pending", className: "bg-amber-100 text-amber-800" },
  closed_won: { label: "Closed Won", className: "bg-green-100 text-green-800" },
  closed_lost: { label: "Closed Lost", className: "bg-red-100 text-red-800" },
};

/**
 * Prospect qualification — transaction-relevant fields ONLY, per the
 * spec's own explicit privacy rule. Never add a field resembling a
 * protected characteristic here (age, gender, marital/family status,
 * nationality, religion, disability, etc.) — not even as a placeholder or
 * a "just in case" optional field. If a future request asks for one,
 * that's a signal to push back, not to extend this interface.
 */
export interface Prospect {
  name: string;
  email: string;
  phone?: string;
  /** In the listing's own currency — a number, not a range, to keep this
   * mock simple; a real implementation might want a range instead. */
  budget?: number;
  /** ISO date (yyyy-mm-dd). */
  moveInDate?: string;
  /** Only meaningful for a rental/lease enquiry — omitted for a sale. */
  leaseDurationMonths?: number;
}

/**
 * Private, staff-only. NEVER rendered anywhere a prospect could see it —
 * only LeadDetailPanel (the staff-only panel) reads `Lead.notes`; the
 * Messages thread a conversationId points to must never surface these,
 * per spec ("internal notes... NEVER shown anywhere a prospect could
 * see them").
 */
export interface LeadNote {
  id: string;
  body: string;
  authorId: string;
  authorName: string;
  createdAt: string;
}

export interface LeadViewing {
  datetime: string;
  status: "requested" | "scheduled" | "completed" | "cancelled";
}

export interface Lead {
  id: string;
  listingId: string;
  /** Denormalized for display — the pipeline board and detail panel both
   * need this constantly and there's no real listings-by-id join to do
   * against mock data. */
  listingTitle: string;
  prospect: Prospect;
  stage: LeadStage;
  assigneeId: string | null;
  assigneeName: string | null;
  /** Opaque id into the Messages system — this module never renders a
   * conversation itself (per this branch's own non-goals), only ever
   * hands this back so a caller can link/navigate to it. */
  conversationId: string;
  notes: LeadNote[];
  viewing?: LeadViewing;
  createdAt: string;
  updatedAt: string;
}

/** Stub team directory for the assignee selector — there's no real
 * staff/team model yet, just enough names to make assignment meaningful
 * in the UI. "unassigned" is a sentinel, not a real team member. */
export const TEAM_MEMBERS: { id: string; name: string }[] = [
  { id: "staff-1", name: "Ama Serwaa" },
  { id: "staff-2", name: "Kojo Mensah" },
  { id: "staff-3", name: "Efua Boateng" },
];

const BUSINESS_ROLES = ["estate_manager", "hotel_manager"];

/** The one place "business account" vs "individual owner" gets decided,
 * from this app's existing role vocabulary (see app/choose-role) — there's
 * no dedicated account-type field, so this is inferred from roles rather
 * than a real distinct concept. Everyone else (buyer, artisan, no roles)
 * is treated as an individual owner. */
export function isBusinessAccount(roles: string[] | undefined): boolean {
  return !!roles?.some((role) => BUSINESS_ROLES.includes(role));
}

/** Same underlying Lead object, different vocabulary — a business account
 * sees "Leads"/pipeline language, an individual owner sees the simpler
 * "Enquiry" terminology the spec calls for. Every user-facing string that
 * differs between the two account types should read from here, not be
 * hardcoded at the call site, so the two presentations can't drift apart
 * one string at a time. */
export function leadTerms(isBusiness: boolean) {
  return isBusiness
    ? { singular: "Lead", plural: "Leads", pageTitle: "Leads Pipeline", detailTitle: "Lead Details" }
    : { singular: "Enquiry", plural: "Enquiries", pageTitle: "My Enquiries", detailTitle: "Enquiry Details" };
}
