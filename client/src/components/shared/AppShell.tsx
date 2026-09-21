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
        <main className="no-scrollbar min-w-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-6">
          {children}
        </main>
        {rightRail && (
          <div className="no-scrollbar hidden w-[350px] shrink-0 overflow-y-auto px-6 py-6 xl:block">
            {rightRail}
          </div>
        )}
      </div>
      <MobileBottomNav activeKey={activeKey} />
    </div>
  );
}
