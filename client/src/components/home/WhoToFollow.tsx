"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Avatar } from "@/components/ui/Avatar";
import { SidebarWidgetHeader } from "@/components/home/SidebarWidgetHeader";
import { cn } from "@/lib/cn";
import { getSuggestions, followUser, unfollowUser } from "@/lib/api/social";
import { mapFollowSuggestion } from "@/lib/adapters";
import { FOLLOW_SUGGESTIONS } from "@/lib/mock-data";
import type { FollowSuggestion } from "@/types/home";

/** "Who to follow" widget — suggested people/businesses with a Follow toggle each. */
export function WhoToFollow() {
  const [people, setPeople] = useState<FollowSuggestion[]>([]);
  const [followed, setFollowed] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Falls back to mock suggestions when the API is unreachable or empty
    // (e.g. no backend hosted yet) so this widget isn't the only one that
    // silently disappears from the sidebar rail.
    getSuggestions()
      .then((suggestions) =>
        setPeople(suggestions.length > 0 ? suggestions.map(mapFollowSuggestion) : FOLLOW_SUGGESTIONS),
      )
      .catch(() => setPeople(FOLLOW_SUGGESTIONS));
  }, []);

  function toggleFollow(id: string, name: string) {
    const willFollow = !followed.has(id);
    setFollowed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

    const request = willFollow ? followUser(id) : unfollowUser(id);
    request
      .then(() => {
        if (willFollow) toast.success(`You're now following ${name}.`);
      })
      .catch(() => {
        setFollowed((prev) => {
          const next = new Set(prev);
          if (willFollow) next.delete(id);
          else next.add(id);
          return next;
        });
      });
  }

  if (people.length === 0) return null;

  return (
    <div className="flex w-full shrink-0 flex-col gap-6 rounded-xl border border-border bg-white p-6">
      <SidebarWidgetHeader title="Who to follow" seeAllHref="/professionals" />
      <div className="flex w-full flex-col gap-4">
        {people.map((person) => {
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
