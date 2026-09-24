"use client";

import { useState } from "react";
import { MobileNavGrid } from "@/components/shared/MobileNavGrid";

interface MobileBottomNavProps {
  activeKey?: string;
  activeChildKey?: string;
}

/** A single floating menu button that expands into a grid of every nav
 * category's sub-items (see MobileNavGrid) — replaces the old per-category
 * icon bar on mobile. Stays on screen at all times (no scroll-hide). */
export function MobileBottomNav({ activeKey = "feed", activeChildKey = "home" }: MobileBottomNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-4 left-4 z-50 lg:hidden">
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex size-14 items-center justify-center rounded-full bg-[#e6e6e6] shadow-[0px_8px_20px_-4px_rgba(0,0,0,0.35)]"
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
