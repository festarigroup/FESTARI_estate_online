"use client";

import { useEffect, useState } from "react";

/** Keeps a bottom sheet mounted for the duration of its close animation
 * instead of vanishing the instant `open` flips to false. Pair the returned
 * `closing` flag with an exit keyframe (e.g. animate-sheet-slide-down) and
 * gate rendering on `mounted` rather than `open`. */
export function useAnimatedSheet(open: boolean, durationMs = 250) {
  const [mounted, setMounted] = useState(open);
  const [closing, setClosing] = useState(false);

  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setMounted(true);
      setClosing(false);
    } else {
      setClosing(true);
    }
  }

  useEffect(() => {
    if (!closing) return;
    const timeout = setTimeout(() => setMounted(false), durationMs);
    return () => clearTimeout(timeout);
  }, [closing, durationMs]);

  return { mounted, closing };
}
