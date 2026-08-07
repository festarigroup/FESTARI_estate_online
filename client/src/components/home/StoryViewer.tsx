"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Avatar } from "@/components/ui/Avatar";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import type { Story } from "@/types/home";

const DURATION_MS = 5000;
const TICK_MS = 50;

interface StoryViewerProps {
  groups: Story[];
  initialGroupIndex: number;
  onClose: () => void;
}

/** Full-screen story viewer — tap the right half to advance, the left half to
 * go back, or the dark margin outside the frame to close. Not a Figma frame
 * (the file only shows the collapsed rail); built Instagram/Facebook-style
 * since that's the universal convention for "open a story."
 *
 * Each rail bubble is a `Story` group that can hold multiple `items`. The
 * progress bar segments the *current* group's items; finishing the last item
 * advances to the next person's group, same as the platforms this is modeled
 * on — a person with 3 stories plays all 3 before moving on.
 */
export function StoryViewer({ groups, initialGroupIndex, onClose }: StoryViewerProps) {
  const [groupIndex, setGroupIndex] = useState(initialGroupIndex);
  const [itemIndex, setItemIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const group = groups[groupIndex];
  const item = group.items[itemIndex];

  function goNext() {
    setProgress(0);
    if (itemIndex < group.items.length - 1) {
      setItemIndex((i) => i + 1);
      return;
    }
    if (groupIndex >= groups.length - 1) {
      onClose();
      return;
    }
    setGroupIndex((g) => g + 1);
    setItemIndex(0);
  }

  function goPrev() {
    setProgress(0);
    if (itemIndex > 0) {
      setItemIndex((i) => i - 1);
      return;
    }
    if (groupIndex === 0) return;
    const prevItemCount = groups[groupIndex - 1].items.length;
    setGroupIndex((g) => g - 1);
    setItemIndex(prevItemCount - 1);
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
    // Restart the timer whenever the current item changes — goNext/goPrev
    // close over `groupIndex`/`itemIndex`, both listed as deps.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupIndex, itemIndex]);

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
          {group.items.map((it, i) => (
            <div key={it.id} className="h-1 flex-1 overflow-hidden rounded-full bg-white/30">
              <div
                className="h-full bg-white"
                style={{ width: `${i < itemIndex ? 100 : i === itemIndex ? progress : 0}%` }}
              />
            </div>
          ))}
        </div>

        <div className="absolute inset-x-3 top-8 z-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar src={group.avatar} alt={group.name} size={32} ring="gold" />
            <div>
              <p className="text-sm font-semibold text-white">{group.name}</p>
              <p className="text-xs text-white/70">{item.postedAt ?? "Active now"}</p>
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
        <img src={item.image} alt={group.name} className="size-full object-contain" />

        {item.caption && (
          <p className="absolute inset-x-4 bottom-4 z-20 text-center text-sm text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.8)]">
            {item.caption}
          </p>
        )}

        <button aria-label="Previous story" onClick={goPrev} className="absolute inset-y-0 left-0 z-10 w-1/2" />
        <button aria-label="Next story" onClick={goNext} className="absolute inset-y-0 right-0 z-10 w-1/2" />
      </div>
    </div>,
    document.body,
  );
}
