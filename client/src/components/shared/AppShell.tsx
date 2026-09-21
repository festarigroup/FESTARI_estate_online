"use client";

import { useState, type ReactNode } from "react";
import { AppSidebar } from "@/components/shared/AppSidebar";
import { TopNav } from "@/components/shared/TopNav";

interface AppShellProps {
  activeKey?: string;
  children: ReactNode;
  rightRail?: ReactNode;
}

export function AppShell({ activeKey, children, rightRail }: AppShellProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen w-full min-w-[1440px] flex-col bg-gray-50">
      <TopNav />
      <div className="flex flex-1 items-start">
        <AppSidebar
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed((value) => !value)}
          activeKey={activeKey}
        />
        <main className="flex-1 px-6 py-6">{children}</main>
        {rightRail && <div className="w-[350px] shrink-0 px-6 py-6">{rightRail}</div>}
      </div>
    </div>
  );
}
