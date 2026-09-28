"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

interface NewPostsPillProps {
  count: number;
  onReveal: () => void;
}

/** Sticky pill that surfaces above the feed once new posts have arrived, letting the user pull them in on demand. */
export function NewPostsPill({ count, onReveal }: NewPostsPillProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="sticky top-0 z-10 flex w-full justify-center pb-[15px]"
        >
          <button
            type="button"
            onClick={onReveal}
            className="flex items-center gap-1.5 rounded-full bg-brand-900 px-4 py-2 text-[12px] font-semibold text-white shadow-lg shadow-brand-900/20 hover:bg-brand-900/90"
          >
            <svg viewBox="0 0 16 16" fill="none" className="size-3.5 shrink-0">
              <path
                d="M8 12.5V3.5M8 3.5L3.5 8M8 3.5L12.5 8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {count} new post{count === 1 ? "" : "s"}
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
