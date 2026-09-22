"use client";

import { useState, type ReactNode } from "react";
import { AppSidebar } from "@/components/shared/AppSidebar";
import { MobileBottomNav } from "@/components/shared/MobileBottomNav";
import { TopNav } from "@/components/shared/TopNav";
import { useMediaQuery } from "@/hooks/useMediaQuery";

interface AppShellProps {
  activeKey?: string;
  /** Rendered above the scrollable body, outside the scroll container —
   * genuinely fixed in place rather than relying on `position: sticky`. */
  header?: ReactNode;
  children: ReactNode;
  rightRail?: ReactNode;
}

export function AppShell({ activeKey, header, children, rightRail }: AppShellProps) {
  // Below xl (1280px) the sidebar defaults to icon-only so the feed column
  // keeps enough room; it expands automatically once there's space again,
  // unless the user has manually toggled it (that choice then sticks).
  const isXlUp = useMediaQuery("(min-width: 1280px)");
  const [collapsedOverride, setCollapsedOverride] = useState<boolean | null>(null);
  const collapsed = collapsedOverride ?? !isXlUp;

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-gray-50">
      <TopNav />
      <div className="flex w-full flex-1 overflow-hidden">
        <AppSidebar
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsedOverride(!collapsed)}
          activeKey={activeKey}
        />
        {/* `header` lives outside the scroll container entirely (a real,
            non-scrolling region) rather than being pinned there with
            `position: sticky`, so it can't ever scroll away or flicker. */}
        <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
          {header && (
            <div className="shrink-0 px-[15px] pt-[15px] sm:px-[23px] sm:pt-[23px]">
              <div className="mx-auto w-full max-w-[762px] 4xl:max-w-[920px] 5xl:max-w-[1100px]">{header}</div>
            </div>
          )}
          {/* Extra bottom clearance below lg so the floating mobile nav pill
              never overlaps the last post. */}
          <div className="no-scrollbar flex-1 overflow-y-auto px-[15px] pb-24 sm:px-[23px] lg:pb-[23px]">
            <div className="mx-auto w-full max-w-[762px] 4xl:max-w-[920px] 5xl:max-w-[1100px]">{children}</div>
          </div>
        </main>
        {rightRail && (
          <div className="no-scrollbar hidden w-[333px] shrink-0 overflow-y-auto px-[23px] py-[23px] xl:block 4xl:w-[380px] 5xl:w-[420px]">
            {rightRail}
          </div>
        )}
      </div>
      <MobileBottomNav activeKey={activeKey} />
    </div>
  );
}
