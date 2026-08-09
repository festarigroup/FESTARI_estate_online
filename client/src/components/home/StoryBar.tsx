"use client";

import { useRef, useState } from "react";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { StoryAvatar } from "@/components/home/StoryAvatar";
import { CreateStoryModal } from "@/components/home/CreateStoryModal";
import { StoryViewer } from "@/components/home/StoryViewer";
import { STORIES } from "@/lib/mock-data";
import type { Story } from "@/types/home";

/** The current (composer) user's own rail bubble — new stories they share
 * get appended to this group instead of spawning a new bubble each time. */
const CURRENT_USER_STORY_ID = "kwame";

/** Horizontal story rail ("Horizontal Story Bar" in Figma), with a scroll-next button. */
export function StoryBar() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [stories, setStories] = useState<Story[]>(STORIES);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);

  function handleCreateStory({ image, caption, type }: { image: string; caption?: string; type?: "image" | "video" }) {
    setStories((prev) => {
      const newItem = { id: `story-item-${Date.now()}`, image, postedAt: "Just now", caption, type };
      const existing = prev.find((s) => s.id === CURRENT_USER_STORY_ID);
      const rest = prev.filter((s) => s.id !== CURRENT_USER_STORY_ID);
      const group: Story = existing
        ? { ...existing, items: [...existing.items, newItem] }
        : {
            id: CURRENT_USER_STORY_ID,
            name: "Kwame",
            avatar: "/images/avatar-kwame-topnav.png",
            ringColor: "gold",
            items: [newItem],
          };
      return [group, ...rest];
    });
  }

  return (
    <div className="relative w-full shrink-0 rounded-xl bg-white p-4 shadow-[0px_4px_12px_0px_rgba(0,31,63,0.08)]">
      <div ref={scrollerRef} className="flex items-center gap-6 overflow-x-auto scroll-smooth pr-2 [scrollbar-width:none]">
        <div className="flex shrink-0 flex-col items-center gap-2">
          <button
            aria-label="Create a story"
            onClick={() => setModalOpen(true)}
            className="flex size-14 items-center justify-center rounded-full border-2 border-dashed border-muted text-muted hover:border-brand-gold hover:text-brand-gold"
          >
            <DynamicIcon name="Plus" className="size-4" />
          </button>
          <span className="text-[11px] font-medium text-ink">Create Story</span>
        </div>

        {stories.map((story, i) => (
          <StoryAvatar key={story.id} story={story} onClick={() => setViewerIndex(i)} />
        ))}
      </div>

      <button
        aria-label="Scroll stories"
        onClick={() => scrollerRef.current?.scrollBy({ left: 200, behavior: "smooth" })}
        className="absolute top-1/2 -right-5 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-border-subtle bg-white text-ink shadow-md hover:bg-surface-muted"
      >
        <DynamicIcon name="ChevronRight" className="size-4" />
      </button>

      <CreateStoryModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={handleCreateStory}
      />

      {viewerIndex !== null && (
        <StoryViewer
          groups={stories}
          initialGroupIndex={viewerIndex}
          onClose={() => setViewerIndex(null)}
        />
      )}
    </div>
  );
}
