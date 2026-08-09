"use client";

import { useState } from "react";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { cn } from "@/lib/cn";
import type { Poll } from "@/types/home";

/** Interactive poll: vote once, see live percentage bars. Not from Figma —
 * built to give the composer's Poll button a real result, styled to match
 * the feed's cards (gold accent for the selected option, navy-tinted bars). */
export function PollBlock({ poll }: { poll: Poll }) {
  const [options, setOptions] = useState(poll.options);
  const [votedId, setVotedId] = useState<string | null>(null);

  const totalVotes = options.reduce((sum, o) => sum + o.votes, 0);

  function vote(id: string) {
    if (votedId) return;
    setVotedId(id);
    setOptions((prev) => prev.map((o) => (o.id === id ? { ...o, votes: o.votes + 1 } : o)));
  }

  return (
    <div className="flex w-full flex-col gap-3 rounded-xl border border-border-subtle p-4">
      <p className="font-heading text-sm text-ink">{poll.question}</p>
      <div className="flex flex-col gap-2">
        {options.map((option) => {
          const pct = totalVotes ? Math.round((option.votes / totalVotes) * 100) : 0;
          const isChoice = votedId === option.id;
          return (
            <button
              key={option.id}
              onClick={() => vote(option.id)}
              disabled={!!votedId}
              className={cn(
                "relative w-full overflow-hidden rounded-lg border px-4 py-2.5 text-left text-sm",
                isChoice ? "border-brand-gold" : "border-border-subtle",
                votedId ? "cursor-default" : "hover:border-brand-gold",
              )}
            >
              {votedId && (
                <span
                  className="absolute inset-y-0 left-0 bg-surface-muted"
                  style={{ width: `${pct}%` }}
                />
              )}
              <span className="relative flex items-center justify-between gap-2">
                <span className="flex items-center gap-2 text-ink">
                  {isChoice && <DynamicIcon name="Check" className="size-3.5 text-brand-gold" />}
                  {option.text}
                </span>
                {votedId && <span className="text-xs font-semibold text-muted">{pct}%</span>}
              </span>
            </button>
          );
        })}
      </div>
      <span className="text-xs text-muted">
        {totalVotes} vote{totalVotes === 1 ? "" : "s"}
      </span>
    </div>
  );
}
