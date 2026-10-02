"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { useAnimatedSheet } from "@/hooks/useAnimatedSheet";
import { comingSoonHref } from "@/lib/coming-soon";
import { cn } from "@/lib/utils";
import type { ReelFeedback } from "@/types/reel";

const ICON_PROPS = { width: 14, height: 14, viewBox: "0 0 24 24", fill: "none", "aria-hidden": true } as const;

const AUTO_SCROLL_ICON = (
  <svg {...ICON_PROPS}>
    <path d="M12 4v16M7 8l5-5 5 5M7 16l5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const INFO_ICON = (
  <svg {...ICON_PROPS}>
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
    <path d="M12 8v5M12 16h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);
const INTERESTED_ICON = (
  <svg {...ICON_PROPS}>
    <path d="M2 12s3.5-6.5 10-6.5S22 12 22 12s-3.5 6.5-10 6.5S2 12 2 12Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);
const NOT_INTERESTED_ICON = (
  <svg {...ICON_PROPS}>
    <path
      d="M3 5l18 14M2 12s3.5-6.5 10-6.5c1.9 0 3.5.4 4.8 1M22 12s-1.1 2.05-3.2 3.7M9.5 14.6a2.5 2.5 0 0 0 3.4 1"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
const MANAGE_PREFERENCES_ICON = (
  <svg {...ICON_PROPS}>
    <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.8" />
    <path d="M2 20c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="17" cy="7" r="2.2" stroke="currentColor" strokeWidth="1.8" />
    <path d="M14.5 14.3c2.6.4 4.5 2.3 4.5 5.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

function LockIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0 text-gray-400">
      <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0 text-brand-900">
      <path d="M4 12l6 6L20 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ToggleSwitch({ on }: { on: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn("flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 transition-colors", on ? "bg-brand-900" : "bg-gray-300")}
    >
      <span className={cn("size-4 rounded-full bg-white shadow transition-transform", on && "translate-x-4")} />
    </span>
  );
}

interface ReelOptionRowProps {
  icon: ReactNode;
  label: string;
  locked?: boolean;
  selected?: boolean;
  danger?: boolean;
  borderTop?: boolean;
  /** Renders a real on/off switch instead of the plain checkmark — for
   * settings like Auto-scroll that flip a persistent state rather than
   * recording a one-off choice. */
  toggle?: boolean;
  href?: string;
  onClick?: () => void;
}

/** One row of the "Reel options" menu (Figma node 805:39305). */
function ReelOptionRow({ icon, label, locked, selected, danger, borderTop, toggle, href, onClick }: ReelOptionRowProps) {
  const rowClassName = cn(
    "flex w-full items-center justify-between rounded-[10px] px-3 py-2 text-left text-[13px] font-medium",
    danger ? "text-danger hover:bg-red-50" : "text-night-700 hover:bg-gray-50",
    selected && !danger && !toggle && "bg-brand-900/5 text-brand-900",
    borderTop && "mt-1 border-t border-gray-200 pt-3",
  );
  const content = (
    <>
      <span className="flex items-center gap-3">
        {icon}
        {label}
      </span>
      {toggle ? <ToggleSwitch on={!!selected} /> : locked ? <LockIcon /> : selected ? <CheckIcon /> : null}
    </>
  );

  if (href) {
    return (
      <Link href={href} onClick={onClick} className={rowClassName}>
        {content}
      </Link>
    );
  }
  return (
    <button
      type="button"
      onClick={onClick}
      role={toggle ? "switch" : undefined}
      aria-checked={toggle ? selected : undefined}
      className={rowClassName}
    >
      {content}
    </button>
  );
}

interface ReelOptionsProps {
  autoScroll?: boolean;
  onToggleAutoScroll?: () => void;
  feedback: ReelFeedback | null;
  onChooseFeedback: (feedback: ReelFeedback) => void;
  /** Closes whichever surface (sheet/popover) is showing the list. */
  onClose: () => void;
}

/** The six option rows, defined once and rendered by both the mobile sheet
 * and the desktop popover so they can't drift apart. */
function ReelOptionsList({ autoScroll, onToggleAutoScroll, feedback, onChooseFeedback, onClose }: ReelOptionsProps) {
  return (
    <>
      <ReelOptionRow icon={AUTO_SCROLL_ICON} label="Auto-scroll" toggle selected={autoScroll} onClick={() => onToggleAutoScroll?.()} />
      <ReelOptionRow
        icon={INFO_ICON}
        label="Why you're seeing this post"
        locked
        href={comingSoonHref("Why you're seeing this post")}
        onClick={onClose}
      />
      <ReelOptionRow
        icon={INTERESTED_ICON}
        label="Interested"
        selected={feedback === "interested"}
        onClick={() => {
          onChooseFeedback("interested");
          onClose();
        }}
      />
      <ReelOptionRow
        icon={NOT_INTERESTED_ICON}
        label="Not Interested"
        selected={feedback === "not-interested"}
        onClick={() => {
          onChooseFeedback("not-interested");
          onClose();
        }}
      />
      <ReelOptionRow
        icon={MANAGE_PREFERENCES_ICON}
        label="Manage content preferences"
        href={comingSoonHref("Manage content preferences")}
        onClick={onClose}
      />
      <ReelOptionRow icon={INFO_ICON} label="Report" danger borderTop href={comingSoonHref("Report")} onClick={onClose} />
    </>
  );
}

/** Mobile: bottom sheet matching the app's other sheets (slide up/down, drag handle). */
export function ReelOptionsSheet({ open, ...listProps }: ReelOptionsProps & { open: boolean }) {
  const { mounted, closing } = useAnimatedSheet(open);
  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[120] flex items-end bg-black/50"
      onClick={listProps.onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Reel options"
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className={cn(
          "flex w-full flex-col gap-4 rounded-t-[32px] bg-white pb-6 pt-4 shadow-[0px_-4px_8px_0px_rgba(69,71,69,0.15)]",
          closing ? "animate-sheet-slide-down" : "animate-sheet-slide-up",
        )}
      >
        <div className="h-[3px] w-[152px] shrink-0 self-center rounded-[20px] bg-night-700" />

        <div className="flex w-full shrink-0 items-center gap-2.5 px-6">
          <button
            type="button"
            aria-label="Close"
            onClick={listProps.onClose}
            className="flex size-6 shrink-0 items-center justify-center text-night-900"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M10 4V16M10 16L4 10M10 16L16 10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <p className="flex-1 text-center text-lg font-bold tracking-[-0.54px] text-black">Reel options</p>
          <span className="size-6 shrink-0" aria-hidden />
        </div>

        <div className="flex flex-col gap-1 px-4">
          <ReelOptionsList {...listProps} />
        </div>
      </div>
    </div>,
    document.body,
  );
}

/** Desktop: popover anchored above its trigger (render inside a `relative`
 * wrapper) — an outer frosted-glass card with the white content card nested
 * inside, per Figma, rather than a centered dialog. */
export function ReelOptionsPopover(props: ReelOptionsProps) {
  return (
    <>
      <div className="fixed inset-0 z-20" onClick={props.onClose} />
      <div className="absolute bottom-full left-0 z-30 mb-2 w-[230px] rounded-[22px] bg-white/10 p-2 shadow-[0px_12px_30px_rgba(0,0,0,0.2)] backdrop-blur-xl">
        <div className="flex w-full flex-col gap-1 rounded-[16px] bg-white/90 p-2.5 backdrop-blur-sm">
          <ReelOptionsList {...props} />
        </div>
      </div>
    </>
  );
}
