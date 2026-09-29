"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { comingSoonHref } from "@/lib/coming-soon";
import { shareContent } from "@/lib/share";
import { cn } from "@/lib/utils";
import { STORIES } from "@/lib/dummy-stories";
import { PostStoryModal, type PostedStory } from "@/components/shared/PostStoryModal";

const RING_GRADIENT =
  "linear-gradient(45deg, #f09433 0%, #e6643c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)";

const STORY_LIFETIME_MS = 24 * 60 * 60 * 1000;

interface MyStory extends PostedStory {
  id: string;
  postedAt: number;
}

function makeStoryId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `story-${Date.now()}`;
}

/** "Stories" card at the top of the "/home" dashboard — a horizontally
 * scrollable rail of avatars, each ringed in the Instagram-style gradient
 * that marks an unseen story. "Your story" doubles as the entry point for
 * actually posting one (you can post more than one, like the others' rails),
 * and each posted story expires — is dropped from the list — 24h after
 * posting, same as real stories. */
export function StoriesRow() {
  const [myStories, setMyStories] = useState<MyStory[]>([]);
  const [composerOpen, setComposerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);

  // Prune expired stories on an interval, not just on the next unrelated
  // render, so a story you leave the tab open past 24h on still disappears.
  useEffect(() => {
    const prune = () => {
      setMyStories((current) => {
        const active = current.filter((story) => Date.now() - story.postedAt < STORY_LIFETIME_MS);
        return active.length === current.length ? current : active;
      });
    };
    const interval = setInterval(prune, 60_000);
    return () => clearInterval(interval);
  }, []);

  const activeStories = myStories.filter((story) => Date.now() - story.postedAt < STORY_LIFETIME_MS);
  const latestStory = activeStories[activeStories.length - 1];

  function addStory(story: PostedStory) {
    setMyStories((current) => [...current, { ...story, id: makeStoryId(), postedAt: Date.now() }]);
  }

  function deleteStory(id: string) {
    setMyStories((current) => current.filter((story) => story.id !== id));
  }

  return (
    <div className="flex w-full flex-col gap-3 rounded-[28px] border border-gray-200 bg-white p-4">
      <div className="flex h-[18px] w-full items-center justify-between">
        <p className="text-[16px] font-bold text-gray-700">Stories</p>
        <Link href={comingSoonHref("Stories")} className="text-[13px] font-medium text-brand-600">
          View all
        </Link>
      </div>

      <div className="no-scrollbar flex w-full min-w-0 touch-pan-x items-start gap-5 overflow-x-auto pb-2">
        <StoryItem
          label="Your story"
          avatar={latestStory?.url ?? "/images/stories/your-story.jpg"}
          addBadge
          hasStory={activeStories.length > 0}
          onClick={() => (activeStories.length > 0 ? setViewerIndex(0) : setComposerOpen(true))}
        />
        {STORIES.map((story) => (
          <StoryItem key={story.id} href={comingSoonHref(`${story.name}'s Story`)} label={story.name} avatar={story.avatar} />
        ))}
      </div>

      <PostStoryModal open={composerOpen} onClose={() => setComposerOpen(false)} onPost={addStory} />

      {viewerIndex !== null && activeStories.length > 0 && (
        <MyStoryViewer
          stories={activeStories}
          initialIndex={viewerIndex}
          onClose={() => setViewerIndex(null)}
          onDelete={deleteStory}
          onAddAnother={() => {
            setViewerIndex(null);
            setComposerOpen(true);
          }}
        />
      )}
    </div>
  );
}

function StoryItem({
  href,
  label,
  avatar,
  addBadge,
  hasStory,
  onClick,
}: {
  href?: string;
  label: string;
  avatar: string;
  addBadge?: boolean;
  hasStory?: boolean;
  onClick?: () => void;
}) {
  const ringStyle = addBadge && !hasStory ? { backgroundColor: "#e2e8f0" } : { backgroundImage: RING_GRADIENT };

  const content = (
    <>
      <span className="relative flex size-14 shrink-0 items-center justify-center rounded-full p-0.5" style={ringStyle}>
        <span className="relative block size-full overflow-hidden rounded-full border-2 border-white">
          <Image src={avatar} alt="" fill className="object-cover" sizes="56px" />
        </span>
        {addBadge && (
          <span className="absolute -bottom-0.5 -right-0.5 flex size-5 items-center justify-center rounded-full border-2 border-white bg-brand-900 text-[11px] font-bold leading-none text-white">
            +
          </span>
        )}
      </span>
      <span className="w-full truncate pt-1.5 text-center text-[11px] font-medium text-night-900">{label}</span>
    </>
  );

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className="flex w-14 shrink-0 flex-col items-center">
        {content}
      </button>
    );
  }

  return (
    <Link href={href!} className="flex w-14 shrink-0 flex-col items-center">
      {content}
    </Link>
  );
}

function MyStoryViewer({
  stories,
  initialIndex,
  onClose,
  onDelete,
  onAddAnother,
}: {
  stories: MyStory[];
  initialIndex: number;
  onClose: () => void;
  onDelete: (id: string) => void;
  onAddAnother: () => void;
}) {
  const [index, setIndex] = useState(Math.min(initialIndex, stories.length - 1));
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // The list shrinks in place when a story is deleted or expires out from
  // under the viewer — keep the index in range instead of pointing past the end.
  useEffect(() => {
    if (index > stories.length - 1) setIndex(Math.max(0, stories.length - 1));
  }, [stories.length, index]);

  useEffect(() => {
    if (!menuOpen) return;
    const handlePointerDown = (event: PointerEvent) => {
      if (menuRef.current?.contains(event.target as Node)) return;
      setMenuOpen(false);
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [menuOpen]);

  if (stories.length === 0) return null;
  const story = stories[index];

  function goNext() {
    if (index >= stories.length - 1) {
      onClose();
      return;
    }
    setIndex((i) => i + 1);
  }

  function goPrev() {
    setIndex((i) => Math.max(0, i - 1));
  }

  function handleShare() {
    setMenuOpen(false);
    shareContent({ title: "My story", text: story.caption, path: `#my-story-${story.id}` });
  }

  function handleSave() {
    setMenuOpen(false);
    const link = document.createElement("a");
    link.href = story.url;
    link.download = story.isVideo ? "my-story.webm" : "my-story.jpg";
    link.click();
  }

  function handleDelete() {
    setMenuOpen(false);
    onDelete(story.id);
    if (stories.length <= 1) onClose();
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Your story"
    >
      <div onClick={(event) => event.stopPropagation()} className="relative flex max-h-[85vh] w-full max-w-[420px] flex-col">
        <div className="absolute -top-11 left-0 right-0 flex items-center justify-between gap-2">
          <button
            type="button"
            aria-label="Add another story"
            onClick={onAddAnother}
            className="flex size-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M10 3V17M3 10H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>

          <div className="flex items-center gap-2">
            <div ref={menuRef} className="relative">
              <button
                type="button"
                aria-label="Story options"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((v) => !v)}
                className="flex size-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="5" cy="12" r="2" fill="currentColor" />
                  <circle cx="12" cy="12" r="2" fill="currentColor" />
                  <circle cx="19" cy="12" r="2" fill="currentColor" />
                </svg>
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-[calc(100%+8px)] z-10 flex w-40 flex-col gap-1 rounded-xl border border-gray-200 bg-white p-1.5 shadow-lg">
                  <button
                    type="button"
                    onClick={handleShare}
                    className="flex h-9 w-full items-center rounded-lg px-3 text-left text-[13px] text-night-700 hover:bg-gray-50"
                  >
                    Share
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    className="flex h-9 w-full items-center rounded-lg px-3 text-left text-[13px] text-night-700 hover:bg-gray-50"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="flex h-9 w-full items-center rounded-lg px-3 text-left text-[13px] text-red-600 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>

            <button
              type="button"
              aria-label="Close"
              onClick={onClose}
              className="flex size-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
            >
              <svg width="14" height="14" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M1 1L11 11M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        <div className="relative aspect-[9/16] w-full overflow-hidden rounded-2xl bg-gray-900">
          {stories.length > 1 && (
            <div className="absolute inset-x-2 top-2 z-10 flex gap-1">
              {stories.map((s, i) => (
                <span key={s.id} className={cn("h-[3px] flex-1 rounded-full", i <= index ? "bg-white" : "bg-white/30")} />
              ))}
            </div>
          )}

          {story.isVideo ? (
            <video
              key={story.id}
              src={story.url}
              className="size-full object-cover"
              muted
              autoPlay
              loop
              controls
              playsInline
            />
          ) : (
            <Image key={story.id} src={story.url} alt="" fill className="object-cover" sizes="420px" />
          )}

          {story.caption && (
            <p className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-4 pb-4 pt-10 text-sm text-white">
              {story.caption}
            </p>
          )}

          {stories.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Previous story"
                onClick={goPrev}
                disabled={index === 0}
                className="absolute inset-y-0 left-0 w-1/3 disabled:cursor-default"
              />
              <button type="button" aria-label="Next story" onClick={goNext} className="absolute inset-y-0 right-0 w-1/3" />
            </>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
