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

export function MobileBottomNav({ activeKey = "feed", activeChildKey = "home" }: MobileBottomNavProps) {
  const [expanded, setExpanded] = useState(false);
  const [openKey, setOpenKey] = useState<string | null>(null);
  const navRef = useRef<HTMLElement | null>(null);
  const triggerRef = useRef<HTMLAnchorElement | null>(null);
  const flyoutRef = useRef<HTMLDivElement | null>(null);
  const [flyoutPos, setFlyoutPos] = useState<{ bottom: number; left: number } | null>(null);

  const activeItem = NAV_ITEMS.find((item) => item.key === activeKey) ?? NAV_ITEMS[0];
  const restItems = NAV_ITEMS.filter((item) => item.key !== activeItem.key);

  const openItem = openKey ? NAV_ITEMS.find((item) => item.key === openKey) : undefined;
  const showFlyout = !!openItem?.children?.length;

  useEffect(() => {
    if (!showFlyout) {
      setFlyoutPos(null);
      return;
    }
    const updatePosition = () => {
      const rect = triggerRef.current?.getBoundingClientRect();
      if (!rect) return;
      setFlyoutPos({
        bottom: window.innerHeight - rect.top + 8,
        left: Math.min(rect.left, window.innerWidth - 192 - 8),
      });
    };
    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [showFlyout, openKey]);

  useEffect(() => {
    if (!showFlyout) return;
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (triggerRef.current?.contains(target) || flyoutRef.current?.contains(target)) return;
      setOpenKey(null);
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [showFlyout]);

  // Collapse the whole pill back to just the trigger when tapping outside it.
  useEffect(() => {
    if (!expanded) return;
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (navRef.current?.contains(target) || flyoutRef.current?.contains(target)) return;
      setExpanded(false);
      setOpenKey(null);
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [expanded]);

  return (
    <nav
      ref={navRef}
      aria-label="Primary navigation"
      className={cn(
        "fixed bottom-4 left-4 z-40 flex items-center overflow-x-auto rounded-full bg-gray-50/40 p-[10px] shadow-[0px_4px_10px_rgba(0,0,0,0.15)] backdrop-blur-sm lg:hidden",
        expanded ? "right-4 justify-between" : "w-fit gap-5",
      )}
    >
      <button
        type="button"
        aria-label={expanded ? "Close navigation" : activeItem.label}
        aria-expanded={expanded}
        onClick={() => {
          setExpanded((v) => !v);
          setOpenKey(null);
        }}
        className="flex shrink-0 items-center justify-center rounded-full bg-white p-[10px] shadow-[0px_4px_2px_rgba(0,0,0,0.25)]"
      >
        <NavIcon icon={activeItem.icon} color="night" size={22} />
      </button>

      {expanded &&
        restItems.map((item) => {
          const hasChildren = !!item.children?.length;
          const isOpen = hasChildren && openKey === item.key;

          return (
            <Link
              key={item.key}
              href={item.href}
              ref={isOpen ? triggerRef : undefined}
              onClick={(event) => {
                if (item.href === "#") event.preventDefault();
                if (hasChildren) {
                  setOpenKey((current) => (current === item.key ? null : item.key));
                }
              }}
              aria-label={item.label}
              aria-expanded={hasChildren ? isOpen : undefined}
              title={item.label}
              className="flex shrink-0 items-center justify-center rounded-full p-2"
            >
              <NavIcon icon={item.icon} color="night" size={20} />
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
