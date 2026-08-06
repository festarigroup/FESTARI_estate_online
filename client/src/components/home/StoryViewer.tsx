"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Avatar } from "@/components/ui/Avatar";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import type { Story } from "@/types/home";

const DURATION_MS = 5000;
const TICK_MS = 50;

interface StoryViewerProps {
  stories: Story[];
  initialIndex: number;
  onClose: () => void;
}

/**
 * Full-screen story viewer — tap the right half to advance, the left half to
 * go back, or the dark margin outside the frame to close. Not a Figma frame
 * (the file only shows the collapsed rail); built Instagram/Facebook-style
 * since that's the universal convention for "open a story."
 *
 * Reuses each story's avatar image as the full-bleed photo (via `storyImage`,
 * falling back to `avatar`): the app has no separate "story content" asset,
 * so the same picture the rail shows is what plays here — real for
 * freshly-created stories, since that photo IS what the user just picked.
 * `storyImage` exists as an escape hatch for a story whose `avatar` isn't
 * fit for full-screen display (used earlier for two seeded stories whose
 * Figma-exported avatar turned out to be a broken placeholder — see the
 * asset-replacement notes in mock-data.ts's git history); no current story
 * needs it now that those assets are fixed.
 */
export function StoryViewer({ stories, initialIndex, onClose }: StoryViewerProps) {
  const [index, setIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const story = stories[index];
  const photo = story.storyImage ?? story.avatar;

  function goNext() {
    setProgress(0);
    setIndex((i) => {
      if (i >= stories.length - 1) {
        onClose();
        return i;
      }
      return i + 1;
    });
  }

  function goPrev() {
    setProgress(0);
    setIndex((i) => Math.max(i - 1, 0));
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p + (TICK_MS / DURATION_MS) * 100 >= 100) {
          goNext();
          return 0;
        }
        return p + (TICK_MS / DURATION_MS) * 100;
      });
    }, TICK_MS);
    return () => clearInterval(interval);
    // Restart the timer whenever the story changes — goNext/goPrev close
    // over `stories.length`, which never changes for the viewer's lifetime.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 p-4">
      <button aria-label="Close story viewer" onClick={onClose} className="fixed inset-0" />

      <div className="relative flex h-[85vh] w-full max-w-[420px] flex-col overflow-hidden rounded-xl bg-black">
        <div className="absolute inset-x-3 top-3 z-20 flex gap-1">
          {stories.map((s, i) => (
            <div key={s.id} className="h-1 flex-1 overflow-hidden rounded-full bg-white/30">
              <div
                className="h-full bg-white"
                style={{ width: `${i < index ? 100 : i === index ? progress : 0}%` }}
              />
            </div>
          ))}
        </div>

        <div className="absolute inset-x-3 top-8 z-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar src={story.avatar} alt={story.name} size={32} ring="gold" />
            <div>
              <p className="text-sm font-semibold text-white">{story.name}</p>
              <p className="text-xs text-white/70">{story.postedAt ?? "Active now"}</p>
            </div>
          </div>
          <button aria-label="Close" onClick={onClose} className="text-white/80 hover:text-white">
            <DynamicIcon name="X" className="size-5" />
          </button>
        </div>

        {/* Plain <img>, not next/image: sources are either a blob: preview
            (next/image can't optimize those) or a small fixed local asset —
            either way there's no responsive/optimization benefit here. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photo} alt={story.name} className="size-full object-contain" />

        {story.caption && (
          <p className="absolute inset-x-4 bottom-4 z-20 text-center text-sm text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.8)]">
            {story.caption}
          </p>
        )}

        <button aria-label="Previous story" onClick={goPrev} className="absolute inset-y-0 left-0 z-10 w-1/2" />
        <button aria-label="Next story" onClick={goNext} className="absolute inset-y-0 right-0 z-10 w-1/2" />
      </div>
    </div>,
    document.body,
  );
}
