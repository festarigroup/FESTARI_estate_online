"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { NAV_ITEMS, type NavChildItem } from "@/components/shared/nav-items";

interface AppSidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  activeKey?: string;
  activeChildKey?: string;
}

export function AppSidebar({
  collapsed,
  onToggleCollapse,
  activeKey = "feed",
  activeChildKey = "home",
}: AppSidebarProps) {
  const [openKey, setOpenKey] = useState<string | null>(activeKey);
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const flyoutRef = useRef<HTMLDivElement | null>(null);
  const [flyoutPos, setFlyoutPos] = useState<{ top: number; left: number } | null>(null);

  const openItem = openKey ? NAV_ITEMS.find((item) => item.key === openKey) : undefined;
  const showFlyout = collapsed && !!openItem?.children?.length;

  // The collapsed rail sits inside overflow-hidden/overflow-auto ancestors, so
  // the flyout is portalled to <body> and positioned from the trigger's rect
  // instead of relying on CSS `absolute` (which those ancestors would clip).
  useEffect(() => {
    if (!showFlyout) {
      setFlyoutPos(null);
      return;
    }
    const updatePosition = () => {
      const rect = triggerRef.current?.getBoundingClientRect();
      if (rect) setFlyoutPos({ top: rect.top, left: rect.right + 8 });
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
    <aside
      className={cn(
        "hidden h-full shrink-0 flex-col gap-[11px] border border-gray-200 bg-white py-4 transition-[width,padding] duration-200 ease-in-out lg:flex",
        collapsed ? "w-20 px-3" : "w-[228px] px-[17px]",
      )}
      aria-label="Primary navigation"
    >
      <nav className="no-scrollbar flex flex-1 flex-col items-start gap-0 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const hasChildren = !!item.children?.length;
          const isOpen = hasChildren && openKey === item.key;
          const isActive = item.key === activeKey;

          return (
            <div key={item.key} className="relative w-full" ref={isOpen ? triggerRef : undefined}>
              <Link
                href={item.href}
                aria-expanded={hasChildren ? isOpen : undefined}
                aria-label={collapsed ? item.label : undefined}
                onClick={(event) => {
                  if (item.href === "#") event.preventDefault();
                  if (hasChildren) {
                    setOpenKey((current) => (current === item.key ? null : item.key));
                  }
                }}
                className={cn(
                  "group relative flex h-[53px] w-full items-center gap-1 rounded-[11px] py-[11px] text-[13px] font-medium",
                  collapsed ? "justify-center px-1" : "justify-between px-[15px]",
                  isActive ? "bg-brand-600 text-white" : "text-night-700 hover:bg-gray-50",
                )}
              >
                <span className="flex items-center gap-2">
                  <span className="relative block size-[19px] shrink-0">
                    <Image src={item.icon} alt="" fill sizes="19px" />
                  </span>
                  {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
                </span>
                {hasChildren && (
                  <span
                    className={cn(
                      "relative flex shrink-0 items-center justify-center transition-transform duration-150",
                      collapsed ? "size-4" : "size-[23px]",
                      isOpen && "rotate-90",
                    )}
                  >
                    <Image
                      src={isActive ? "/icons/chevron-right.svg" : "/icons/chevron-right-gray.svg"}
                      alt=""
                      width={collapsed ? 5 : 7}
                      height={collapsed ? 10 : 13}
                      className={cn("w-auto object-contain", collapsed ? "h-[10px]" : "h-[13px]")}
                    />
                  </span>
                )}
                {collapsed && (
                  <span className="pointer-events-none absolute left-full top-1/2 z-50 ml-2 -translate-y-1/2 whitespace-nowrap rounded-lg bg-night-900 px-3 py-2 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100">
                    {item.label}
                  </span>
                )}
              </Link>

              {isOpen && item.children && !collapsed && (
                <div className="flex w-full flex-col items-start pb-1">
                  {item.children.map((child) => (
                    <ChildLink key={child.key} child={child} isActive={child.key === activeChildKey} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <button
        type="button"
        onClick={onToggleCollapse}
        title={collapsed ? "Expand sidebar" : "Collapse bar"}
        className={cn(
          "flex w-full items-center gap-[10px] rounded-[11px] py-[11px] text-[13px] text-text-secondary-dark hover:bg-gray-50",
          collapsed ? "justify-center px-1" : "px-[15px]",
        )}
      >
        <span className="relative block size-[23px] shrink-0">
          <Image src="/icons/collapse-bar.svg" alt="" fill sizes="23px" />
        </span>
        {!collapsed && <span className="whitespace-nowrap">Collapse bar</span>}
      </button>

      {showFlyout &&
        flyoutPos &&
        openItem?.children &&
        createPortal(
          <div
            ref={flyoutRef}
            style={{ top: flyoutPos.top, left: flyoutPos.left }}
            className="fixed z-50 flex w-44 flex-col gap-1 rounded-[11px] border border-gray-200 bg-white p-2 shadow-lg"
          >
            {openItem.children.map((child) => (
              <ChildLink key={child.key} child={child} isActive={child.key === activeChildKey} />
            ))}
          </div>,
          document.body,
        )}
    </aside>
  );
}

function ChildLink({ child, isActive }: { child: NavChildItem; isActive: boolean }) {
  return (
    <Link
      href={child.href}
      onClick={(event) => {
        if (child.href === "#") event.preventDefault();
      }}
      className="flex h-[34px] w-full items-center gap-[15px] rounded-[11px] px-[23px] py-2 text-[13px] hover:bg-gray-50"
    >
      <span className="relative block size-[15px] shrink-0">
        <Image src={child.icon} alt="" fill sizes="15px" />
      </span>
      <span className={cn("whitespace-nowrap", isActive ? "font-medium text-brand-600" : "text-night-700")}>
        {child.label}
      </span>
    </Link>
  );
}
