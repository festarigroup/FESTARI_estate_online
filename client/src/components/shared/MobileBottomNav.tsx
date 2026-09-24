"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { MobileNavGrid } from "@/components/shared/MobileNavGrid";

interface MobileBottomNavProps {
  activeKey?: string;
  activeChildKey?: string;
}

/** A single floating menu button that expands into a grid of every nav
 * category's sub-items (see MobileNavGrid) — replaces the old per-category
 * icon bar on mobile. */
export function MobileBottomNav({ activeKey = "feed", activeChildKey = "home" }: MobileBottomNavProps) {
  const [visible, setVisible] = useState(true);
  const hideTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(false);
      setOpen(false);
      if (hideTimeout.current) clearTimeout(hideTimeout.current);
      hideTimeout.current = setTimeout(() => setVisible(true), 600);
    };
    // The feed scrolls inside AppShell's own overflow-y-auto container, not
    // the window — `scroll` events don't bubble, but they still reach an
    // ancestor listener registered on the capture phase, so this catches
    // scrolling from that nested container too.
    window.addEventListener("scroll", handleScroll, true);
    return () => {
      window.removeEventListener("scroll", handleScroll, true);
      if (hideTimeout.current) clearTimeout(hideTimeout.current);
    };
  }, []);

  return (
    <div
      className={cn(
        "fixed bottom-4 left-4 z-40 transition-all duration-300 ease-out lg:hidden",
        visible ? "translate-y-0 opacity-100" : "translate-y-24 opacity-0",
      )}
    >
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex size-14 items-center justify-center rounded-full border border-[#86b3fb] bg-white shadow-[0px_4px_10px_rgba(0,0,0,0.15)]"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          {open ? (
            <path d="M4 4L16 16M16 4L4 16" stroke="#1465e6" strokeWidth="2" strokeLinecap="round" />
          ) : (
            <path d="M3 5H17M3 10H17M3 15H17" stroke="#1465e6" strokeWidth="2" strokeLinecap="round" />
          )}
        </svg>
      </button>

      <MobileNavGrid open={open} onClose={() => setOpen(false)} activeKey={activeKey} activeChildKey={activeChildKey} />
    </div>
  );
}
