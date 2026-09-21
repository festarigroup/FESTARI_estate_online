"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/components/shared/nav-items";

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

  return (
    <aside
      className={cn(
        "hidden h-full shrink-0 flex-col gap-3 border border-gray-200 bg-white px-[18px] py-[17px] transition-[width] duration-200 ease-in-out lg:flex",
        collapsed ? "w-16" : "w-60",
      )}
      aria-label="Primary navigation"
    >
      <nav className="no-scrollbar flex flex-1 flex-col items-start gap-0 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const hasChildren = !!item.children?.length;
          const isOpen = !collapsed && hasChildren && openKey === item.key;
          const isActive = item.key === activeKey;

          return (
            <div key={item.key} className="w-full">
              <a
                href={item.href}
                aria-expanded={hasChildren && !collapsed ? isOpen : undefined}
                aria-label={collapsed ? item.label : undefined}
                onClick={(event) => {
                  if (item.href === "#") event.preventDefault();
                  if (collapsed) {
                    onToggleCollapse();
                    return;
                  }
                  if (hasChildren) {
                    setOpenKey((current) => (current === item.key ? null : item.key));
                  }
                }}
                className={cn(
                  "group relative flex h-14 w-full items-center rounded-xl px-4 py-3 text-sm font-medium",
                  !collapsed && "justify-between",
                  isActive && !isOpen ? "bg-brand-600 text-white" : "text-night-700 hover:bg-gray-50",
                )}
              >
                <span className="flex items-center gap-2">
                  <span className="relative block size-5 shrink-0">
                    <Image src={item.icon} alt="" fill sizes="20px" />
                  </span>
                  {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
                </span>
                <span
                  className={cn(
                    "relative flex shrink-0 items-center justify-center transition-transform duration-150",
                    collapsed ? "size-3.5" : "size-6",
                    isOpen && "rotate-90",
                  )}
                >
                  <Image
                    src={isActive && !isOpen ? "/icons/chevron-right.svg" : "/icons/chevron-right-gray.svg"}
                    alt=""
                    width={collapsed ? 4 : 7}
                    height={collapsed ? 8 : 14}
                    className={cn("w-auto object-contain", collapsed ? "h-2" : "h-3.5")}
                  />
                </span>
                {collapsed && (
                  <span className="pointer-events-none absolute left-full top-1/2 z-50 ml-2 -translate-y-1/2 whitespace-nowrap rounded-lg bg-night-900 px-3 py-2 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100">
                    {item.label}
                  </span>
                )}
              </a>

              {isOpen && item.children && (
                <div className="flex w-full flex-col items-start pb-1">
                  {item.children.map((child) => {
                    const isChildActive = child.key === activeChildKey;
                    return (
                      <a
                        key={child.key}
                        href={child.href}
                        onClick={(event) => {
                          if (child.href === "#") event.preventDefault();
                        }}
                        className="flex h-9 w-full items-center gap-4 rounded-xl px-6 py-2 text-sm hover:bg-gray-50"
                      >
                        <span className="relative block size-4 shrink-0">
                          <Image src={child.icon} alt="" fill sizes="16px" />
                        </span>
                        <span
                          className={cn(
                            "whitespace-nowrap",
                            isChildActive ? "font-medium text-brand-600" : "text-night-700",
                          )}
                        >
                          {child.label}
                        </span>
                      </a>
                    );
                  })}
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
        className="flex w-full items-center gap-[10px] rounded-xl px-4 py-3 text-sm text-text-secondary-dark hover:bg-gray-50"
      >
        <span className="relative block size-6 shrink-0">
          <Image src="/icons/collapse-bar.svg" alt="" fill sizes="24px" />
        </span>
        {!collapsed && <span className="whitespace-nowrap">Collapse bar</span>}
      </button>
    </aside>
  );
}
