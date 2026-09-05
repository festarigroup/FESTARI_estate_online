import { LeadCard } from "@/components/leads/LeadCard";
import { LEAD_STAGES, STAGE_META, type Lead, type LeadStage } from "@/types/lead";

interface PipelineBoardProps {
  leads: Lead[];
  showAssignee: boolean;
  onOpenLead: (id: string) => void;
  onStageChange: (id: string, stage: LeadStage) => void;
}

/** The Kanban pipeline board — one column per LeadStage, in pipeline
 * order, horizontally scrolling (ten columns don't fit any reasonable
 * viewport at once, same reasoning as CategoryChips'/StatusTabs' own
 * scroll rails elsewhere in this app). */
export function PipelineBoard({ leads, showAssignee, onOpenLead, onStageChange }: PipelineBoardProps) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {LEAD_STAGES.map((stage) => {
        const columnLeads = leads.filter((lead) => lead.stage === stage);
        return (
          <div key={stage} className="flex w-[260px] shrink-0 flex-col gap-3 rounded-[19px] bg-surface-muted p-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-semibold text-ink">{STAGE_META[stage].label}</span>
              <span className="flex min-w-[20px] items-center justify-center rounded-full bg-white px-1.5 text-[11px] font-semibold text-muted">
                {columnLeads.length}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              {columnLeads.map((lead) => (
                <LeadCard
                  key={lead.id}
                  lead={lead}
                  showAssignee={showAssignee}
                  onOpen={() => onOpenLead(lead.id)}
                  onStageChange={(next) => onStageChange(lead.id, next)}
                />
              ))}
              {columnLeads.length === 0 && <p className="px-1 text-[11px] text-muted">None</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
