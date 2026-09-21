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
    <div className="flex h-screen w-full flex-col overflow-hidden bg-gray-50">
      <TopNav />
      <div className="flex flex-1 overflow-hidden">
        <AppSidebar
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed((value) => !value)}
          activeKey={activeKey}
        />
        <main className="no-scrollbar min-w-0 flex-1 overflow-y-auto px-6 py-6">{children}</main>
        {rightRail && (
          <div className="no-scrollbar w-[350px] shrink-0 overflow-y-auto px-6 py-6">{rightRail}</div>
        )}
      </div>
    </div>
  );
}
