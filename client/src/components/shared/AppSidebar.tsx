"use client";

import Image from "next/image";
import Link from "next/link";
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
        "hidden h-full shrink-0 flex-col gap-[11px] border border-gray-200 bg-white px-[17px] py-4 transition-[width] duration-200 ease-in-out lg:flex",
        collapsed ? "w-[61px]" : "w-[228px]",
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
              <Link
                href={item.href}
                aria-expanded={hasChildren && !collapsed ? isOpen : undefined}
                aria-label={collapsed ? item.label : undefined}
                onClick={(event) => {
                  if (item.href === "#") event.preventDefault();
                  if (!collapsed && hasChildren) {
                    setOpenKey((current) => (current === item.key ? null : item.key));
                  }
                }}
                className={cn(
                  "group relative flex h-[53px] w-full items-center rounded-[11px] px-[15px] py-[11px] text-[13px] font-medium",
                  !collapsed && "justify-between",
                  isActive && !isOpen ? "bg-brand-600 text-white" : "text-night-700 hover:bg-gray-50",
                )}
              >
                <span className="flex items-center gap-2">
                  <span className="relative block size-[19px] shrink-0">
                    <Image src={item.icon} alt="" fill sizes="19px" />
                  </span>
                  {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
                </span>
                <span
                  className={cn(
                    "relative flex shrink-0 items-center justify-center transition-transform duration-150",
                    collapsed ? "size-3" : "size-[23px]",
                    isOpen && "rotate-90",
                  )}
                >
                  <Image
                    src={isActive && !isOpen ? "/icons/chevron-right.svg" : "/icons/chevron-right-gray.svg"}
                    alt=""
                    width={collapsed ? 4 : 7}
                    height={collapsed ? 8 : 13}
                    className={cn("w-auto object-contain", collapsed ? "h-[7px]" : "h-[13px]")}
                  />
                </span>
                {collapsed && (
                  <span className="pointer-events-none absolute left-full top-1/2 z-50 ml-2 -translate-y-1/2 whitespace-nowrap rounded-lg bg-night-900 px-3 py-2 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100">
                    {item.label}
                  </span>
                )}
              </Link>

              {isOpen && item.children && (
                <div className="flex w-full flex-col items-start pb-1">
                  {item.children.map((child) => {
                    const isChildActive = child.key === activeChildKey;
                    return (
                      <Link
                        key={child.key}
                        href={child.href}
                        onClick={(event) => {
                          if (child.href === "#") event.preventDefault();
                        }}
                        className="flex h-[34px] w-full items-center gap-[15px] rounded-[11px] px-[23px] py-2 text-[13px] hover:bg-gray-50"
                      >
                        <span className="relative block size-[15px] shrink-0">
                          <Image src={child.icon} alt="" fill sizes="15px" />
                        </span>
                        <span
                          className={cn(
                            "whitespace-nowrap",
                            isChildActive ? "font-medium text-brand-600" : "text-night-700",
                          )}
                        >
                          {child.label}
                        </span>
                      </Link>
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
        className="flex w-full items-center gap-[10px] rounded-[11px] px-[15px] py-[11px] text-[13px] text-text-secondary-dark hover:bg-gray-50"
      >
        <span className="relative block size-[23px] shrink-0">
          <Image src="/icons/collapse-bar.svg" alt="" fill sizes="23px" />
        </span>
        {!collapsed && <span className="whitespace-nowrap">Collapse bar</span>}
      </button>
    </aside>
  );
}
