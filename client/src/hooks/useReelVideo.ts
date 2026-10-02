"use client";

import { useEffect, useRef, useState } from "react";

interface UseReelVideoOptions {
  /** Whether the video should start playing on its own (false under reduced motion). */
  autoPlay: boolean;
  /** Changes whenever the card swaps which `<video>` node is mounted (mobile
   * vs desktop layout), so every listener re-attaches to the live element. */
  remountKey: unknown;
}

/** Owns everything about a reel's `<video>` element: playing state, mute,
 * progress and seeking.
 *
 * - `playing` mirrors the video's own `play`/`pause` events instead of being
 *   pushed one-way from React state, so a silently-rejected autoplay (common
 *   on mobile) or the browser pausing an off-screen video can never leave the
 *   button out of sync with what's actually happening.
 * - Mute is set on the DOM node directly: React's `muted` attribute only
 *   reliably sets the *initial* state, so a prop re-render doesn't always flip
 *   real audio output. Reels still start muted so autoplay isn't blocked. */
export function useReelVideo({ autoPlay, remountKey }: UseReelVideoOptions) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(autoPlay);
  const [muted, setMuted] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const syncPlaying = () => setPlaying(!video.paused);
    const updateProgress = () => {
      if (!video.duration) return;
      setProgress((video.currentTime / video.duration) * 100);
    };
    video.addEventListener("play", syncPlaying);
    video.addEventListener("pause", syncPlaying);
    video.addEventListener("timeupdate", updateProgress);
    video.addEventListener("loadedmetadata", updateProgress);
    syncPlaying();
    return () => {
      video.removeEventListener("play", syncPlaying);
      video.removeEventListener("pause", syncPlaying);
      video.removeEventListener("timeupdate", updateProgress);
      video.removeEventListener("loadedmetadata", updateProgress);
    };
  }, [remountKey]);

  useEffect(() => {
    const video = videoRef.current;
    if (video) video.muted = muted;
  }, [muted, remountKey]);

  function togglePlayback() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) video.play().catch(() => undefined);
    else video.pause();
  }

  function toggleMute() {
    setMuted((current) => !current);
  }

  function seekToRatio(ratio: number) {
    const video = videoRef.current;
    if (!video?.duration) return;
    const clamped = Math.min(1, Math.max(0, ratio));
    video.currentTime = clamped * video.duration;
    setProgress(clamped * 100);
  }

  function seekBySeconds(delta: number) {
    const video = videoRef.current;
    if (!video?.duration) return;
    video.currentTime = Math.min(video.duration, Math.max(0, video.currentTime + delta));
  }

  return { videoRef, playing, muted, progress, togglePlayback, toggleMute, seekToRatio, seekBySeconds };
}
