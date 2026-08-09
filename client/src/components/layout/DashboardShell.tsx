"use client";

import { useState } from "react";
import { SideNavBar } from "@/components/layout/SideNavBar";
import { TopNavBar } from "@/components/layout/TopNavBar";

/**
 * Wraps every authenticated route with the persistent header + sidebar chrome
 * from the Figma "Home" screen, and owns the mobile drawer open/close state
 * shared between the hamburger button (header) and the drawer (sidebar).
 */
export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <TopNavBar onMenuClick={() => setSidebarOpen(true)} />
      <SideNavBar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="pt-[73px] lg:pl-64">{children}</main>
    </div>
  );
}
