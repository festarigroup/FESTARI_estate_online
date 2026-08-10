"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";
import { Avatar } from "@/components/ui/Avatar";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { Dropdown, DropdownItem } from "@/components/ui/Dropdown";
import { useAuth } from "@/context/AuthContext";
import { useFollowedAuthors } from "@/hooks/useFollowedAuthors";
import { useMutedAuthors } from "@/hooks/useMutedAuthors";
import { ApiError } from "@/lib/api/client";
import type { Story } from "@/types/home";

const DURATION_MS = 5000;
const TICK_MS = 50;

interface StoryViewerProps {
  groups: Story[];
  initialGroupIndex: number;
  onClose: () => void;
  /** Deletes the given story item on the backend and drops it from the
   * parent's own list — StoryBar owns that, this view only asks for it.
   * Rethrows on failure so handleDelete below can report it and skip
   * closing the viewer. */
  onDelete: (storyId: string) => Promise<void>;
  /** Hides the given story item from StoryBar's own list (client-side only,
   * with an Undo toast StoryBar owns) — used by "Report story" on someone
   * else's story. */
  onReport: (storyId: string) => void;
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
 * The "⋮" menu in the header has two different item sets, same convention
 * as PostOptionsMenu:
 * - Your own story (group.id === the signed-in user's id, since groups are
 *   keyed by author_id): Forward, Save for myself, Delete story.
 * - Someone else's story: Follow/Unfollow, Mute/Unmute, Report story — the
 *   same Mute/Follow stores PostOptionsMenu uses for posts, so muting or
 *   unfollowing someone here also affects their posts, and vice versa.
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
export function StoryViewer({ groups, initialGroupIndex, onClose, onDelete, onReport }: StoryViewerProps) {
  const { user } = useAuth();
  const { isFollowing, toggleFollow } = useFollowedAuthors();
  const { isMuted, toggleMute } = useMutedAuthors();
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
  // Story groups are keyed by author_id (see mapStoriesToGroups), so this
  // is a direct id comparison — no name-matching fallback needed the way
  // PostOptionsMenu's mute/follow have to for a post's PostAuthor.
  const isOwnStory = !!user && group.id === user.id;
  // Only meaningful (and only rendered) when !isOwnStory, same Mute/Follow
  // stores PostOptionsMenu uses for posts — muting or unfollowing someone
  // from their story affects their posts too, and vice versa, since it's
  // the same person either way. Named `authorMuted` (not `muted`) to stay
  // distinct from the video-sound `muted` state above.
  const following = isFollowing(group.name);
  const authorMuted = isMuted(group.name);

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

  // Native share sheet with a copy-to-clipboard fallback, same pattern as
  // usePostShare — there's no story-specific backend action to record here
  // (stories don't track a share count the way posts do).
  async function handleForward() {
    const shareData: ShareData = {
      title: `${group.name}'s story on Festari Estates`,
      text: item.caption || `A story from ${group.name} on Festari Estates`,
      url: item.image,
    };

    if (navigator.share && (navigator.canShare?.(shareData) ?? true)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if ((err as Error)?.name !== "AbortError") toast.error("Couldn't forward this story.");
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(item.image);
      toast.success("Story link copied to clipboard.");
    } catch {
      toast.error("Couldn't copy the link.");
    }
  }

  // "Save for myself" — stories expire after 24 hours and there's no saved-
  // stories page to bookmark into (unlike posts' real Saved page), so the
  // only thing "save" can mean here is downloading your own media to your
  // device before it disappears.
  async function handleSave() {
    try {
      const response = await fetch(item.image);
      const blob = await response.blob();
      const extension = /\.([a-z0-9]+)(?:\?.*)?$/i.exec(item.image)?.[1] ?? (item.type === "video" ? "mp4" : "jpg");
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `festari-story-${item.id}.${extension}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(blobUrl);
      toast.success("Saved to your device.");
    } catch {
      toast.error("Couldn't save this story.");
    }
  }

  async function handleDelete() {
    if (!window.confirm("Delete this story? This can't be undone.")) return;
    try {
      await onDelete(item.id);
      toast.success("Story deleted.");
      // Deleting mid-view leaves `flat`/`groupIndex`/`itemIndex` pointing at
      // an item the parent's `groups` no longer has once it re-renders —
      // closing outright sidesteps reconciling a live position against a
      // list that just shrank out from under it.
      onClose();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Couldn't delete this story.");
    }
  }

  // Unlike Unfollow, muting leaves the follow relationship alone — see
  // PostOptionsMenu's identical distinction for a post's author.
  function handleToggleMuteAuthor() {
    const wasMuted = authorMuted;
    toggleMute(group.name);
    toast.success(
      wasMuted ? `You'll see posts from ${group.name} again.` : `You won't see posts or stories from ${group.name} anymore.`,
    );
  }

  function handleToggleFollowAuthor() {
    const wasFollowing = following;
    toggleFollow(group.name);
    toast.success(
      wasFollowing ? `You won't see updates from ${group.name}.` : `You'll see updates from ${group.name} again.`,
    );
  }

  // StoryBar owns the hide + Undo toast for this (same reasoning as
  // handleDeleteStory owning the real delete) — closing here just gets the
  // viewer out of the way of a story that no longer belongs in the rail.
  function handleReport() {
    onReport(item.id);
    onClose();
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
          <div className="flex items-center gap-3">
            <Dropdown
              align="right"
              trigger={(bind) => (
                <button {...bind} aria-label="Story options" className="text-white/80 hover:text-white">
                  <DynamicIcon name="MoreHorizontal" className="size-5" />
                </button>
              )}
            >
              {isOwnStory ? (
                <>
                  <DropdownItem icon="Forward" label="Forward" onClick={handleForward} />
                  <DropdownItem icon="Download" label="Save for myself" onClick={handleSave} />
                  <DropdownItem icon="Trash2" label="Delete story" onClick={handleDelete} className="text-brand-rust" />
                </>
              ) : (
                <>
                  <DropdownItem
                    icon="CircleX"
                    label={following ? `Unfollow ${group.name}` : `Follow ${group.name}`}
                    onClick={handleToggleFollowAuthor}
                  />
                  <DropdownItem
                    icon={authorMuted ? "Volume2" : "VolumeX"}
                    label={authorMuted ? `Unmute ${group.name}` : `Mute ${group.name}`}
                    onClick={handleToggleMuteAuthor}
                  />
                  <DropdownItem icon="Flag" label="Report story" onClick={handleReport} />
                </>
              )}
            </Dropdown>
            <button aria-label="Close" onClick={onClose} className="text-white/80 hover:text-white">
              <DynamicIcon name="X" className="size-5" />
            </button>
          </div>
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
