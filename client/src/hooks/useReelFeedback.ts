"use client";

import { useState } from "react";
import { showSuccessToast } from "@/components/shared/AppToast";
import type { ReelFeedback } from "@/types/reel";

/** "Interested" / "Not Interested" — mutually exclusive, and a second click
 * on the same choice clears it. A toast confirms the choice since nothing else
 * visibly changes (the feed itself doesn't re-rank yet). */
export function useReelFeedback() {
  const [feedback, setFeedback] = useState<ReelFeedback | null>(null);

  function choose(next: ReelFeedback) {
    const nextValue = feedback === next ? null : next;
    setFeedback(nextValue);
    if (nextValue === "interested") showSuccessToast("Thanks — we'll show you more like this");
    else if (nextValue === "not-interested") showSuccessToast("Got it — we'll show you less like this");
  }

  return { feedback, choose };
}
