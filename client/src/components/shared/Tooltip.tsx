import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TooltipProps {
  label: string;
  children: ReactNode;
  className?: string;
  side?: "top" | "bottom";
  /** Horizontal anchor relative to the trigger. Use "start" near a container's
   * left edge (e.g. the first icon in a row) so the label can't overflow off
   * the edge of a narrow modal/viewport when centered would. */
  align?: "center" | "start" | "end";
}

const ALIGN_CLASS: Record<NonNullable<TooltipProps["align"]>, string> = {
  center: "left-1/2 -translate-x-1/2",
  start: "left-0",
  end: "right-0",
};

/** Wraps an icon-only control with a hover/focus label, since a bare icon's
 * meaning isn't always obvious. Mostly CSS-driven, but a click/tap leaves the
 * control focused (no mouseleave follows a tap), which would otherwise pin
 * the tooltip open via :focus-within until something else is clicked — so a
 * click blurs it immediately once the click has been handled. */
export function Tooltip({ label, children, className, side = "top", align = "center" }: TooltipProps) {
  return (
    <span
      className={cn("group/tooltip relative inline-flex", className)}
      onClickCapture={(event) => {
        const target = event.target as HTMLElement;
        window.setTimeout(() => target.blur(), 0);
      }}
    >
      {children}
      <span
        role="tooltip"
        className={cn(
          "pointer-events-none absolute z-50 max-w-[min(200px,90vw)] whitespace-nowrap rounded-lg bg-night-900 px-2.5 py-1.5 text-[11px] font-medium text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover/tooltip:opacity-100 group-focus-within/tooltip:opacity-100",
          side === "top" ? "bottom-full mb-2" : "top-full mt-2",
          ALIGN_CLASS[align],
        )}
      >
        {label}
      </span>
    </span>
  );
}
