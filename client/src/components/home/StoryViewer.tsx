"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
 *
 * Position is tracked as a single flat index into every group's items,
 * flattened end to end — deliberately *not* as separate groupIndex/itemIndex
 * state, and deliberately *not* moved from inside a `setFlatIndex` functional
 * updater either (an earlier version did both and regressed twice — see git
 * history). Two pieces of state advanced by separate non-atomic branch
 * checks can both read the same stale snapshot if two advances land in the
 * same tick (a timer tick and a keypress, or two key-repeats before React
 * re-renders) and both take the same branch, overshooting by one. And
 * calling `onClose` — which updates the *parent*'s state — from inside a
 * `setFlatIndex` updater runs it during that updater's evaluation, which
 * React flags as "updating a component while rendering a different one."
 *
 * `positionRef` is the actual source of truth: a plain ref mutates
 * synchronously and immediately, so N calls to goNext/goPrev in the same
 * tick each see the previous call's result with no batching involved, and
 * `onClose` only ever runs as a plain side effect of the click/keypress
 * handler that called it — never from inside a state updater. `flatIndex`
 * state exists purely to make React re-render with the ref's latest value.
 */
export function StoryViewer({ groups, initialGroupIndex, onClose }: StoryViewerProps) {
  const flat = useMemo(
    () => groups.flatMap((g, groupIndex) => g.items.map((_, itemIndex) => ({ groupIndex, itemIndex }))),
    [groups],
  );
  const initialFlatIndex = Math.max(
    flat.findIndex((f) => f.groupIndex === initialGroupIndex),
    0,
  );
  const positionRef = useRef(initialFlatIndex);
  const [flatIndex, setFlatIndex] = useState(initialFlatIndex);
  const [progress, setProgress] = useState(0);
  // Starts muted on every video — browsers block unmuted autoplay outright
  // (no user gesture backs it), so forcing sound on by default would just
  // fail silently. The speaker button is the user's own gesture to opt in.
  const [muted, setMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { groupIndex, itemIndex } = flat[flatIndex];
  const group = groups[groupIndex];
  const item = group.items[itemIndex];

  function goNext() {
    setProgress(0);
    const next = positionRef.current + 1;
    if (next >= flat.length) {
      onClose();
      return;
    }
    positionRef.current = next;
    setFlatIndex(next);
  }

  function goPrev() {
    setProgress(0);
    const prev = Math.max(positionRef.current - 1, 0);
    positionRef.current = prev;
    setFlatIndex(prev);
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
    // close over `flat`, which never changes for the viewer's lifetime.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flatIndex]);

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

  // Landing on a new video slide while unmuted (the user opted in on a
  // previous one) re-triggers autoplay outside any click, so the browser
  // can legally block it again. Retry explicitly and fall back to muted —
  // silent-but-playing beats stuck-and-silent.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.play().catch(() => {
      if (!v.muted) {
        v.muted = true;
        setMuted(true);
        v.play().catch(() => {});
      }
    });
  }, [flatIndex]);

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

        {item.type === "video" ? (
          // autoPlay + loop, no native controls: tapping the left/right
          // zones is still how you navigate (same as an image slide), so
          // visible video controls would just be dead weight fighting those
          // tap targets for the same gesture — same reasoning
          // PostImageLightbox's grid preview avoids `controls` for. Starts
          // muted (see the `muted` state above); the speaker button below
          // is the one control this view adds on top of that.
          <video
            key={item.id}
            ref={videoRef}
            src={item.image}
            autoPlay
            muted={muted}
            loop
            playsInline
            className="size-full object-contain"
          />
        ) : (
          // Plain <img>, not next/image: sources are either a blob: preview
          // (next/image can't optimize those) or a small fixed local asset —
          // either way there's no responsive/optimization benefit here.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.image} alt={group.name} className="size-full object-contain" />
        )}

        {item.type === "video" && (
          <button
            aria-label={muted ? "Unmute" : "Mute"}
            onClick={() => setMuted((m) => !m)}
            className="absolute top-16 right-3 z-20 flex size-8 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70"
          >
            <DynamicIcon name={muted ? "VolumeX" : "Volume2"} className="size-4" />
          </button>
        )}

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
