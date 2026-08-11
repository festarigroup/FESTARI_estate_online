"use client";

import { createContext, useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { DynamicIcon, type IconName } from "@/components/ui/DynamicIcon";
import { cn } from "@/lib/cn";

const PANEL_WIDTH = 240;

const CloseContext = createContext<() => void>(() => {});

/** Lets a DropdownItem close its own menu after running its action, without
 * every caller having to wire that up by hand. */
export function useDropdownClose() {
  return useContext(CloseContext);
}

interface DropdownProps {
  trigger: (bind: { onClick: () => void; "aria-expanded": boolean }) => React.ReactNode;
  children: React.ReactNode;
  align?: "left" | "right";
  /** Size the panel to the trigger's own measured width instead of the
   * fixed default — for a full-width form field styled as an input (e.g.
   * register's role picker), a fixed 240px panel would look narrower than
   * the field it drops from. Every other caller here is a narrow pill
   * trigger, where the fixed width is the right call. */
  matchTriggerWidth?: boolean;
}

/**
 * Small anchored menu (not a Figma component — no dropdown frames were
 * provided). Portals to `document.body` and positions itself from the
 * trigger's real screen coordinates rather than relying on CSS
 * `position: absolute` inside the card: several post cards set
 * `overflow-hidden` for their rounded corners, which would otherwise clip
 * the menu — the same class of bug `Modal`'s portal already guards
 * against, just via a different CSS mechanism (`overflow` here vs.
 * `filter`/`transform` there).
 */
export function Dropdown({ trigger, children, align = "right", matchTriggerWidth = false }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: PANEL_WIDTH });
  const anchorRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Measuring the trigger happens here, as an effect that runs once `open`
  // is already true — not inside the click handler itself, which would
  // mean a render-prop-supplied closure reading a ref mid-render (flagged
  // by react-hooks/refs, and rightly so: `trigger` is caller-supplied, so
  // nothing here can prove `onClick` isn't invoked synchronously).
  useLayoutEffect(() => {
    if (!open) return;
    const rect = anchorRef.current?.getBoundingClientRect();
    if (rect) {
      const width = matchTriggerWidth ? rect.width : PANEL_WIDTH;
      setCoords({
        top: rect.bottom + 8,
        left: align === "right" ? rect.right - width : rect.left,
        width,
      });
    }
  }, [open, align, matchTriggerWidth]);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(e: MouseEvent) {
      const target = e.target as Node;
      if (anchorRef.current?.contains(target) || panelRef.current?.contains(target)) return;
      setOpen(false);
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    // Scrolling anywhere invalidates the coordinates captured at open time
    // (this is `position: fixed`, not re-measured on scroll) — closing
    // rather than drifting is the simpler, still-correct choice here.
    function handleScroll() {
      setOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("scroll", handleScroll, true);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [open]);

  return (
    <div ref={anchorRef} className="inline-block">
      {trigger({ onClick: () => setOpen((v) => !v), "aria-expanded": open })}
      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={panelRef}
            role="menu"
            style={{ position: "fixed", top: coords.top, left: coords.left, width: coords.width }}
            className="z-[70] overflow-hidden rounded-xl border border-border-subtle bg-white py-2 shadow-xl"
          >
            <CloseContext.Provider value={() => setOpen(false)}>{children}</CloseContext.Provider>
          </div>,
          document.body,
        )}
    </div>
  );
}

interface DropdownItemProps {
  /** Omit for a plain text option (e.g. a filter's list of choices) —
   * every existing caller passes one (an action's own icon), but that's
   * not universal enough to require. */
  icon?: IconName;
  label: string;
  onClick: () => void;
  className?: string;
}

/** One row inside a Dropdown — runs its action, then closes the menu. */
export function DropdownItem({ icon, label, onClick, className }: DropdownItemProps) {
  const close = useDropdownClose();

  return (
    <button
      role="menuitem"
      onClick={() => {
        onClick();
        close();
      }}
      className={cn(
        "flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-medium text-ink hover:bg-surface-muted",
        className,
      )}
    >
      {icon && <DynamicIcon name={icon} className="size-4 text-muted" />}
      {label}
    </button>
  );
}
