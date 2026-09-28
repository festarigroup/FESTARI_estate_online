"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";

/** App-wide bar that shows whenever the browser loses its network connection. */
export function OfflineBanner() {
  const online = useOnlineStatus();
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <AnimatePresence>
      {!online && (
        <motion.div
          role="status"
          initial={prefersReducedMotion ? false : { height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={prefersReducedMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="shrink-0 overflow-hidden bg-amber-50"
        >
          <div className="flex w-full items-center justify-center gap-2 border-b border-amber-200 px-4 py-2 text-[12px] font-medium text-amber-800">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0">
              <path
                d="M2 2l20 20M8.5 16.5a5 5 0 0 1 6.36-.67M5 12.5a10 10 0 0 1 3.35-2.3M12 20h.01M19 12.5a9.97 9.97 0 0 0-1.64-1.9M15.5 8.14A10 10 0 0 0 3.5 9.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            No internet connection — showing what&rsquo;s already loaded.
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
