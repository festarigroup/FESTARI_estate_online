"use client";

import { Dropdown, DropdownItem } from "@/components/ui/Dropdown";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { TeamMemberBadge } from "@/components/leads/TeamMemberBadge";
import { LEAD_STAGES, STAGE_META, type Lead } from "@/types/lead";

interface LeadCardProps {
  lead: Lead;
  showAssignee: boolean;
  onOpen: () => void;
  onStageChange: (stage: Lead["stage"]) => void;
}

/** One card on the pipeline board — the stage-change control here is a
 * dropdown/select rather than drag-and-drop (the spec explicitly allows
 * either; this app has no drag-and-drop library, and a select is fully
 * keyboard-accessible where a drag target isn't). Clicking the card body
 * itself (not the stage control) opens LeadDetailPanel. */
export function LeadCard({ lead, showAssignee, onOpen, onStageChange }: LeadCardProps) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-border-subtle bg-white p-3 shadow-sm">
      <button onClick={onOpen} className="flex flex-col gap-1 text-left">
        <p className="truncate text-sm font-semibold text-ink">{lead.prospect.name}</p>
        <p className="truncate text-xs text-muted">{lead.listingTitle}</p>
        {lead.prospect.budget != null && (
          <p className="text-xs font-semibold text-brand-navy">Budget: {lead.prospect.budget.toLocaleString()}</p>
        )}
      </button>

      <div className="flex items-center justify-between gap-2 pt-1">
        {showAssignee ? (
          <TeamMemberBadge name={lead.assigneeName} />
        ) : (
          <span className="text-[11px] text-muted">{new Date(lead.updatedAt).toLocaleDateString()}</span>
        )}

        <Dropdown
          align="right"
          trigger={(bind) => (
            <button
              {...bind}
              className="flex items-center gap-1 rounded-full border border-border-subtle px-2 py-1 text-[11px] font-semibold text-ink hover:bg-surface-muted"
            >
              Move
              <DynamicIcon name="ChevronDown" className="size-3" />
            </button>
          )}
        >
          {LEAD_STAGES.map((stage) => (
            <DropdownItem
              key={stage}
              label={STAGE_META[stage].label}
              onClick={() => onStageChange(stage)}
              className={stage === lead.stage ? "bg-surface-muted font-semibold" : undefined}
            />
          ))}
        </Dropdown>
      </div>
    </div>
  );
}
