"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { NavIcon } from "@/components/shared/NavIcon";
import { RepostIcon, SaveIcon } from "@/components/shared/ReelIcons";
import { comingSoonHref } from "@/lib/coming-soon";
import { cn } from "@/lib/utils";

/** `overlay` sits on top of the video (mobile — white icons with a shadow);
 * `light` sits on the page background beside it (desktop — dark icons). */
export type ReelActionRailTone = "overlay" | "light";

interface ReelActionRailProps {
  tone: ReelActionRailTone;
  prefersReducedMotion: boolean;
  liked: boolean;
  likeCount: number;
  onToggleLike: () => void;
  commentCount: number;
  onOpenComments?: () => void;
  shareCount: number;
  onShare: () => void;
  repostCount: number;
  saved: boolean;
  saveCount: number;
  onToggleSave: () => void;
  /** Extra controls appended below the standard five (e.g. the desktop "more" menu). */
  children?: ReactNode;
}

const TONE = {
  overlay: {
    container: "flex shrink-0 flex-col items-center gap-[18px] pb-1",
    iconSize: 26,
    iconColor: "white",
    label: "text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.5)]",
    glyph: "text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]",
    savedGlyph: "text-brand-300 drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]",
  },
  // `clamp()` on the gap/padding keeps the bottom-grouped look at normal
  // heights while shrinking on short viewports instead of pushing the lower
  // icons below the video; `self-end` pins the column flush with its bottom edge.
  light: {
    container:
      "ml-[32px] flex flex-col items-center gap-[clamp(4px,2vh,16px)] self-end pb-[clamp(8px,4vh,38px)] justify-self-start",
    iconSize: 20,
    iconColor: "night",
    label: "text-reel-ink",
    glyph: "text-night-700",
    savedGlyph: "text-brand-600",
  },
} as const;

export function formatCount(value: number): string {
  if (value >= 1000) return `${Math.round(value / 100) / 10}k`.replace(".0k", "k");
  return String(value);
}

const BUTTON_CLASS = "flex flex-col items-center gap-1";

/** Like / comment / share / repost / save column — one component for both
 * the mobile overlay and the desktop side rail. */
export function ReelActionRail({
  tone,
  prefersReducedMotion,
  liked,
  likeCount,
  onToggleLike,
  commentCount,
  onOpenComments,
  shareCount,
  onShare,
  repostCount,
  saved,
  saveCount,
  onToggleSave,
  children,
}: ReelActionRailProps) {
  const t = TONE[tone];
  const label = (value: number) => <span className={cn("text-[11px] font-bold", t.label)}>{formatCount(value)}</span>;

  return (
    <div className={t.container}>
      <button type="button" onClick={onToggleLike} aria-pressed={liked} aria-label={`${formatCount(likeCount)} likes`} className={BUTTON_CLASS}>
        <NavIcon
          icon={liked ? "/icons/heart-like-filled.svg" : "/icons/heart-like.svg"}
          color={t.iconColor}
          size={t.iconSize}
          className={liked ? cn("bg-like", !prefersReducedMotion && "animate-like-pop") : undefined}
        />
        {label(likeCount)}
      </button>

      <button type="button" onClick={onOpenComments} aria-label={`${formatCount(commentCount)} comments`} className={BUTTON_CLASS}>
        <NavIcon icon="/icons/message-03.svg" color={t.iconColor} size={t.iconSize} />
        {label(commentCount)}
      </button>

      <button type="button" onClick={onShare} aria-label={`Share — ${formatCount(shareCount)} shares`} className={BUTTON_CLASS}>
        <NavIcon icon="/icons/share-05.svg" color={t.iconColor} size={t.iconSize} />
        {label(shareCount)}
      </button>

      <Link href={comingSoonHref("Repost")} aria-label={`${formatCount(repostCount)} reposts`} className={cn(BUTTON_CLASS, t.glyph)}>
        <RepostIcon size={t.iconSize} className={tone === "overlay" ? "drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]" : undefined} />
        {label(repostCount)}
      </Link>

      <button type="button" onClick={onToggleSave} aria-pressed={saved} aria-label={`${formatCount(saveCount)} saves`} className={BUTTON_CLASS}>
        <SaveIcon size={t.iconSize} saved={saved} className={saved ? t.savedGlyph : t.glyph} />
        {label(saveCount)}
      </button>

      {children}
    </div>
  );
}
