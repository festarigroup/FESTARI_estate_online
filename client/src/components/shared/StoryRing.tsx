import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StoryRingProps {
  /** Has a story to view — shows the brand gradient ring (Figma node 615:73660).
   * Otherwise a flat gray ring with the avatar directly inside (the "add to
   * your story" empty state). */
  active: boolean;
  /** Sets the ring's overall size, e.g. `size-14`. */
  className?: string;
  children: ReactNode;
}

/** The circular ring around every story avatar — one gradient definition
 * (`reel-from` → `reel-to`, left to right) for the home rail, Discover's rail
 * and every other story surface, instead of each rebuilding it. */
export function StoryRing({ active, className, children }: StoryRingProps) {
  return (
    <span
      className={cn(
        "relative flex shrink-0 items-center justify-center rounded-full p-0.5",
        active ? "bg-gradient-to-r from-reel-from to-reel-to" : "bg-gray-200",
        className,
      )}
    >
      <span
        className={cn("relative block size-full overflow-hidden rounded-full", active && "border-2 border-white bg-white")}
      >
        {children}
      </span>
    </span>
  );
}
