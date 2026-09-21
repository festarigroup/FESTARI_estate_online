"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface NavItem {
  key: string;
  label: string;
  icon: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { key: "feed", label: "Feed", icon: "/icons/grid-view.svg", href: "/home" },
  { key: "people", label: "People", icon: "/icons/user-star-01.svg", href: "#" },
  { key: "services", label: "Services", icon: "/icons/timer-clock-watch.svg", href: "#" },
  { key: "community", label: "Community", icon: "/icons/user-group.svg", href: "#" },
  { key: "stay", label: "Stay and Events", icon: "/icons/guest-house.svg", href: "#" },
  { key: "you", label: "You", icon: "/icons/archive-add.svg", href: "#" },
];

interface AppSidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  activeKey?: string;
}

export function AppSidebar({ collapsed, onToggleCollapse, activeKey = "feed" }: AppSidebarProps) {
  return (
    <aside
      className={cn(
        "flex h-full shrink-0 flex-col gap-3 border border-gray-200 bg-white px-[18px] py-[17px] transition-[width] duration-200 ease-in-out",
        collapsed ? "w-16" : "w-60",
      )}
      aria-label="Primary navigation"
    >
      <nav className="flex flex-1 flex-col items-start gap-0">
        {NAV_ITEMS.map((item) => {
          const isActive = item.key === activeKey;
          return (
            <a
              key={item.key}
              href={item.href}
              aria-label={collapsed ? item.label : undefined}
              className={cn(
                "group relative flex h-14 w-full items-center rounded-xl px-4 py-3 text-sm font-medium",
                collapsed ? "justify-center" : "justify-between",
                isActive ? "bg-brand-600 text-white" : "text-night-700 hover:bg-gray-50",
              )}
            >
              <span className="flex items-center gap-2">
                <span className="relative block size-5 shrink-0">
                  <Image src={item.icon} alt="" fill sizes="20px" />
                </span>
                {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
              </span>
              {!collapsed && (
                <span className="relative flex size-6 shrink-0 items-center justify-center">
                  <Image
                    src={isActive ? "/icons/chevron-right.svg" : "/icons/chevron-right-gray.svg"}
                    alt=""
                    width={7}
                    height={14}
                    className="h-3.5 w-auto object-contain"
                  />
                </span>
              )}
              {collapsed && (
                <span className="pointer-events-none absolute left-full top-1/2 z-50 ml-2 -translate-y-1/2 whitespace-nowrap rounded-lg bg-night-900 px-3 py-2 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100">
                  {item.label}
                </span>
              )}
            </a>
          );
        })}
      </nav>

      <button
        type="button"
        onClick={onToggleCollapse}
        title={collapsed ? "Expand sidebar" : "Collapse bar"}
        className={cn(
          "flex w-full items-center gap-[10px] rounded-xl px-4 py-3 text-sm text-text-secondary-dark hover:bg-gray-50",
          collapsed && "justify-center",
        )}
      >
        <span className="relative block size-6 shrink-0">
          <Image src="/icons/collapse-bar.svg" alt="" fill sizes="24px" />
        </span>
        {!collapsed && <span className="whitespace-nowrap">Collapse bar</span>}
      </button>
    </aside>
  );
}
