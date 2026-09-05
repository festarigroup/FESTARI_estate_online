"use client";

import { useEffect, useMemo, useState } from "react";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { Dropdown, DropdownItem } from "@/components/ui/Dropdown";
import { PipelineBoard } from "@/components/leads/PipelineBoard";
import { LeadDetailPanel } from "@/components/leads/LeadDetailPanel";
import { useAuth } from "@/context/AuthContext";
import { listLeads, updateLeadStage } from "@/lib/mocks/leads";
import { TEAM_MEMBERS, isBusinessAccount, leadTerms, type Lead, type LeadStage } from "@/types/lead";

type AssigneeFilter = "all" | "unassigned" | string;

/** Property Enquiries & Lead Management — the pipeline board. Business
 * accounts (estate/hotel managers) get the full picture: an assignee
 * filter and each card's own assignee badge. Individual owners see the
 * exact same Lead objects through simpler "Enquiry" terminology and no
 * assignment UI — see leadTerms()/isBusinessAccount() for where that
 * split is decided; nothing else in this page hardcodes the distinction. */
export default function LeadsPage() {
  const { user } = useAuth();
  // Memoized (not just a plain derived const) so the `filtered` useMemo
  // below has a properly-tracked dependency — react-hooks/preserve-manual-
  // memoization flags a raw function-call result in a dependency array as
  // "may be mutated later" since it can't prove it's stable across renders
  // the way a memoized value is.
  const isBusiness = useMemo(() => isBusinessAccount(user?.roles), [user]);
  const terms = leadTerms(isBusiness);

  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [assigneeFilter, setAssigneeFilter] = useState<AssigneeFilter>("all");
  const [openLeadId, setOpenLeadId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    listLeads()
      .then((result) => {
        if (!cancelled) setLeads(result.items);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    if (!isBusiness || assigneeFilter === "all") return leads;
    if (assigneeFilter === "unassigned") return leads.filter((l) => l.assigneeId === null);
    return leads.filter((l) => l.assigneeId === assigneeFilter);
  }, [leads, isBusiness, assigneeFilter]);

  const openLead = leads.find((l) => l.id === openLeadId) ?? null;

  function handleUpdated(updated: Lead) {
    setLeads((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
  }

  async function handleStageChange(id: string, stage: LeadStage) {
    const updated = await updateLeadStage(id, stage);
    handleUpdated(updated);
  }

  const assigneeFilterLabel =
    assigneeFilter === "all" ? "All" : assigneeFilter === "unassigned" ? "Unassigned" : (TEAM_MEMBERS.find((m) => m.id === assigneeFilter)?.name ?? "All");

  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-4 px-4 py-6 sm:px-6 lg:px-0">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="font-heading text-[28px] font-semibold text-ink">{terms.pageTitle}</h1>
          <p className="text-sm text-muted">
            {isBusiness
              ? `Every enquiry becomes a ${terms.singular.toLowerCase()} here — move it through the pipeline and assign it to your team.`
              : `Every enquiry on your listings shows up here as an ${terms.singular.toLowerCase()} you can track through to close.`}
          </p>
        </div>

        {isBusiness && (
          <Dropdown
            align="right"
            trigger={(bind) => (
              <button
                {...bind}
                className="flex items-center gap-2 rounded-full border border-border-subtle bg-white px-4 py-2 text-xs font-semibold text-ink hover:bg-surface-muted"
              >
                <DynamicIcon name="Users" className="size-3.5" />
                Assignee: {assigneeFilterLabel}
                <DynamicIcon name="ChevronDown" className="size-3.5" />
              </button>
            )}
          >
            <DropdownItem label="All" onClick={() => setAssigneeFilter("all")} />
            <DropdownItem label="Unassigned" onClick={() => setAssigneeFilter("unassigned")} />
            {TEAM_MEMBERS.map((member) => (
              <DropdownItem key={member.id} label={member.name} onClick={() => setAssigneeFilter(member.id)} />
            ))}
          </Dropdown>
        )}
      </div>

      {loading ? (
        <p className="py-8 text-center text-sm text-muted">Loading {terms.plural.toLowerCase()}...</p>
      ) : filtered.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted">No {terms.plural.toLowerCase()} yet.</p>
      ) : (
        <PipelineBoard leads={filtered} showAssignee={isBusiness} onOpenLead={setOpenLeadId} onStageChange={handleStageChange} />
      )}

      {openLead && (
        <LeadDetailPanel lead={openLead} isBusiness={isBusiness} onClose={() => setOpenLeadId(null)} onUpdated={handleUpdated} />
      )}
    </div>
  );
}
