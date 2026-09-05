import { TEAM_MEMBERS, type Lead, type LeadNote, type LeadStage, type Prospect } from "@/types/lead";

/**
 * Mock stand-in for the real lead-management endpoints (server side,
 * Phase 1 — not built in this branch):
 *   POST  /api/listings/:id/enquiries -> createEnquiry
 *   GET   /api/leads?assignee=me      -> listLeads
 *   PATCH /api/leads/:id/stage        -> updateLeadStage
 *   POST  /api/leads/:id/notes        -> addLeadNote
 *   POST  /api/leads/:id/viewing      -> scheduleViewing
 *
 * `assignLead` has no matching literal endpoint in the assumed contract,
 * but assignment is a named spec requirement ("Business accounts get
 * assignment...") with nothing else to call — treated as a natural
 * extension of the same PATCH-a-lead shape rather than left unimplemented.
 *
 * Every function here is the ONE swap point for its matching endpoint —
 * nothing outside this file should import MOCK_LEADS directly. The array
 * is mutated in place so a stage/assignee change is visible immediately
 * everywhere, matching this app's other mock modules (marketplace,
 * listings) and the spec's own "persists in mock state for the session".
 */

const LATENCY_MS = 200;

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), LATENCY_MS));
}

function nowIso(): string {
  return new Date().toISOString();
}

function hoursAgo(hours: number): string {
  return new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
}

function seedLead(overrides: Partial<Lead> & Pick<Lead, "id" | "listingId" | "listingTitle" | "stage" | "prospect">): Lead {
  return {
    assigneeId: null,
    assigneeName: null,
    conversationId: `conv-${overrides.id}`,
    notes: [],
    createdAt: hoursAgo(48),
    updatedAt: hoursAgo(48),
    ...overrides,
  };
}

const MOCK_LEADS: Lead[] = [
  seedLead({
    id: "lead-1",
    listingId: "listing-published-1",
    listingTitle: "4 Bedroom Detached House, East Legon",
    stage: "new",
    prospect: { name: "Yaw Owusu", email: "yaw.owusu@example.com", phone: "+233 24 111 2222", budget: 900000 },
    createdAt: hoursAgo(2),
    updatedAt: hoursAgo(2),
  }),
  seedLead({
    id: "lead-2",
    listingId: "listing-published-2",
    listingTitle: "Studio Apartment, Osu",
    stage: "contacted",
    prospect: {
      name: "Abena Frimpong",
      email: "abena.f@example.com",
      budget: 3000,
      moveInDate: "2026-10-01",
      leaseDurationMonths: 12,
    },
    assigneeId: "staff-1",
    assigneeName: "Ama Serwaa",
    notes: [
      {
        id: "note-1",
        body: "Called, left voicemail. Will try again tomorrow morning.",
        authorId: "staff-1",
        authorName: "Ama Serwaa",
        createdAt: hoursAgo(20),
      },
    ],
    createdAt: hoursAgo(30),
    updatedAt: hoursAgo(20),
  }),
  seedLead({
    id: "lead-3",
    listingId: "listing-under-offer-1",
    listingTitle: "3 Bedroom Semi-Detached, Airport Residential",
    stage: "viewing_scheduled",
    prospect: { name: "Kwabena Asante", email: "kwabena.a@example.com", budget: 780000, moveInDate: "2026-11-15" },
    assigneeId: "staff-2",
    assigneeName: "Kojo Mensah",
    viewing: { datetime: "2026-09-12T10:00:00.000Z", status: "scheduled" },
    notes: [
      {
        id: "note-2",
        body: "Pre-qualified with a mortgage in principle — serious buyer.",
        authorId: "staff-2",
        authorName: "Kojo Mensah",
        createdAt: hoursAgo(10),
      },
    ],
    createdAt: hoursAgo(60),
    updatedAt: hoursAgo(10),
  }),
  seedLead({
    id: "lead-4",
    listingId: "listing-sold-1",
    listingTitle: "5 Bedroom House, Trasacco Valley",
    stage: "closed_won",
    prospect: { name: "Efua Danso", email: "efua.d@example.com", budget: 1650000 },
    assigneeId: "staff-2",
    assigneeName: "Kojo Mensah",
    createdAt: hoursAgo(400),
    updatedAt: hoursAgo(200),
  }),
  seedLead({
    id: "lead-5",
    listingId: "listing-rented-1",
    listingTitle: "2 Bedroom Apartment, Cantonments",
    stage: "decision_pending",
    prospect: { name: "Nana Kwame", email: "nana.k@example.com", budget: 5000, leaseDurationMonths: 24 },
    notes: [],
    createdAt: hoursAgo(15),
    updatedAt: hoursAgo(3),
  }),
];

let nextId = MOCK_LEADS.length + 1;
let nextNoteId = MOCK_LEADS.reduce((n, l) => n + l.notes.length, 0) + 1;

export interface CreateEnquiryResult {
  leadId: string;
  conversationId: string;
}

/** POST /api/listings/:id/enquiries — every enquiry becomes a new Lead in
 * "new" stage, unassigned, per spec. */
export function createEnquiry(listingId: string, listingTitle: string, prospect: Prospect): Promise<CreateEnquiryResult> {
  const lead: Lead = {
    id: `lead-${nextId++}`,
    listingId,
    listingTitle,
    prospect,
    stage: "new",
    assigneeId: null,
    assigneeName: null,
    conversationId: `conv-${Date.now()}`,
    notes: [],
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };
  MOCK_LEADS.unshift(lead);
  return delay({ leadId: lead.id, conversationId: lead.conversationId });
}

export interface ListLeadsParams {
  /** "me" resolves to `currentUserId`; a specific team member id narrows
   * to just theirs; omitted (or "all") returns every lead — matching the
   * contract's own `assignee=me` example while still letting the
   * pipeline board show everyone's leads for a business account. */
  assignee?: string;
  currentUserId?: string;
}

export function listLeads(params: ListLeadsParams = {}): Promise<{ items: Lead[] }> {
  const { assignee, currentUserId } = params;
  let items = [...MOCK_LEADS];
  if (assignee && assignee !== "all") {
    const targetId = assignee === "me" ? currentUserId : assignee;
    items = assignee === "unassigned" ? items.filter((l) => l.assigneeId === null) : items.filter((l) => l.assigneeId === targetId);
  }
  return delay({ items });
}

export function getLead(id: string): Promise<Lead | null> {
  return delay(MOCK_LEADS.find((lead) => lead.id === id) ?? null);
}

function updateLead(id: string, patch: Partial<Lead>): Promise<Lead> {
  const index = MOCK_LEADS.findIndex((lead) => lead.id === id);
  if (index === -1) return Promise.reject(new Error(`Lead "${id}" not found`));
  const updated: Lead = { ...MOCK_LEADS[index], ...patch, id, updatedAt: nowIso() };
  MOCK_LEADS[index] = updated;
  return delay(updated);
}

export function updateLeadStage(id: string, stage: LeadStage): Promise<Lead> {
  return updateLead(id, { stage });
}

export function assignLead(id: string, assigneeId: string | null): Promise<Lead> {
  const assigneeName = assigneeId ? (TEAM_MEMBERS.find((m) => m.id === assigneeId)?.name ?? null) : null;
  return updateLead(id, { assigneeId, assigneeName });
}

export async function addLeadNote(id: string, body: string, authorId: string, authorName: string): Promise<LeadNote> {
  const lead = await getLead(id);
  if (!lead) throw new Error(`Lead "${id}" not found`);
  const note: LeadNote = { id: `note-${nextNoteId++}`, body, authorId, authorName, createdAt: nowIso() };
  await updateLead(id, { notes: [...lead.notes, note] });
  return note;
}

/** POST /api/leads/:id/viewing — also bumps the stage forward to
 * "viewing_scheduled" when scheduling one from an earlier stage (matches
 * the pipeline's own stage order); never moves a lead backward if it's
 * already past that point (e.g. already "viewed" or further along). */
export async function scheduleViewing(id: string, datetime: string): Promise<Lead> {
  const lead = await getLead(id);
  if (!lead) throw new Error(`Lead "${id}" not found`);
  const viewing: Lead["viewing"] = { datetime, status: "scheduled" };
  const stageOrder = ["new", "contacted", "qualified", "viewing_requested", "viewing_scheduled"];
  const shouldAdvance = stageOrder.includes(lead.stage);
  return updateLead(id, { viewing, ...(shouldAdvance ? { stage: "viewing_scheduled" as const } : {}) });
}
