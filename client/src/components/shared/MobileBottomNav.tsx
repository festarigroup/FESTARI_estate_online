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
  const [openKey, setOpenKey] = useState<string | null>(null);
  const triggerRef = useRef<HTMLAnchorElement | null>(null);
  const flyoutRef = useRef<HTMLDivElement | null>(null);
  const [flyoutPos, setFlyoutPos] = useState<{ bottom: number; left: number } | null>(null);

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

  return (
    <nav
      aria-label="Primary navigation"
      className="no-scrollbar flex h-[61px] w-full shrink-0 items-center justify-between gap-1 overflow-x-auto border-t border-gray-200 bg-white px-2 lg:hidden"
    >
      {NAV_ITEMS.map((item) => {
        const hasChildren = !!item.children?.length;
        const isOpen = hasChildren && openKey === item.key;
        const isActive = item.key === activeKey;

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
            className="flex min-w-14 flex-1 items-center justify-center rounded-lg py-2.5"
          >
            <NavIcon icon={item.icon} color={isActive ? "brand" : "night"} size={22} />
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
