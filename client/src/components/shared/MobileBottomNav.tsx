"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { NavIcon } from "@/components/shared/NavIcon";
import { NAV_ITEMS, type NavChildItem } from "@/components/shared/nav-items";

interface MobileBottomNavProps {
  activeKey?: string;
  activeChildKey?: string;
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

export function MobileBottomNav({ activeKey = "feed", activeChildKey = "home" }: MobileBottomNavProps) {
  const [visible, setVisible] = useState(true);
  const hideTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [openKey, setOpenKey] = useState<string | null>(null);
  const itemRefs = useRef(new Map<string, HTMLAnchorElement>());
  const flyoutRef = useRef<HTMLDivElement | null>(null);
  const [flyoutPos, setFlyoutPos] = useState<{ bottom: number; left: number } | null>(null);

  const openItem = openKey ? NAV_ITEMS.find((item) => item.key === openKey) : undefined;
  const showFlyout = !!openItem?.children?.length;

  useEffect(() => {
    const handleScroll = () => {
      setVisible(false);
      setOpenKey(null);
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

  useEffect(() => {
    if (!showFlyout || !openKey) return;
    const updatePosition = () => {
      const rect = itemRefs.current.get(openKey)?.getBoundingClientRect();
      if (!rect) return;
      setFlyoutPos({
        bottom: window.innerHeight - rect.top + 8,
        left: Math.min(Math.max(rect.left + rect.width / 2 - 96, 8), window.innerWidth - 192 - 8),
      });
    };
    updatePosition();
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("resize", updatePosition);
      setFlyoutPos(null);
    };
  }, [showFlyout, openKey]);

  useEffect(() => {
    if (!showFlyout || !openKey) return;
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (itemRefs.current.get(openKey)?.contains(target) || flyoutRef.current?.contains(target)) return;
      setOpenKey(null);
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [showFlyout, openKey]);

  return (
    <nav
      aria-label="Primary navigation"
      aria-hidden={!visible}
      className={cn(
        "no-scrollbar fixed bottom-4 left-1/2 z-40 flex w-[calc(100%-32px)] -translate-x-1/2 items-center justify-between overflow-x-auto rounded-full border border-white/40 bg-white/10 p-5 shadow-[0px_4px_10px_rgba(0,0,0,0.15)] backdrop-blur-sm backdrop-saturate-150 transition-all duration-300 ease-out lg:hidden",
        visible ? "translate-y-0 opacity-100" : "translate-y-24 opacity-0",
      )}
    >
      {NAV_ITEMS.map((item) => {
        const isActive = item.key === activeKey;
        const hasChildren = !!item.children?.length;
        const isOpen = hasChildren && openKey === item.key;

        return (
          <Link
            key={item.key}
            href={item.href}
            ref={(node) => {
              if (node) itemRefs.current.set(item.key, node);
              else itemRefs.current.delete(item.key);
            }}
            onClick={(event) => {
              if (item.href === "#") event.preventDefault();
              if (hasChildren) {
                setOpenKey((current) => (current === item.key ? null : item.key));
              }
            }}
            aria-label={item.label}
            aria-expanded={hasChildren ? isOpen : undefined}
            className="flex shrink-0 flex-col items-center gap-0.5"
          >
            <NavIcon
              icon={item.icon}
              color="night"
              size={12}
              className={isActive ? "bg-brand-900" : "bg-[#001f3f] opacity-70"}
            />
            <span
              className={cn(
                "whitespace-nowrap text-[10px]",
                isActive ? "font-semibold text-brand-900" : "font-normal text-[#001f3f] opacity-70",
              )}
            >
              {SHORT_LABEL[item.key] ?? item.label}
            </span>
          </Link>
        );
      })}

      {showFlyout &&
        flyoutPos &&
        openItem?.children &&
        createPortal(
          <div
            ref={flyoutRef}
            style={{ bottom: flyoutPos.bottom, left: flyoutPos.left }}
            className="fixed z-50 flex w-48 flex-col gap-1 rounded-[11px] border border-gray-200 bg-white p-2 shadow-lg"
          >
            {openItem.children.map((child) => (
              <ChildLink key={child.key} child={child} isActive={child.key === activeChildKey} />
            ))}
          </div>,
          document.body,
        )}
    </nav>
  );
}

function ChildLink({ child, isActive }: { child: NavChildItem; isActive: boolean }) {
  return (
    <Link
      href={child.href}
      onClick={(event) => {
        if (child.href === "#") event.preventDefault();
      }}
      className="flex h-10 w-full items-center gap-3 rounded-[10px] px-3 text-[13px] hover:bg-gray-50"
    >
      <NavIcon icon={child.icon} color={isActive ? "brand" : "night"} size={16} />
      <span className={cn("whitespace-nowrap", isActive ? "font-medium text-brand-600" : "text-night-700")}>
        {child.label}
      </span>
    </Link>
  );
}
