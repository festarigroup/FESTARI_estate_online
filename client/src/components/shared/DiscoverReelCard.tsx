"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { FollowButton } from "@/components/shared/FollowButton";
import { NavIcon } from "@/components/shared/NavIcon";
import { Tooltip } from "@/components/shared/Tooltip";
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
}

function formatCount(value: number): string {
  if (value >= 1000) return `${Math.round(value / 100) / 10}k`.replace(".0k", "k");
  return String(value);
}

export function DiscoverReelCard({ reel, className, onOpenComments, onOpenPostComposer }: DiscoverReelCardProps) {
  // JS-driven, not CSS `xl:hidden`/`hidden xl:grid` — the two layouts below
  // each embed their own <video>, and CSS-only dual-mounting would create
  // two real <video> elements sharing one ref/one autoplay cycle at once
  // (wasted bandwidth, and the ref would only ever control one of them).
  // Defaults to the desktop layout during SSR/first paint (this hook's
  // server snapshot is always `false`), correcting after mount.
  const isMobile = useMediaQuery("(max-width: 1279px)");
  const prefersReducedMotion = usePrefersReducedMotion();
  const [playing, setPlaying] = useState(!prefersReducedMotion);
  const [following, setFollowing] = useState(reel.following);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [shareCount, setShareCount] = useState(reel.shares);
  const videoRef = useRef<HTMLVideoElement>(null);

  function handleShare() {
    shareContent({
      title: `${reel.authorName}'s reel`,
      text: reel.caption.replace(" (More)", ""),
      path: `#reel-${reel.id}`,
    });
    setShareCount((count) => count + 1);
  }

  // Drives the actual <video> element from the `playing` state the
  // play/pause button toggles — a plain state flag doesn't control media
  // playback on its own, it has to be applied imperatively.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (playing) video.play().catch(() => undefined);
    else video.pause();
  }, [playing]);

  // Drives the gradient bar at the bottom of the card as a real playback
  // tracker instead of a static decoration.
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
  }, []);

  function seek(event: MouseEvent<HTMLDivElement>) {
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
      loop
      muted
      playsInline
      className="absolute inset-0 size-full object-cover"
    />
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
    <Tooltip label={playing ? "Pause" : "Play"} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      <button
        type="button"
        onClick={() => setPlaying((v) => !v)}
        aria-pressed={playing}
        className="flex size-14 items-center justify-center rounded-full bg-white/70 backdrop-blur-sm transition-opacity hover:bg-white/90"
      >
        {playing ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="6" y="4" width="4" height="16" rx="1" fill="#06090e" />
            <rect x="14" y="4" width="4" height="16" rx="1" fill="#06090e" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M7 4.5v15l13-7.5-13-7.5Z" fill="#06090e" />
          </svg>
        )}
      </button>
    </Tooltip>
  );

  const postButton = (
    <button
      type="button"
      onClick={onOpenPostComposer}
      aria-label="Post a reel"
      className="absolute left-3 top-3 flex size-7 items-center justify-center rounded-full bg-brand-900 text-white shadow-md transition-transform hover:scale-105"
    >
      <span className="text-[16px] leading-none">+</span>
    </button>
  );

  if (isMobile) {
    // Full-screen, TikTok-style takeover — video fills the remaining
    // viewport below the pinned navbar/story bar, with the caption and
    // action rail overlaid directly on it instead of in separate columns.
    return (
      <div className={cn("relative h-[calc(100dvh-140px)] w-full overflow-hidden bg-black", className)}>
        {videoEl}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent" />
        {progressBar}
        {postButton}
        {playButton}

        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 pb-6">
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
            <button type="button" onClick={() => setLiked((v) => !v)} aria-pressed={liked} aria-label={`${formatCount(likeCount)} likes`} className="flex flex-col items-center gap-1">
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

            <Link href={comingSoonHref("Reel Options")} aria-label="More options" className="flex size-[26px] items-center justify-center">
              <NavIcon icon="/icons/more-horizontal.svg" color="white" size={26} className="rotate-90" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Desktop: author/caption, video and the action rail as three separate
  // columns (Figma's layout), symmetrically centered — see the grid-column
  // comment below.
  return (
    <div className={cn("grid w-full grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] gap-[32px]", className)}>
        {/* `justify-end` pins the author/caption block to the bottom of the
            row so it lines up with the video's bottom edge, matching the
            Figma design — the grid row's height is driven by the video
            column (see below), and this column stretches to match it. */}
        <div className="flex w-[293px] flex-col items-start justify-end gap-[8px] justify-self-end">
          <div className="flex w-full items-center gap-[6px]">
            <div className="flex items-center gap-2">
              <div className="relative size-[40px] shrink-0 overflow-hidden rounded-full">
                <Image src={reel.authorAvatar} alt="" fill sizes="40px" className="object-cover" />
                {reel.verified && (
                  <span className="absolute bottom-[-2px] right-[-2px] flex size-4 items-center justify-center rounded-full border-2 border-white bg-brand-600">
                    <span className="block size-1.5 rounded-full bg-white" />
                  </span>
                )}
              </div>
              <p className="whitespace-nowrap text-[14px] font-bold text-brand-900">{reel.authorName}</p>
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

        {/* Height-driven, not width-driven: caps at the design's native 716px
            but shrinks on shorter viewports (via the topNav+padding offset)
            so one reel always fits on screen without vertical scrolling;
            width (and the grid row height other columns stretch to) follows
            from the 402:716 aspect ratio. */}
        <div className="relative aspect-[402/716] h-[min(716px,calc(100vh-130px))] w-auto max-w-[402px] shrink-0 overflow-hidden rounded-[30px] bg-gray-100">
          {videoEl}
          <div className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-[#5433ff] to-[#20bdff]" />
          {progressBar}
          {postButton}
          {playButton}
        </div>

        <div className="flex shrink-0 flex-col items-center justify-center gap-[16px] pb-[38px] justify-self-start">
          <button type="button" onClick={() => setLiked((v) => !v)} aria-pressed={liked} aria-label={`${formatCount(likeCount)} likes`} className="flex flex-col items-center gap-1">
            <NavIcon
              icon={liked ? "/icons/heart-like-filled.svg" : "/icons/heart-like.svg"}
              size={24}
              className={liked && !prefersReducedMotion ? "bg-[#ef575f] animate-like-pop" : liked ? "bg-[#ef575f]" : undefined}
            />
            <span className="text-[12px] font-bold text-[#06090e]">{formatCount(likeCount)}</span>
          </button>

          <button type="button" onClick={onOpenComments} aria-label={`${formatCount(reel.comments)} comments`} className="flex flex-col items-center gap-1">
            <span className="relative block size-6">
              <Image src="/icons/message-03.svg" alt="" fill sizes="24px" />
            </span>
            <span className="text-[12px] font-bold text-[#06090e]">{formatCount(reel.comments)}</span>
          </button>

          <button type="button" onClick={handleShare} aria-label={`Share — ${formatCount(shareCount)} shares`} className="flex flex-col items-center gap-1">
            <span className="relative block size-6">
              <Image src="/icons/share-05.svg" alt="" fill sizes="24px" />
            </span>
            <span className="text-[12px] font-bold text-[#06090e]">{formatCount(shareCount)}</span>
          </button>

          <Link href={comingSoonHref("Repost")} aria-label={`${formatCount(reel.reposts)} reposts`} className="flex flex-col items-center gap-1 text-night-700">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M7 7h8a3 3 0 0 1 3 3v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M10 4 7 7l3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M17 17H9a3 3 0 0 1-3-3v-2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M14 20l3-3-3-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-[12px] font-bold text-[#06090e]">{formatCount(reel.reposts)}</span>
          </Link>

          <button type="button" onClick={() => setSaved((v) => !v)} aria-pressed={saved} aria-label={`${formatCount(saveCount)} saves`} className="flex flex-col items-center gap-1">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" className={saved ? "text-brand-600" : "text-night-700"}>
              <path
                d="M5 4.6C5 3.84575 5 3.46863 5.23431 3.23431C5.46863 3 5.84575 3 6.6 3H17.4C18.1542 3 18.5314 3 18.7657 3.23431C19 3.46863 19 3.84575 19 4.6V19.4454C19 20.1263 19 20.4667 18.783 20.5784C18.5661 20.69 18.289 20.4922 17.735 20.0964L12.93 16.6643C12.4809 16.3435 12.2564 16.1831 12 16.1831C11.7436 16.1831 11.5191 16.3435 11.07 16.6643L6.26499 20.0964C5.71095 20.4922 5.43393 20.69 5.21697 20.5784C5 20.4667 5 20.1263 5 19.4454V4.6Z"
                fill={saved ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="1.6"
              />
            </svg>
            <span className="text-[12px] font-bold text-[#06090e]">{formatCount(saveCount)}</span>
          </button>

          <Tooltip label="More options" side="bottom" align="end">
            <Link href={comingSoonHref("Reel Options")} aria-label="More options" className="flex size-6 items-center justify-center">
              <span className="relative block size-6 rotate-90">
                <Image src="/icons/more-horizontal.svg" alt="" fill sizes="24px" />
              </span>
            </Link>
          </Tooltip>
        </div>
    </div>
  );
}
