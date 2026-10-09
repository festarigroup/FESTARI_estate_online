import type { RefObject } from "react";
import { NavIcon } from "@/components/shared/NavIcon";
import { cn } from "@/lib/utils";

export interface VisibilityRowProps {
  icon?: string;
  label: string;
  selected: boolean;
  onClick: () => void;
  buttonRef?: RefObject<HTMLButtonElement | null>;
  /** Community/Organization rows open a side list rather than choosing directly. */
  hasSubmenu?: boolean;
  expanded?: boolean;
  /** Red text and icon for destructive actions such as Log out. */
  destructive?: boolean;
}

/** One option in the desktop "Who can view?" panel and its Community/Organization lists (Figma node 927:17826). */
export function VisibilityRow({ icon, label, selected, onClick, buttonRef, hasSubmenu, expanded, destructive }: VisibilityRowProps) {
  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={onClick}
      aria-expanded={hasSubmenu ? expanded : undefined}
      className={cn(
        "flex w-full items-center justify-between gap-3 rounded-xl border px-3 py-2 hover:bg-[#f8fafc]",
        selected ? "border-[#e2e8f0]/60 bg-[#f8fafc]" : "border-transparent",
      )}
    >
      <span className="flex min-w-0 items-center gap-3">
        {icon && (
        <span className="flex size-3.5 shrink-0 items-center justify-center">
          <NavIcon icon={icon} color="night" size={13} className={destructive ? "bg-[#ff3135]" : undefined} />
        </span>
        )}
        <span className={cn("truncate text-[13.5px] leading-[20.25px] tracking-[-0.337px]", destructive ? "text-[#ff3135]" : "text-[#334155]")}>{label}</span>
      </span>
      {selected ? (
        <NavIcon icon="/icons/visibility-tick-check.svg" color="brand" size={16} className="shrink-0 bg-[#1465e6]" />
      ) : hasSubmenu ? (
        <NavIcon icon="/icons/visibility-chevron-outline-right.svg" color="night" size={10} className="shrink-0" />
      ) : null}
    </button>
  );
}
