"use client";

import { useState } from "react";
import { SideNavBar } from "@/components/layout/SideNavBar";
import { TopNavBar } from "@/components/layout/TopNavBar";
import { useAuth } from "@/context/AuthContext";

/**
 * Wraps every route under `(app)` with the persistent header + sidebar
 * chrome from the Figma "Home" screen, and owns the mobile drawer
 * open/close state shared between the hamburger button (header) and the
 * drawer (sidebar).
 *
 * TEMPORARY: this used to also gate every route behind auth (redirecting to
 * /login once `loading` resolved with no signed-in user). Disabled for now
 * since there's no backend hosted to actually log in against yet — every
 * page here already treats `user` as possibly null (falls back to "there"/
 * "You"/guest copy), so browsing signed-out just means write actions
 * (posting, following, reserving...) hit the API and fail gracefully rather
 * than being blocked up front. Restore the redirect once real auth is
 * reachable again: see git history on this file for the removed block.
 */
export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-muted">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <TopNavBar onMenuClick={() => setSidebarOpen(true)} />
      <SideNavBar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="pt-[73px] lg:pl-64">{children}</main>
    </div>
  );
}
