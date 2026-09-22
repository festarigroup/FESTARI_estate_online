"use client";

import { cn } from "@/lib/utils";

interface FollowButtonProps {
  following: boolean;
  onToggle: () => void;
  name?: string;
  className?: string;
}

/** The standard "Follow"/"Following" pill (Figma node 298:3159), reused
 * anywhere a follow action appears (Who to Follow card, post headers, ...). */
export function FollowButton({ following, onToggle, name, className }: FollowButtonProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={following}
      aria-label={following ? `Following${name ? ` ${name}` : ""}` : `Follow${name ? ` ${name}` : ""}`}
      className={cn(
        "flex h-[23px] w-[67px] shrink-0 items-center justify-center rounded-lg border text-[11px] transition-colors",
        following
          ? "border-brand-900 bg-brand-900 text-white hover:bg-brand-900/90"
          : "border-brand-900 bg-white text-brand-900 hover:bg-brand-900/5",
        className,
      )}
    >
      {following ? "Following" : "Follow"}
    </button>
  );
}
