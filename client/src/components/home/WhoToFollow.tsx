"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Avatar } from "@/components/ui/Avatar";
import { SidebarWidgetHeader } from "@/components/home/SidebarWidgetHeader";
import { cn } from "@/lib/cn";
import { FOLLOW_SUGGESTIONS } from "@/lib/mock-data";

/** "Who to follow" widget — suggested people/businesses with a Follow toggle each. */
export function WhoToFollow() {
  const [followed, setFollowed] = useState<Set<string>>(new Set());

  function toggleFollow(id: string, name: string) {
    // Compute the flip first — state updaters must stay pure (React's Strict
    // Mode double-invokes them in dev), so the toast side effect lives here.
    const willFollow = !followed.has(id);
    if (willFollow) {
      toast.success(`You're now following ${name}.`);
    }
    setFollowed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  return (
    <div className="flex w-full shrink-0 flex-col gap-6 rounded-xl border border-border bg-white p-6">
      <SidebarWidgetHeader title="Who to follow" seeAllHref="/professionals" />
      <div className="flex w-full flex-col gap-4">
        {FOLLOW_SUGGESTIONS.map((person) => {
          const isFollowed = followed.has(person.id);
          return (
            <div key={person.id} className="flex w-full items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar src={person.avatar} alt={person.name} size={40} />
                <div>
                  <h4 className="text-sm font-semibold text-ink">{person.name}</h4>
                  <p className="text-[10px] text-muted">{person.role}</p>
                </div>
              </div>
              <button
                onClick={() => toggleFollow(person.id, person.name)}
                className={cn(
                  "rounded-full px-4 py-1.5 text-[10px] font-semibold",
                  isFollowed ? "bg-brand-navy text-white" : "bg-surface-muted text-brand-navy",
                )}
              >
                {isFollowed ? "Following" : "Follow"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
