"use client";

import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { NavIcon } from "@/components/shared/NavIcon";
import { NAV_ITEMS } from "@/components/shared/nav-items";

interface MobileBottomNavProps {
  activeKey?: string;
}

export function MobileBottomNav({ activeKey = "feed" }: MobileBottomNavProps) {
  // Starts fully open (Figma node 244:64920) so the nav is usable without an
  // extra tap; the hamburger button collapses it back to just itself when
  // the user wants an unobstructed view of the feed, and picking any item
  // closes it the same way.
  const [expanded, setExpanded] = useState(true);

  return (
    <nav
      aria-label="Primary navigation"
      className={cn(
        // Centering an element with width calc(100% - 120px) always computes
        // to a constant 60px left offset, so the collapsed trigger sits at
        // that same left-[60px] — no jump when it expands/collapses.
        "fixed bottom-4 left-[60px] z-40 flex items-center overflow-x-auto rounded-full bg-white p-[10px] shadow-[0px_4px_10px_rgba(0,0,0,0.15)] lg:hidden",
        expanded ? "w-[calc(100%-120px)] justify-between" : "w-fit gap-5",
      )}
    >
      <button
        type="button"
        aria-label={expanded ? "Hide navigation" : "Show navigation"}
        aria-expanded={expanded}
        onClick={() => setExpanded((v) => !v)}
        className="flex shrink-0 items-center justify-center rounded-full bg-[#5d9afb] p-[10px] shadow-[0px_4px_2px_rgba(0,0,0,0.25)]"
      >
        <NavIcon icon="/icons/menu-03.svg" color="white" size={20} />
      </button>

      {expanded &&
        NAV_ITEMS.map((item) => {
          const isActive = item.key === activeKey;

          return (
            <Link
              key={item.key}
              href={item.href}
              onClick={(event) => {
                if (item.href === "#") event.preventDefault();
                setExpanded(false);
              }}
              aria-label={item.label}
              title={item.label}
              className="flex shrink-0 items-center justify-center rounded-full p-2"
            >
              <NavIcon icon={item.icon} color={isActive ? "brand" : "night"} size={20} />
            </Link>
          );
        })}
    </nav>
  );
}
