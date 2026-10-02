"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { MouseEvent } from "react";
import { HeartGlyph, PauseGlyph, PlayGlyph, PlusIcon, SpeakerIcon } from "@/components/shared/ReelIcons";
import { Tooltip } from "@/components/shared/Tooltip";
import type { LikeParticle } from "@/hooks/useLikeBurst";
import { cn } from "@/lib/utils";

// Every control below stops its own click from bubbling: the surrounding
// container (mobile: the whole screen; desktop: the video column) toggles
// playback on tap, so a stray bubble would also pause/resume the video.

export function ReelMuteButton({ muted, onToggle }: { muted: boolean; onToggle: () => void }) {
  const label = muted ? "Unmute" : "Mute";
  return (
    <Tooltip label={label} className="absolute right-3 top-16 z-20 xl:top-3">
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onToggle();
        }}
        aria-pressed={!muted}
        aria-label={label}
        className="flex size-7 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-sm"
      >
        <SpeakerIcon muted={muted} />
      </button>
    </Tooltip>
  );
}

export function ReelPlayButton({ playing, onToggle }: { playing: boolean; onToggle: () => void }) {
  const label = playing ? "Pause" : "Play";
  return (
    <Tooltip label={label} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onToggle();
        }}
        aria-pressed={playing}
        aria-label={label}
        className="flex items-center justify-center"
      >
        {playing ? <PauseGlyph /> : <PlayGlyph />}
      </button>
    </Tooltip>
  );
}

interface ReelProgressBarProps {
  progress: number;
  onSeekToRatio: (ratio: number) => void;
  onSeekBySeconds: (delta: number) => void;
}

export function ReelProgressBar({ progress, onSeekToRatio, onSeekBySeconds }: ReelProgressBarProps) {
  function handleClick(event: MouseEvent<HTMLDivElement>) {
    event.stopPropagation();
    const rect = event.currentTarget.getBoundingClientRect();
    onSeekToRatio((event.clientX - rect.left) / rect.width);
  }

  return (
    <div
      role="slider"
      aria-label="Video progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress)}
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") onSeekBySeconds(5);
        else if (event.key === "ArrowLeft") onSeekBySeconds(-5);
      }}
      className="absolute inset-x-0 bottom-0 h-2 cursor-pointer bg-white/25"
    >
      <div className="h-full bg-gradient-to-r from-reel-from to-reel-to" style={{ width: `${progress}%` }} />
    </div>
  );
}

export function ReelLikeBurst({
  particles,
  onParticleDone,
}: {
  particles: LikeParticle[];
  onParticleDone: (id: number) => void;
}) {
  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{ opacity: 0, x: particle.x, y: 0, scale: particle.scale * 0.4, rotate: particle.rotate }}
            animate={{ opacity: [0, 1, 1, 0], y: -260, scale: particle.scale }}
            transition={{ duration: 2, delay: particle.delay, ease: "easeOut", times: [0, 0.12, 0.7, 1] }}
            onAnimationComplete={() => onParticleDone(particle.id)}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <HeartGlyph />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/** The gradient "+" that opens the Post-a-Reel composer. Positioning/size are
 * the caller's — absolute top-left on the desktop video, inline in the mobile header. */
export function ReelPostButton({
  onClick,
  className,
  iconSize,
}: {
  onClick?: () => void;
  className?: string;
  iconSize?: number;
}) {
  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        onClick?.();
      }}
      aria-label="Post a reel"
      className={cn(
        "flex items-center justify-center rounded-[16px] bg-gradient-to-r from-reel-from to-reel-to shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]",
        className,
      )}
    >
      <PlusIcon size={iconSize} />
    </button>
  );
}
