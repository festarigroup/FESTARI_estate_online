"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { showSuccessToast } from "@/components/shared/AppToast";
import { FollowButton } from "@/components/shared/FollowButton";
import { NavIcon } from "@/components/shared/NavIcon";
import { Tooltip } from "@/components/shared/Tooltip";
import { DISCOVER_TABS, type DiscoverTab } from "@/components/shared/DiscoverTopBar";
import { useAnimatedSheet } from "@/hooks/useAnimatedSheet";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { comingSoonHref } from "@/lib/coming-soon";
import type { DiscoverReel } from "@/lib/dummy-reels";
import { shareContent } from "@/lib/share";
import { cn } from "@/lib/utils";

interface DiscoverReelCardProps {
  reel: DiscoverReel;
  className?: string;
  /** Opens the comments panel for this reel — the desktop side panel above
   * `xl:`, the mobile bottom sheet below it (see discover/page.tsx). */
  onOpenComments?: () => void;
  /** Opens the "Post a Reel" composer (see discover/page.tsx) instead of
   * routing to a coming-soon screen. */
  onOpenPostComposer?: () => void;
  /** Drives the mobile in-video "Reels ⌄" filter dropdown (Figma reference:
   * tabs live behind a dropdown on mobile instead of DiscoverTopBar's
   * horizontal row, which is hidden below `xl:` entirely). */
  activeTab?: DiscoverTab;
  onTabChange?: (tab: DiscoverTab) => void;
  /** Feed-wide "Auto-scroll" setting (desktop "Reel options" popover) — lives
   * in discover/page.tsx, not per-card, so every reel plays once (instead of
   * looping) and hands off to the next one consistently as you move through
   * the feed. */
  autoScroll?: boolean;
  onToggleAutoScroll?: () => void;
  onAutoScrollNext?: () => void;
}

interface LikeParticle {
  id: number;
  x: number;
  rotate: number;
  scale: number;
  delay: number;
}

function formatCount(value: number): string {
  if (value >= 1000) return `${Math.round(value / 100) / 10}k`.replace(".0k", "k");
  return String(value);
}

const OPTION_ICON_PROPS = { width: 14, height: 14, viewBox: "0 0 24 24", fill: "none", "aria-hidden": true } as const;

const AUTO_SCROLL_ICON = (
  <svg {...OPTION_ICON_PROPS}>
    <path d="M12 4v16M7 8l5-5 5 5M7 16l5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const INFO_ICON = (
  <svg {...OPTION_ICON_PROPS}>
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
    <path d="M12 8v5M12 16h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);
const INTERESTED_ICON = (
  <svg {...OPTION_ICON_PROPS}>
    <path d="M2 12s3.5-6.5 10-6.5S22 12 22 12s-3.5 6.5-10 6.5S2 12 2 12Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);
const NOT_INTERESTED_ICON = (
  <svg {...OPTION_ICON_PROPS}>
    <path
      d="M3 5l18 14M2 12s3.5-6.5 10-6.5c1.9 0 3.5.4 4.8 1M22 12s-1.1 2.05-3.2 3.7M9.5 14.6a2.5 2.5 0 0 0 3.4 1"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
const MANAGE_PREFERENCES_ICON = (
  <svg {...OPTION_ICON_PROPS}>
    <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.8" />
    <path d="M2 20c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="17" cy="7" r="2.2" stroke="currentColor" strokeWidth="1.8" />
    <path d="M14.5 14.3c2.6.4 4.5 2.3 4.5 5.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

function LockIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0 text-gray-400">
      <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0 text-brand-900">
      <path d="M4 12l6 6L20 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ToggleSwitch({ on }: { on: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn("flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 transition-colors", on ? "bg-brand-900" : "bg-gray-300")}
    >
      <span className={cn("size-4 rounded-full bg-white shadow transition-transform", on && "translate-x-4")} />
    </span>
  );
}

interface ReelOptionRowProps {
  icon: ReactNode;
  label: string;
  locked?: boolean;
  selected?: boolean;
  danger?: boolean;
  borderTop?: boolean;
  /** Renders a real on/off switch instead of the plain checkmark — for
   * settings like Auto-scroll that flip a persistent state rather than
   * recording a one-off choice. */
  toggle?: boolean;
  href?: string;
  onClick?: () => void;
}

/** One row of the desktop "Reel options" popover (Figma node 805:39305) —
 * shared between the plain coming-soon links and the three rows that are
 * actually wired up (Auto-scroll, Interested, Not Interested), so both kinds
 * get the same spacing/hover/selected styling instead of drifting apart. */
function ReelOptionRow({ icon, label, locked, selected, danger, borderTop, toggle, href, onClick }: ReelOptionRowProps) {
  const rowClassName = cn(
    "flex w-full items-center justify-between rounded-[10px] px-3 py-2 text-left text-[13px] font-medium",
    danger ? "text-[#ff3135] hover:bg-red-50" : "text-night-700 hover:bg-gray-50",
    selected && !danger && !toggle && "bg-brand-900/5 text-brand-900",
    borderTop && "mt-1 border-t border-gray-200 pt-3",
  );
  const content = (
    <>
      <span className="flex items-center gap-3">
        {icon}
        {label}
      </span>
      {toggle ? <ToggleSwitch on={!!selected} /> : locked ? <LockIcon /> : selected ? <CheckIcon /> : null}
    </>
  );

  if (href) {
    return (
      <Link href={href} onClick={onClick} className={rowClassName}>
        {content}
      </Link>
    );
  }
  return (
    <button
      type="button"
      onClick={onClick}
      role={toggle ? "switch" : undefined}
      aria-checked={toggle ? selected : undefined}
      className={rowClassName}
    >
      {content}
    </button>
  );
}

export function DiscoverReelCard({
  reel,
  className,
  onOpenComments,
  onOpenPostComposer,
  activeTab,
  onTabChange,
  autoScroll,
  onToggleAutoScroll,
  onAutoScrollNext,
}: DiscoverReelCardProps) {
  // JS-driven, not CSS `xl:hidden`/`hidden xl:grid` — the two layouts below
  // each embed their own <video>, and CSS-only dual-mounting would create
  // two real <video> elements sharing one ref/one autoplay cycle at once
  // (wasted bandwidth, and the ref would only ever control one of them).
  // Defaults to the desktop layout during SSR/first paint (this hook's
  // server snapshot is always `false`), correcting after mount.
  const isMobile = useMediaQuery("(max-width: 1279px)");
  const prefersReducedMotion = usePrefersReducedMotion();
  const [playing, setPlaying] = useState(!prefersReducedMotion);
  // Starts muted on every reel — browsers block unmuted autoplay outright,
  // so a reel that started unmuted would just silently fail to autoplay
  // instead of actually having sound. The speaker button lets anyone turn it
  // on with one tap (a real user gesture), including on reels they posted
  // themselves with their own audio.
  const [muted, setMuted] = useState(true);
  const [following, setFollowing] = useState(reel.following);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [shareCount, setShareCount] = useState(reel.shares);
  const [likeParticles, setLikeParticles] = useState<LikeParticle[]>([]);
  const [tabMenuOpen, setTabMenuOpen] = useState(false);
  const [optionsSheetOpen, setOptionsSheetOpen] = useState(false);
  const [desktopOptionsOpen, setDesktopOptionsOpen] = useState(false);
  const [feedback, setFeedback] = useState<"interested" | "not-interested" | null>(null);
  const { mounted: optionsSheetMounted, closing: optionsSheetClosing } = useAnimatedSheet(optionsSheetOpen);
  const videoRef = useRef<HTMLVideoElement>(null);
  const likeParticleIdRef = useRef(0);

  // "Interested"/"Not Interested" are mutually exclusive and toggle off on a
  // second click — a toast confirms the choice since there's nothing else on
  // screen that visibly changes right away (the feed itself doesn't re-rank).
  // Computed from the `feedback` closure rather than inside a `setFeedback`
  // updater — a side effect (the toast call) inside an updater can run
  // twice under React Strict Mode, which fired the toast twice.
  function handleFeedback(next: "interested" | "not-interested") {
    const nextValue = feedback === next ? null : next;
    setFeedback(nextValue);
    if (nextValue === "interested") showSuccessToast("Thanks — we'll show you more like this");
    else if (nextValue === "not-interested") showSuccessToast("Got it — we'll show you less like this");
    setDesktopOptionsOpen(false);
    setOptionsSheetOpen(false);
  }

  // TikTok/Instagram-style reaction: liking the reel (not unliking it) sends
  // up a small shower of hearts drifting from the center of the video,
  // staggered and slow, rather than a single instant pop — closer to how
  // every other reels feed actually "feels" when you like one. Each particle
  // removes itself from state via its own `onAnimationComplete`, so there's
  // no shared timer to leak or race against fast repeat taps.
  function toggleLike() {
    setLiked((current) => {
      const next = !current;
      if (next && !prefersReducedMotion) {
        const batch: LikeParticle[] = Array.from({ length: 7 }, () => {
          likeParticleIdRef.current += 1;
          return {
            id: likeParticleIdRef.current,
            x: Math.random() * 120 - 60,
            rotate: Math.random() * 50 - 25,
            scale: 0.75 + Math.random() * 0.55,
            delay: Math.random() * 0.5,
          };
        });
        setLikeParticles((current2) => [...current2, ...batch]);
      }
      return next;
    });
  }

  function removeLikeParticle(id: number) {
    setLikeParticles((current) => current.filter((particle) => particle.id !== id));
  }

  function handleShare() {
    shareContent({
      title: `${reel.authorName}'s reel`,
      text: reel.caption.replace(" (More)", ""),
      path: `#reel-${reel.id}`,
    });
    setShareCount((count) => count + 1);
  }

  // `playing` mirrors the video's actual native state via its own play/pause
  // events, rather than driving the video one-way from React state — if that
  // were reversed, a silently-rejected autoplay (common on mobile even when
  // muted) or the browser auto-pausing an off-screen video would leave
  // `playing` saying "true" while the video is really paused, and the
  // button's first click would toggle the (already-wrong) state without
  // ever actually calling `.play()`. Making the video's own events the
  // single source of truth means the button can never go out of sync with
  // what's actually happening.
  //
  // Depends on `isMobile`: `useMediaQuery`'s SSR snapshot always starts as
  // "desktop", then corrects right after mount if the viewport is actually
  // narrow — swapping which of the two return branches below is rendered,
  // which mounts a brand-new <video> DOM node. With an empty deps array this
  // effect would only ever attach to that first (desktop) node and never
  // reattach once the real mobile video mounts, leaving the icon/progress
  // permanently stuck reflecting a video that's no longer even on screen.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const syncPlaying = () => setPlaying(!video.paused);
    video.addEventListener("play", syncPlaying);
    video.addEventListener("pause", syncPlaying);
    syncPlaying();
    return () => {
      video.removeEventListener("play", syncPlaying);
      video.removeEventListener("pause", syncPlaying);
    };
  }, [isMobile]);

  function togglePlayback() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) video.play().catch(() => undefined);
    else video.pause();
  }

  // Drives the gradient bar at the bottom of the card as a real playback
  // tracker instead of a static decoration. Same `[isMobile]` reasoning as
  // the play/pause effect above — needs to reattach to whichever <video>
  // node is actually mounted after the branch swap.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const updateProgress = () => {
      if (!video.duration) return;
      setProgress((video.currentTime / video.duration) * 100);
    };
    video.addEventListener("timeupdate", updateProgress);
    video.addEventListener("loadedmetadata", updateProgress);
    return () => {
      video.removeEventListener("timeupdate", updateProgress);
      video.removeEventListener("loadedmetadata", updateProgress);
    };
  }, [isMobile]);

  function seek(event: MouseEvent<HTMLDivElement>) {
    // The whole reel (mobile) / video column (desktop) toggles playback on
    // tap — stop this click from bubbling up to that, or seeking would also
    // pause/resume the video.
    event.stopPropagation();
    const video = videoRef.current;
    if (!video?.duration) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
    video.currentTime = ratio * video.duration;
    setProgress(ratio * 100);
  }

  const likeCount = liked ? reel.likes + 1 : reel.likes;
  const saveCount = saved ? reel.saves + 1 : reel.saves;
  const captionText = reel.caption.replace(" (More)", "");

  const videoEl = (
    <video
      ref={videoRef}
      src={reel.video}
      poster={reel.poster}
      aria-label={reel.caption}
      autoPlay={!prefersReducedMotion}
      // Looping is the default feed behavior; when the feed-wide Auto-scroll
      // setting is on, each reel plays once and `onEnded` hands off to the
      // next one instead of repeating.
      loop={!autoScroll}
      onEnded={autoScroll ? onAutoScrollNext : undefined}
      muted={muted}
      playsInline
      // No onClick here — the tap-to-toggle handler lives on the
      // surrounding container (mobile: the whole screen; desktop: the video
      // column) instead, so tapping *anywhere* on the reel works, not just
      // the exact pixels the video itself occupies. Every other control
      // (progress bar, post/play buttons, action rail) stops its own click
      // from bubbling there, so this is purely about the empty space.
      className="absolute inset-0 size-full object-cover"
    />
  );

  const muteButton = (
    <Tooltip label={muted ? "Unmute" : "Mute"} className="absolute right-3 top-16 z-20 xl:top-3">
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          setMuted((v) => !v);
        }}
        aria-pressed={!muted}
        aria-label={muted ? "Unmute" : "Mute"}
        className="flex size-7 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-sm"
      >
        {muted ? (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 9v6h4l5 5V4L8 9H4Z" fill="currentColor" />
            <path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a9 9 0 0 1 0 12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" opacity="0.35" />
            <path d="M15.5 9.5l5 5m0-5l-5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 9v6h4l5 5V4L8 9H4Z" fill="currentColor" />
            <path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a9 9 0 0 1 0 12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
        )}
      </button>
    </Tooltip>
  );

  const likeBurst = (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      <AnimatePresence>
        {likeParticles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{ opacity: 0, x: particle.x, y: 0, scale: particle.scale * 0.4, rotate: particle.rotate }}
            animate={{ opacity: [0, 1, 1, 0], y: -260, scale: particle.scale }}
            transition={{ duration: 2, delay: particle.delay, ease: "easeOut", times: [0, 0.12, 0.7, 1] }}
            onAnimationComplete={() => removeLikeParticle(particle.id)}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <svg width="34" height="34" viewBox="0 0 24 24" fill="#ef575f" aria-hidden="true" className="drop-shadow-[0_3px_8px_rgba(0,0,0,0.35)]">
              <path d="M12 21s-6.72-4.35-9.33-8.3C1.02 10.1 1.42 6.6 4.2 4.9c2.26-1.4 5.1-0.9 6.73 1.1L12 7.5l1.07-1.5c1.63-2 4.47-2.5 6.73-1.1 2.78 1.7 3.18 5.2 1.33 7.8C18.72 16.65 12 21 12 21z" />
            </svg>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );

  const progressBar = (
    <div
      role="slider"
      aria-label="Video progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress)}
      tabIndex={0}
      onClick={seek}
      onKeyDown={(event) => {
        const video = videoRef.current;
        if (!video?.duration) return;
        if (event.key === "ArrowRight") video.currentTime = Math.min(video.duration, video.currentTime + 5);
        else if (event.key === "ArrowLeft") video.currentTime = Math.max(0, video.currentTime - 5);
      }}
      className="absolute inset-x-0 bottom-0 h-2 cursor-pointer bg-white/25"
    >
      <div className="h-full bg-gradient-to-r from-[#5433ff] to-[#20bdff]" style={{ width: `${progress}%` }} />
    </div>
  );

  const playButton = (
    // Figma nodes 792:38372 (pause) and 792:38398 (play) — plain white
    // icons, no circular/backdrop container around them.
    <Tooltip label={playing ? "Pause" : "Play"} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          togglePlayback();
        }}
        aria-pressed={playing}
        aria-label={playing ? "Pause" : "Play"}
        className="flex items-center justify-center"
      >
        {playing ? (
          <svg width="37" height="37" viewBox="0 0 45.7332 45.7336" fill="none" aria-hidden="true">
            <path d="M10.1278 0.000220028H9.93889C8.38086 0.000178235 7.07198 0.000143124 6.01058 0.108117C4.89658 0.221441 3.84997 0.468954 2.90361 1.10129C2.19024 1.57795 1.57773 2.19046 1.10107 2.90383C0.468736 3.85019 0.221223 4.8968 0.107899 6.0108C-7.5267e-05 7.0722 -4.01562e-05 8.38101 1.6365e-06 9.93904V35.7947C-4.01562e-05 37.3527 -7.5267e-05 38.6616 0.107899 39.723C0.221223 40.837 0.468736 41.8836 1.10107 42.8299C1.57773 43.5433 2.19024 44.1558 2.90361 44.6325C3.84997 45.2648 4.89658 45.5123 6.01058 45.6257C7.072 45.7336 8.38083 45.7336 9.9389 45.7336H10.1278C11.6858 45.7336 12.9947 45.7336 14.0561 45.6257C15.1701 45.5123 16.2167 45.2648 17.1631 44.6325C17.8764 44.1558 18.4889 43.5433 18.9656 42.8299C19.5979 41.8836 19.8455 40.837 19.9588 39.723C20.0668 38.6616 20.0667 37.3527 20.0667 35.7947V9.93912C20.0667 8.38105 20.0668 7.07222 19.9588 6.0108C19.8455 4.8968 19.5979 3.85019 18.9656 2.90383C18.4889 2.19046 17.8764 1.57795 17.1631 1.10129C16.2167 0.468954 15.1701 0.221441 14.0561 0.108117C12.9947 0.000143124 11.6858 0.000178235 10.1278 0.000220028Z" fill="white" />
            <path d="M35.7943 1.54153e-06H35.6055C34.0474 -3.86155e-05 32.7385 -7.23464e-05 31.6771 0.1079C30.5631 0.221224 29.5165 0.468737 28.5702 1.10107C27.8568 1.57773 27.2443 2.19024 26.7676 2.90361C26.1353 3.84997 25.8878 4.89658 25.7745 6.01058C25.6665 7.07199 25.6665 8.3808 25.6666 9.93884V35.7944C25.6665 37.3525 25.6665 38.6614 25.7745 39.7228C25.8878 40.8368 26.1353 41.8834 26.7676 42.8297C27.2443 43.5431 27.8568 44.1556 28.5702 44.6323C29.5165 45.2646 30.5631 45.5121 31.6771 45.6254C32.7386 45.7334 34.0474 45.7334 35.6055 45.7333H35.7943C37.3524 45.7334 38.6612 45.7334 39.7227 45.6254C40.8367 45.5121 41.8833 45.2646 42.8296 44.6323C43.543 44.1556 44.1555 43.5431 44.6322 42.8297C45.2645 41.8834 45.512 40.8368 45.6253 39.7228C45.7333 38.6614 45.7333 37.3526 45.7332 35.7945V9.9389C45.7333 8.38088 45.7333 7.07198 45.6253 6.01058C45.512 4.89658 45.2645 3.84997 44.6322 2.90361C44.1555 2.19024 43.543 1.57773 42.8296 1.10107C41.8833 0.468737 40.8367 0.221224 39.7227 0.1079C38.6613 -7.23464e-05 37.3524 -3.86155e-05 35.7943 1.54153e-06Z" fill="white" />
          </svg>
        ) : (
          <svg width="34" height="37" viewBox="0 0 39.5 42.2501" fill="none" aria-hidden="true">
            <path
              d="M38.6991 23.4515C37.7271 27.1448 33.1333 29.7546 23.9458 34.9742C15.0641 40.0201 10.6233 42.543 7.04454 41.5289C5.56495 41.1096 4.21687 40.3133 3.12967 39.2164C0.5 36.5633 0.5 31.4172 0.5 21.125C0.5 10.8329 0.5 5.68681 3.12967 3.03367C4.21687 1.93677 5.56495 1.14047 7.04454 0.721198C10.6233 -0.292924 15.0641 2.23 23.9458 7.27584C33.1333 12.4955 37.7271 15.1053 38.6991 18.7986C39.1003 20.3231 39.1003 21.927 38.6991 23.4515Z"
              fill="white"
              stroke="white"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>
    </Tooltip>
  );

  const postButton = (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        onOpenPostComposer?.();
      }}
      aria-label="Post a reel"
      // Desktop only — mobile's equivalent button lives inline in the
      // in-video overlay header instead of floating absolutely (see the
      // mobile branch below), since that header already reserves this exact
      // top-left corner.
      className="absolute left-3 top-3 flex size-7 items-center justify-center rounded-[16px] bg-gradient-to-r from-[#5433ff] to-[#20bdff] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] transition-transform hover:scale-105"
    >
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
        <path d="M6 0.5V11.5M0.5 6H11.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </button>
  );

  if (isMobile) {
    // Full-screen, TikTok/Reels-style takeover — no app chrome at all above
    // it (DiscoverTopBar and the story rail are hidden entirely below `xl:`,
    // see DiscoverTopBar.tsx), so the video is the only thing on screen; the
    // back/filter/more controls that would normally live in a navbar are
    // instead a transparent overlay floating on top of the video itself.
    // `100vh`, not `100dvh` — AppShell's own outer shell is `h-screen`
    // (100vh), so matching that unit exactly is what makes this reel's
    // height equal the full viewport with no gap at the bottom; mixing
    // viewport units here would under/overshoot it depending on whether the
    // mobile browser's address bar is showing.
    return (
      // `onClick` here, not just on the <video> — this is what makes tapping
      // *anywhere* on the screen toggle playback (the gradient scrim and the
      // caption's own empty space aren't the video element, so without this
      // on the container, tapping them would do nothing). Every actual
      // control below stops its click from bubbling here.
      <div onClick={togglePlayback} className={cn("relative h-screen w-full overflow-hidden bg-black", className)}>
        {videoEl}
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/60 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent" />
        {likeBurst}
        {progressBar}
        {playButton}
        {muteButton}

        {/* `sticky`, not `fixed` — this reel's own wrapper is exactly one
            viewport tall and is what the scroll-snap stack aligns to, so a
            sticky child pins to the top of the screen for exactly as long as
            *this* reel is the one in view, then hands off to the next reel's
            own header as the user swipes past — no global/lifted state or
            scroll-position tracking needed, and each header still reads the
            right reel's own save/repost state. */}
        <div
          onClick={(event) => event.stopPropagation()}
          className="sticky top-0 z-30 flex items-center justify-between px-4 pb-2 pt-[max(14px,env(safe-area-inset-top))]"
        >
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onOpenPostComposer?.();
            }}
            aria-label="Post a reel"
            className="flex size-9 items-center justify-center rounded-[16px] bg-gradient-to-r from-[#5433ff] to-[#20bdff] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]"
          >
            <svg width="14" height="14" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M6 0.5V11.5M0.5 6H11.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>

          <div className="relative">
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={tabMenuOpen}
              onClick={() => setTabMenuOpen((v) => !v)}
              className="flex items-center gap-1 text-[16px] font-bold text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.5)]"
            >
              Reels
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" className={cn("transition-transform", tabMenuOpen && "rotate-180")}>
                <path d="M2.5 4.5L6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {tabMenuOpen && (
              <>
                <div className="fixed inset-0 z-20" onClick={() => setTabMenuOpen(false)} />
                <div className="absolute left-1/2 top-full z-30 mt-2 w-[180px] -translate-x-1/2 rounded-[16px] border border-white/15 bg-black/35 p-1.5 shadow-[0px_12px_30px_rgba(0,0,0,0.35)] backdrop-blur-xl">
                  {DISCOVER_TABS.map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => {
                        onTabChange?.(tab);
                        setTabMenuOpen(false);
                      }}
                      className={cn(
                        "block w-full rounded-[10px] px-3 py-2 text-left text-[13px] font-medium",
                        tab === activeTab ? "bg-white/25 text-white" : "text-white/85 hover:bg-white/10",
                      )}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <button
            type="button"
            aria-label="More options"
            aria-haspopup="dialog"
            aria-expanded={optionsSheetOpen}
            onClick={() => setOptionsSheetOpen(true)}
            className="flex size-9 items-center justify-center"
          >
            <NavIcon icon="/icons/more-horizontal.svg" color="white" size={22} />
          </button>
        </div>

        <div
          onClick={(event) => event.stopPropagation()}
          className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 pb-6"
        >
          <div className="flex min-w-0 flex-col items-start gap-2">
            <div className="flex items-center gap-[6px]">
              <div className="relative size-9 shrink-0 overflow-hidden rounded-full border border-white/40">
                <Image src={reel.authorAvatar} alt="" fill sizes="36px" className="object-cover" />
              </div>
              <p className="whitespace-nowrap text-[14px] font-bold text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.5)]">
                {reel.authorName}
              </p>
              <FollowButton following={following} onToggle={() => setFollowing((v) => !v)} name={reel.authorName} />
            </div>
            <p className="line-clamp-2 text-[13px] font-medium text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.5)]">
              {captionText}
            </p>
          </div>

          <div className="flex shrink-0 flex-col items-center gap-[18px] pb-1">
            <button type="button" onClick={toggleLike} aria-pressed={liked} aria-label={`${formatCount(likeCount)} likes`} className="flex flex-col items-center gap-1">
              <NavIcon
                icon={liked ? "/icons/heart-like-filled.svg" : "/icons/heart-like.svg"}
                color="white"
                size={26}
                className={liked ? cn("bg-[#ef575f]", !prefersReducedMotion && "animate-like-pop") : undefined}
              />
              <span className="text-[11px] font-bold text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.5)]">
                {formatCount(likeCount)}
              </span>
            </button>

            <button type="button" onClick={onOpenComments} aria-label={`${formatCount(reel.comments)} comments`} className="flex flex-col items-center gap-1">
              <NavIcon icon="/icons/message-03.svg" color="white" size={26} />
              <span className="text-[11px] font-bold text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.5)]">
                {formatCount(reel.comments)}
              </span>
            </button>

            <button type="button" onClick={handleShare} aria-label={`Share — ${formatCount(shareCount)} shares`} className="flex flex-col items-center gap-1">
              <NavIcon icon="/icons/share-05.svg" color="white" size={26} />
              <span className="text-[11px] font-bold text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.5)]">
                {formatCount(shareCount)}
              </span>
            </button>

            <Link href={comingSoonHref("Repost")} aria-label={`${formatCount(reel.reposts)} reposts`} className="flex flex-col items-center gap-1 text-white">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]">
                <path d="M7 7h8a3 3 0 0 1 3 3v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M10 4 7 7l3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M17 17H9a3 3 0 0 1-3-3v-2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M14 20l3-3-3-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-[11px] font-bold text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.5)]">
                {formatCount(reel.reposts)}
              </span>
            </Link>

            <button type="button" onClick={() => setSaved((v) => !v)} aria-pressed={saved} aria-label={`${formatCount(saveCount)} saves`} className="flex flex-col items-center gap-1">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true" className={cn(saved ? "text-brand-300" : "text-white", "drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]")}>
                <path
                  d="M5 4.6C5 3.84575 5 3.46863 5.23431 3.23431C5.46863 3 5.84575 3 6.6 3H17.4C18.1542 3 18.5314 3 18.7657 3.23431C19 3.46863 19 3.84575 19 4.6V19.4454C19 20.1263 19 20.4667 18.783 20.5784C18.5661 20.69 18.289 20.4922 17.735 20.0964L12.93 16.6643C12.4809 16.3435 12.2564 16.1831 12 16.1831C11.7436 16.1831 11.5191 16.3435 11.07 16.6643L6.26499 20.0964C5.71095 20.4922 5.43393 20.69 5.21697 20.5784C5 20.4667 5 20.1263 5 19.4454V4.6Z"
                  fill={saved ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
              </svg>
              <span className="text-[11px] font-bold text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.5)]">
                {formatCount(saveCount)}
              </span>
            </button>
          </div>
        </div>

        {optionsSheetMounted &&
          createPortal(
            <div
              className="fixed inset-0 z-[120] flex items-end bg-black/50"
              onClick={() => setOptionsSheetOpen(false)}
              role="dialog"
              aria-modal="true"
              aria-label="Reel options"
            >
              <div
                onClick={(event) => event.stopPropagation()}
                className={cn(
                  "flex w-full flex-col gap-4 rounded-t-[32px] bg-white pb-6 pt-4 shadow-[0px_-4px_8px_0px_rgba(69,71,69,0.15)]",
                  optionsSheetClosing ? "animate-sheet-slide-down" : "animate-sheet-slide-up",
                )}
              >
                <div className="h-[3px] w-[152px] shrink-0 self-center rounded-[20px] bg-[#334154]" />

                <div className="flex w-full shrink-0 items-center gap-2.5 px-6">
                  <button
                    type="button"
                    aria-label="Close"
                    onClick={() => setOptionsSheetOpen(false)}
                    className="flex size-6 shrink-0 items-center justify-center text-night-900"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                      <path d="M10 4V16M10 16L4 10M10 16L16 10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <p className="flex-1 text-center text-lg font-bold tracking-[-0.54px] text-black">Reel options</p>
                  <span className="size-6 shrink-0" aria-hidden />
                </div>

                <div className="flex flex-col gap-1 px-4">
                  <ReelOptionRow
                    icon={AUTO_SCROLL_ICON}
                    label="Auto-scroll"
                    toggle
                    selected={autoScroll}
                    onClick={() => onToggleAutoScroll?.()}
                  />
                  <ReelOptionRow
                    icon={INFO_ICON}
                    label="Why you're seeing this post"
                    locked
                    href={comingSoonHref("Why you're seeing this post")}
                    onClick={() => setOptionsSheetOpen(false)}
                  />
                  <ReelOptionRow
                    icon={INTERESTED_ICON}
                    label="Interested"
                    selected={feedback === "interested"}
                    onClick={() => handleFeedback("interested")}
                  />
                  <ReelOptionRow
                    icon={NOT_INTERESTED_ICON}
                    label="Not Interested"
                    selected={feedback === "not-interested"}
                    onClick={() => handleFeedback("not-interested")}
                  />
                  <ReelOptionRow
                    icon={MANAGE_PREFERENCES_ICON}
                    label="Manage content preferences"
                    href={comingSoonHref("Manage content preferences")}
                    onClick={() => setOptionsSheetOpen(false)}
                  />
                  <ReelOptionRow
                    icon={INFO_ICON}
                    label="Report"
                    danger
                    borderTop
                    href={comingSoonHref("Report")}
                    onClick={() => setOptionsSheetOpen(false)}
                  />
                </div>
              </div>
            </div>,
            document.body,
          )}
      </div>
    );
  }

  // Desktop: author/caption, video and the action rail as three separate
  // columns (Figma's layout), symmetrically centered — see the grid-column
  // comment below.
  return (
    <div
      className={cn(
        "grid w-full grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] gap-0 xl:pl-[40px]",
        className,
      )}
    >
        {/* `justify-end` pins the author/caption block to the bottom of the
            row so it lines up with the video's bottom edge, matching the
            Figma design — the grid row's height is driven by the video
            column (see below), and this column stretches to match it.
            `mr-1` (4px) is the gap to the video itself; the extra `xl:pl-[40px]`
            on the row above is what pushes this whole column further from the
            sidebar without touching that tight 4px.
            `w-full max-w-[293px]` (not a fixed `w-[293px]`) is what makes this
            shrink along with the grid's `minmax(0,1fr)` column as the app
            sidebar expands/collapses and eats into the available row width,
            instead of overflowing past it. */}
        <div className="mr-1 flex w-full max-w-[293px] flex-col items-start justify-end gap-[8px] justify-self-end">
          <div className="flex w-full min-w-0 items-center gap-[6px]">
            <div className="flex min-w-0 items-center gap-2">
              <div className="relative size-[40px] shrink-0 overflow-hidden rounded-full">
                <Image src={reel.authorAvatar} alt="" fill sizes="40px" className="object-cover" />
                {reel.verified && (
                  <span className="absolute bottom-[-2px] right-[-2px] flex size-4 items-center justify-center rounded-full border-2 border-white bg-brand-600">
                    <span className="block size-1.5 rounded-full bg-white" />
                  </span>
                )}
              </div>
              <p className="truncate text-[14px] font-bold text-brand-900">{reel.authorName}</p>
            </div>
            <FollowButton following={following} onToggle={() => setFollowing((v) => !v)} name={reel.authorName} />
          </div>
          <p className="text-[14px] font-medium leading-[16px] text-black">
            {expanded || reel.caption.length <= 70 ? (
              captionText
            ) : (
              <>
                {captionText.slice(0, 70)}…{" "}
                <button type="button" onClick={() => setExpanded(true)} className="font-bold text-gray-500 hover:text-brand-900">
                  More
                </button>
              </>
            )}
          </p>
        </div>

        {/* Height-driven, not width-driven: fills almost the whole
            `calc(100vh-67px)` viewport slot the page gives each reel (see
            discover/page.tsx), capped at the design's native 780px so it
            doesn't grow absurdly tall on huge monitors; width (and the grid
            row height the other columns stretch to) follows from the
            402:716 aspect ratio. */}
        <div
          onClick={togglePlayback}
          className="relative aspect-[402/716] h-[min(780px,calc(100vh-91px))] w-auto max-w-[402px] shrink-0 overflow-hidden rounded-[16px] bg-gray-100"
        >
          {videoEl}
          <div className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-[#5433ff] to-[#20bdff]" />
          {likeBurst}
          {progressBar}
          {postButton}
          {playButton}
          {muteButton}
        </div>

        {/* `h-full` + `justify-between` (not a fixed `gap` + bottom padding)
            is what makes this responsive to the video's own height, which
            already shrinks to fit `calc(100vh-91px)` — the icons space
            themselves out across whatever room is actually available
            instead of needing a fixed ~340px regardless of viewport height,
            which is what pushed the lower icons below the fold on shorter
            screens (effectively into the next reel's snap section). */}
        <div className="ml-[32px] flex h-full flex-col items-center justify-between py-1 justify-self-start">
          <button type="button" onClick={toggleLike} aria-pressed={liked} aria-label={`${formatCount(likeCount)} likes`} className="flex flex-col items-center gap-1">
            <NavIcon
              icon={liked ? "/icons/heart-like-filled.svg" : "/icons/heart-like.svg"}
              size={20}
              className={liked && !prefersReducedMotion ? "bg-[#ef575f] animate-like-pop" : liked ? "bg-[#ef575f]" : undefined}
            />
            <span className="text-[11px] font-bold text-[#06090e]">{formatCount(likeCount)}</span>
          </button>

          <button type="button" onClick={onOpenComments} aria-label={`${formatCount(reel.comments)} comments`} className="flex flex-col items-center gap-1">
            <span className="relative block size-5">
              <Image src="/icons/message-03.svg" alt="" fill sizes="20px" />
            </span>
            <span className="text-[11px] font-bold text-[#06090e]">{formatCount(reel.comments)}</span>
          </button>

          <button type="button" onClick={handleShare} aria-label={`Share — ${formatCount(shareCount)} shares`} className="flex flex-col items-center gap-1">
            <span className="relative block size-5">
              <Image src="/icons/share-05.svg" alt="" fill sizes="20px" />
            </span>
            <span className="text-[11px] font-bold text-[#06090e]">{formatCount(shareCount)}</span>
          </button>

          <Link href={comingSoonHref("Repost")} aria-label={`${formatCount(reel.reposts)} reposts`} className="flex flex-col items-center gap-1 text-night-700">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M7 7h8a3 3 0 0 1 3 3v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M10 4 7 7l3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M17 17H9a3 3 0 0 1-3-3v-2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M14 20l3-3-3-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-[11px] font-bold text-[#06090e]">{formatCount(reel.reposts)}</span>
          </Link>

          <button type="button" onClick={() => setSaved((v) => !v)} aria-pressed={saved} aria-label={`${formatCount(saveCount)} saves`} className="flex flex-col items-center gap-1">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" className={saved ? "text-brand-600" : "text-night-700"}>
              <path
                d="M5 4.6C5 3.84575 5 3.46863 5.23431 3.23431C5.46863 3 5.84575 3 6.6 3H17.4C18.1542 3 18.5314 3 18.7657 3.23431C19 3.46863 19 3.84575 19 4.6V19.4454C19 20.1263 19 20.4667 18.783 20.5784C18.5661 20.69 18.289 20.4922 17.735 20.0964L12.93 16.6643C12.4809 16.3435 12.2564 16.1831 12 16.1831C11.7436 16.1831 11.5191 16.3435 11.07 16.6643L6.26499 20.0964C5.71095 20.4922 5.43393 20.69 5.21697 20.5784C5 20.4667 5 20.1263 5 19.4454V4.6Z"
                fill={saved ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="1.6"
              />
            </svg>
            <span className="text-[11px] font-bold text-[#06090e]">{formatCount(saveCount)}</span>
          </button>

          <div className="relative">
            <Tooltip label="More options" side="bottom" align="end">
              <button
                type="button"
                aria-label="More options"
                aria-haspopup="menu"
                aria-expanded={desktopOptionsOpen}
                onClick={() => setDesktopOptionsOpen((v) => !v)}
                className="flex size-5 items-center justify-center"
              >
                <span className="relative block size-5">
                  <Image src="/icons/more-horizontal.svg" alt="" fill sizes="20px" />
                </span>
              </button>
            </Tooltip>

            {desktopOptionsOpen && (
              <>
                <div className="fixed inset-0 z-20" onClick={() => setDesktopOptionsOpen(false)} />

                {/* Figma node 805:39305 — an outer frosted-glass card (barely-there
                    white tint, blurred) with the actual white content card nested
                    inside it, not a single flat panel. Anchored to the trigger
                    (its "righteous position"), not centered as a full-screen
                    dialog. */}
                <div className="absolute bottom-full left-0 z-30 mb-2 w-[230px] rounded-[22px] bg-white/10 p-2 shadow-[0px_12px_30px_rgba(0,0,0,0.2)] backdrop-blur-xl">
                  <div className="flex w-full flex-col gap-1 rounded-[16px] bg-white/90 p-2.5 backdrop-blur-sm">
                    <ReelOptionRow
                      icon={AUTO_SCROLL_ICON}
                      label="Auto-scroll"
                      toggle
                      selected={autoScroll}
                      onClick={() => onToggleAutoScroll?.()}
                    />
                    <ReelOptionRow
                      icon={INFO_ICON}
                      label="Why you're seeing this post"
                      locked
                      href={comingSoonHref("Why you're seeing this post")}
                      onClick={() => setDesktopOptionsOpen(false)}
                    />
                    <ReelOptionRow
                      icon={INTERESTED_ICON}
                      label="Interested"
                      selected={feedback === "interested"}
                      onClick={() => handleFeedback("interested")}
                    />
                    <ReelOptionRow
                      icon={NOT_INTERESTED_ICON}
                      label="Not Interested"
                      selected={feedback === "not-interested"}
                      onClick={() => handleFeedback("not-interested")}
                    />
                    <ReelOptionRow
                      icon={MANAGE_PREFERENCES_ICON}
                      label="Manage content preferences"
                      href={comingSoonHref("Manage content preferences")}
                      onClick={() => setDesktopOptionsOpen(false)}
                    />
                    <ReelOptionRow
                      icon={INFO_ICON}
                      label="Report"
                      danger
                      borderTop
                      href={comingSoonHref("Report")}
                      onClick={() => setDesktopOptionsOpen(false)}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
    </div>
  );
}
