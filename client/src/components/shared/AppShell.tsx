"use client";

import { useState, type ReactNode } from "react";
import { AppSidebar } from "@/components/shared/AppSidebar";
import { MobileBottomNav } from "@/components/shared/MobileBottomNav";
import { TopNav } from "@/components/shared/TopNav";
import { useMediaQuery } from "@/hooks/useMediaQuery";

interface AppShellProps {
  activeKey?: string;
  children: ReactNode;
  rightRail?: ReactNode;
}

export function AppShell({ activeKey, children, rightRail }: AppShellProps) {
  // Below xl (1280px) the sidebar defaults to icon-only so the feed column
  // keeps enough room; it expands automatically once there's space again,
  // unless the user has manually toggled it (that choice then sticks).
  const isXlUp = useMediaQuery("(min-width: 1280px)");
  const [collapsedOverride, setCollapsedOverride] = useState<boolean | null>(null);
  const collapsed = collapsedOverride ?? !isXlUp;

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-gray-50">
      <TopNav />
      <div className="flex flex-1 overflow-hidden">
        <AppSidebar
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsedOverride(!collapsed)}
          activeKey={activeKey}
        />
        {/* No top padding here: a sticky child's `top: 0` sticks relative to
            this element's padding edge, which left a gap for scrolled
            content to flash through above it. Top spacing instead lives on
            the non-scrolling wrapper inside `children`, so it scrolls away
            normally and the sticky child ends up flush with this element's
            actual top edge. */}
        <main className="no-scrollbar min-w-0 flex-1 overflow-y-auto px-[15px] pb-[15px] sm:px-[23px] sm:pb-[23px]">
          {children}
        </main>
        {rightRail && (
          <div className="no-scrollbar hidden w-[333px] shrink-0 overflow-y-auto px-[23px] py-[23px] xl:block">
            {rightRail}
          </div>
        )}
      </div>
      <MobileBottomNav activeKey={activeKey} />
    </div>
  );
}
