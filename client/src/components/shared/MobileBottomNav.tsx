"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { NavIcon } from "@/components/shared/NavIcon";
import { NAV_ITEMS } from "@/components/shared/nav-items";

interface MobileBottomNavProps {
  activeKey?: string;
}

// Shorter labels than the sidebar's full names (e.g. "Stay and Events"), to
// fit this compact bar's tight per-item columns (Figma node 252:65144).
const SHORT_LABEL: Record<string, string> = {
  feed: "Feed",
  people: "People",
  services: "Service",
  community: "Community",
  stay: "Stay",
  you: "You",
};

export function MobileBottomNav({ activeKey = "feed" }: MobileBottomNavProps) {
  const [visible, setVisible] = useState(true);
  const hideTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(false);
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
    <nav
      aria-label="Primary navigation"
      aria-hidden={!visible}
      className={cn(
        "fixed bottom-4 left-1/2 z-40 flex w-[calc(100%-32px)] -translate-x-1/2 items-center justify-between rounded-full border border-gray-200 bg-white px-5 py-3 shadow-[0px_4px_10px_rgba(0,0,0,0.15)] transition-all duration-300 ease-out lg:hidden",
        visible ? "translate-y-0 opacity-100" : "translate-y-24 opacity-0",
      )}
    >
      {NAV_ITEMS.map((item) => {
        const isActive = item.key === activeKey;
        return (
          <Link
            key={item.key}
            href={item.href}
            onClick={(event) => {
              if (item.href === "#") event.preventDefault();
            }}
            aria-label={item.label}
            className="flex shrink-0 flex-col items-center gap-0.5"
          >
            <NavIcon
              icon={item.icon}
              color={isActive ? "brand" : "night"}
              size={12}
              className={isActive ? undefined : "opacity-70"}
            />
            <span
              className={cn(
                "text-[10px]",
                isActive ? "font-semibold text-brand-600" : "font-normal text-night-700 opacity-70",
              )}
            >
              {SHORT_LABEL[item.key] ?? item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
