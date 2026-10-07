"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const SCROLL_STEP_RATIO = 0.8;

/** Drives an arrow button for a horizontally scrolling rail (e.g. the home
 * Stories row): each press slides the rail by most of its visible width to
 * pull the next items into view, and once the end is reached the same button
 * (see `atEnd`, for flipping its arrow) slides back to the start. `canScroll`
 * is false while everything already fits, so the button can be hidden. */
export function useScrollRail<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [{ canScroll, atEnd }, setState] = useState({ canScroll: false, atEnd: false });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const next = {
        canScroll: el.scrollWidth > el.clientWidth + 1,
        atEnd: el.scrollLeft + el.clientWidth >= el.scrollWidth - 1,
      };
      setState((current) => (current.canScroll === next.canScroll && current.atEnd === next.atEnd ? current : next));
    };
    // ResizeObserver also fires once on observe, which gives the initial measurement.
    const observer = new ResizeObserver(update);
    observer.observe(el);
    el.addEventListener("scroll", update, { passive: true });
    return () => {
      observer.disconnect();
      el.removeEventListener("scroll", update);
    };
  }, []);

  function scroll() {
    const el = ref.current;
    if (!el) return;
    const behavior = prefersReducedMotion ? "auto" : "smooth";
    if (atEnd) el.scrollTo({ left: 0, behavior });
    else el.scrollBy({ left: el.clientWidth * SCROLL_STEP_RATIO, behavior });
  }

  return { ref, canScroll, atEnd, scroll };
}
