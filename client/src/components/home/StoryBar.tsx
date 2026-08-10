"use client";

import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { StoryAvatar } from "@/components/home/StoryAvatar";
import { CreateStoryModal } from "@/components/home/CreateStoryModal";
import { StoryViewer } from "@/components/home/StoryViewer";
import { createStory, deleteStory, listStories } from "@/lib/api/feed";
import { mapStoriesToGroups } from "@/lib/adapters";
import { ApiError } from "@/lib/api/client";
import { useHiddenStories } from "@/hooks/useHiddenStories";
import { useMutedAuthors } from "@/hooks/useMutedAuthors";
import type { Story } from "@/types/home";

/** Horizontal story rail ("Horizontal Story Bar" in Figma), with a scroll-next button. */
export function StoryBar() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [stories, setStories] = useState<Story[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const { isHidden: isStoryHidden, hideStory, unhideStory } = useHiddenStories();
  const { isMuted } = useMutedAuthors();

  // "Report story" (per-item) and "Mute X" (per-author, shared with
  // PostOptionsMenu's own Mute) both apply here — same list StoryViewer
  // opens from, so a reported/muted story never appears in either place.
  const visibleStories = stories
    .map((group) => ({ ...group, items: group.items.filter((item) => !isStoryHidden(item.id)) }))
    .filter((group) => group.items.length > 0 && !isMuted(group.name));

  useEffect(() => {
    listStories()
      .then((apiStories) => setStories(mapStoriesToGroups(apiStories)))
      .catch(() => {});
  }, []);

  async function handleCreateStory({ file, caption }: { file: File; caption?: string }) {
    try {
      await createStory(file, caption);
      const apiStories = await listStories();
      setStories(mapStoriesToGroups(apiStories));
      toast.success("Your story is live for 24 hours.");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Couldn't share your story.");
    }
  }

  // Passed to StoryViewer's own "Delete story" action (own stories only).
  // Drops the item out of local state immediately rather than refetching
  // the whole list, and drops the group bubble too once it's run out of
  // items — same reasoning PostOptionsMenu's delete applies to a post.
  async function handleDeleteStory(storyId: string) {
    await deleteStory(storyId);
    setStories((prev) =>
      prev
        .map((group) => ({ ...group, items: group.items.filter((item) => item.id !== storyId) }))
        .filter((group) => group.items.length > 0),
    );
  }

  // Passed to StoryViewer's own "Report story" action (someone else's
  // stories only). No backend endpoint backs this (same as PostOptionsMenu's
  // "Report post"), so it's a client-side hide with an Undo window rather
  // than a real moderation call.
  function handleReportStory(storyId: string) {
    hideStory(storyId);
    toast((t) => (
      <div className="flex items-center gap-4">
        <span className="text-sm text-ink">Story reported. We&apos;ll take a look.</span>
        <button
          onClick={() => {
            unhideStory(storyId);
            toast.dismiss(t.id);
          }}
          className="text-sm font-semibold text-brand-gold hover:underline"
        >
          Undo
        </button>
      </div>
    ));
  }

  return (
    <div className="relative w-full shrink-0 rounded-[19px] border border-border bg-white p-4 lg:rounded-[24px]">
      <div ref={scrollerRef} className="no-scrollbar flex items-center gap-6 overflow-x-auto scroll-smooth pr-2">
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

        {visibleStories.map((story, i) => (
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
          groups={visibleStories}
          initialGroupIndex={viewerIndex}
          onClose={() => setViewerIndex(null)}
          onDelete={handleDeleteStory}
          onReport={handleReportStory}
        />
      )}
    </div>
  );
}
