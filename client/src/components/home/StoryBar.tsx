"use client";

import { useRef } from "react";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { StoryAvatar } from "@/components/home/StoryAvatar";
import { STORIES } from "@/lib/mock-data";

/** Horizontal story rail ("Horizontal Story Bar" in Figma), with a scroll-next button. */
export function StoryBar() {
  const scrollerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative w-full shrink-0 rounded-xl bg-white p-4 shadow-[0px_4px_12px_0px_rgba(0,31,63,0.08)]">
      <div ref={scrollerRef} className="flex items-center gap-6 overflow-x-auto scroll-smooth pr-2 [scrollbar-width:none]">
        <div className="flex shrink-0 flex-col items-center gap-2">
          <button
            aria-label="Create a story"
            className="flex size-14 items-center justify-center rounded-full border-2 border-dashed border-muted text-muted hover:border-brand-gold hover:text-brand-gold"
          >
            <DynamicIcon name="Plus" className="size-4" />
          </button>
          <span className="text-[11px] font-medium text-ink">Create Story</span>
        </div>

        {STORIES.map((story) => (
          <StoryAvatar key={story.id} story={story} />
        ))}
      </div>

      <button
        aria-label="Scroll stories"
        onClick={() => scrollerRef.current?.scrollBy({ left: 200, behavior: "smooth" })}
        className="absolute top-1/2 -right-5 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-border-subtle bg-white text-ink shadow-md hover:bg-surface-muted"
      >
        <DynamicIcon name="ChevronRight" className="size-4" />
      </button>
    </div>
  );
}
