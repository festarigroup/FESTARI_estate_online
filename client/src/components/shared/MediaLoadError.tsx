"use client";

import { cn } from "@/lib/utils";

interface MediaLoadErrorProps {
  onRetry: () => void;
  className?: string;
}

/** Shown in place of post media that failed to load (dropped connection, dead CDN link, etc). */
export function MediaLoadError({ onRetry, className }: MediaLoadErrorProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-1.5 bg-gray-100 text-gray-400",
        className,
      )}
    >
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M4 16.5V6a2 2 0 0 1 2-2h9M20 8v10a2 2 0 0 1-2 2H6M2 2l20 20M9.5 9.5a2 2 0 1 0 2.83 2.83"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <p className="text-[11px] font-medium">Couldn&rsquo;t load image</p>
      <button type="button" onClick={onRetry} className="text-[11px] font-bold text-brand-900 underline">
        Retry
      </button>
    </div>
  );
}
