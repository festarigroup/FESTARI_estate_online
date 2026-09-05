"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { Dropdown, DropdownItem } from "@/components/ui/Dropdown";
import { TeamMemberBadge } from "@/components/leads/TeamMemberBadge";
import { addLeadNote, assignLead, getLead, scheduleViewing, updateLeadStage } from "@/lib/mocks/leads";
import { useAuth } from "@/context/AuthContext";
import { LEAD_STAGES, STAGE_META, TEAM_MEMBERS, leadTerms, type Lead, type LeadStage } from "@/types/lead";

const FIELD_CLASS =
  "w-full rounded-lg border border-amber-300 bg-white px-3 py-2 text-sm text-ink placeholder:text-muted focus:outline-2 focus:outline-brand-gold";

interface LeadDetailPanelProps {
  lead: Lead;
  isBusiness: boolean;
  onClose: () => void;
  onUpdated: (updated: Lead) => void;
}

/**
 * The staff-only lead/enquiry detail panel — stage, assignee, prospect
 * qualification, and internal notes. Deliberately NOT styled like the
 * shared Messages thread UI: an amber-tinted background, a heavier amber
 * border, and an explicit "Staff Only — Internal" banner up top, so
 * there's no ambiguity that anything in here (especially the notes list)
 * is private and would never render in the conversation a prospect sees.
 * Per spec: internal notes must never be shown anywhere a prospect could
 * see them — this panel, not the Messages thread, is the only place
 * `Lead.notes` is ever read.
 */
export function LeadDetailPanel({ lead, isBusiness, onClose, onUpdated }: LeadDetailPanelProps) {
  const router = useRouter();
  const { user } = useAuth();
  const terms = leadTerms(isBusiness);
  const [noteBody, setNoteBody] = useState("");
  const [viewingDatetime, setViewingDatetime] = useState(lead.viewing?.datetime.slice(0, 16) ?? "");
  const [busy, setBusy] = useState(false);

  const authorName = [user?.firstname, user?.lastname].filter(Boolean).join(" ") || "You";

  async function handleStageChange(stage: LeadStage) {
    if (stage === lead.stage) return;
    setBusy(true);
    try {
      onUpdated(await updateLeadStage(lead.id, stage));
    } finally {
      setBusy(false);
    }
  }

  async function handleAssign(assigneeId: string | null) {
    setBusy(true);
    try {
      onUpdated(await assignLead(lead.id, assigneeId));
    } finally {
      setBusy(false);
    }
  }

  async function handleAddNote() {
    if (!noteBody.trim()) return;
    setBusy(true);
    try {
      // addLeadNote's own return is just the new note (matching the
      // contract's own POST /leads/:id/notes response shape) — re-fetch
      // the authoritative lead afterward rather than hand-assembling one
      // locally, so `onUpdated` always reflects what the mock store
      // actually holds (real note id included) instead of a guessed copy.
      await addLeadNote(lead.id, noteBody.trim(), user?.id ?? "me", authorName);
      const refreshed = await getLead(lead.id);
      if (refreshed) onUpdated(refreshed);
      setNoteBody("");
      toast.success("Note added.");
    } finally {
      setBusy(false);
    }
  }

  async function handleScheduleViewing() {
    if (!viewingDatetime) return;
    setBusy(true);
    try {
      onUpdated(await scheduleViewing(lead.id, new Date(viewingDatetime).toISOString()));
      toast.success("Viewing scheduled.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal open onClose={onClose} title={terms.detailTitle} className="border-2 border-amber-400 bg-amber-50">
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-2 rounded-lg bg-amber-100 px-3 py-2 text-xs font-semibold text-amber-900">
          <DynamicIcon name="ShieldAlert" className="size-4 shrink-0" />
          Staff only — internal. Nothing on this panel is ever visible to the prospect.
        </div>

        <div className="flex flex-col gap-1">
          <p className="font-heading text-base font-semibold text-ink">{lead.prospect.name}</p>
          <p className="text-sm text-muted">{lead.listingTitle}</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1 text-xs text-ink/80">
            <span>{lead.prospect.email}</span>
            {lead.prospect.phone && <span>{lead.prospect.phone}</span>}
            {lead.prospect.budget != null && <span>Budget: {lead.prospect.budget.toLocaleString()}</span>}
            {lead.prospect.moveInDate && <span>Move-in: {lead.prospect.moveInDate}</span>}
            {lead.prospect.leaseDurationMonths != null && <span>Lease: {lead.prospect.leaseDurationMonths} months</span>}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Dropdown
            align="left"
            trigger={(bind) => (
              <button
                {...bind}
                disabled={busy}
                className="flex items-center gap-2 rounded-full border border-amber-300 bg-white px-3 py-1.5 text-xs font-semibold text-ink hover:bg-amber-100 disabled:opacity-50"
              >
                Stage: {STAGE_META[lead.stage].label}
                <DynamicIcon name="ChevronDown" className="size-3.5" />
              </button>
            )}
          >
            {LEAD_STAGES.map((stage) => (
              <DropdownItem
                key={stage}
                label={STAGE_META[stage].label}
                onClick={() => handleStageChange(stage)}
                className={stage === lead.stage ? "bg-surface-muted font-semibold" : undefined}
              />
            ))}
          </Dropdown>

          {isBusiness && (
            <Dropdown
              align="left"
              trigger={(bind) => (
                <button
                  {...bind}
                  disabled={busy}
                  className="flex items-center gap-2 rounded-full border border-amber-300 bg-white px-3 py-1.5 text-xs font-semibold text-ink hover:bg-amber-100 disabled:opacity-50"
                >
                  <TeamMemberBadge name={lead.assigneeName} size={18} />
                  {lead.assigneeName ?? "Unassigned"}
                  <DynamicIcon name="ChevronDown" className="size-3.5" />
                </button>
              )}
            >
              <DropdownItem label="Unassigned" onClick={() => handleAssign(null)} />
              {TEAM_MEMBERS.map((member) => (
                <DropdownItem
                  key={member.id}
                  label={member.name}
                  onClick={() => handleAssign(member.id)}
                  className={member.id === lead.assigneeId ? "bg-surface-muted font-semibold" : undefined}
                />
              ))}
            </Dropdown>
          )}

          <button
            onClick={() => router.push(`/messages?conversation=${lead.conversationId}`)}
            className="flex items-center gap-2 rounded-full bg-brand-navy px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-navy-light"
          >
            <DynamicIcon name="MessageCircle" className="size-3.5" />
            Open Conversation
          </button>
        </div>

        <div className="flex flex-col gap-2 border-t border-amber-200 pt-4">
          <p className="text-xs font-semibold text-ink">Viewing</p>
          {lead.viewing && (
            <p className="text-sm text-muted">
              {new Date(lead.viewing.datetime).toLocaleString()} — {lead.viewing.status}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="datetime-local"
              value={viewingDatetime}
              onChange={(e) => setViewingDatetime(e.target.value)}
              className={FIELD_CLASS}
            />
            <Button variant="navy" onClick={handleScheduleViewing} disabled={!viewingDatetime || busy} className="shrink-0 px-4">
              Schedule
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-amber-200 pt-4">
          <p className="text-xs font-semibold text-ink">Internal notes ({terms.singular.toLowerCase()}-only, staff-only)</p>
          <div className="flex max-h-48 flex-col gap-2 overflow-y-auto">
            {lead.notes.length === 0 && <p className="text-xs text-muted">No notes yet.</p>}
            {lead.notes.map((note) => (
              <div key={note.id || note.createdAt} className="rounded-lg border border-amber-200 bg-white p-2.5">
                <p className="text-sm text-ink">{note.body}</p>
                <p className="pt-1 text-[11px] text-muted">
                  {note.authorName} · {new Date(note.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-2">
            <textarea
              value={noteBody}
              onChange={(e) => setNoteBody(e.target.value)}
              rows={2}
              placeholder="Add an internal note — never visible to the prospect..."
              className={`${FIELD_CLASS} resize-none`}
            />
            <Button variant="gold" onClick={handleAddNote} disabled={!noteBody.trim() || busy} className="self-end px-4">
              Add Note
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
