"use client";

import { useState } from "react";
import { SideNavBar } from "@/components/layout/SideNavBar";
import { TopNavBar } from "@/components/layout/TopNavBar";

/**
 * Wraps every route with the persistent header + sidebar chrome from the
 * Figma "Home" screen, and owns the mobile drawer open/close state shared
 * between the hamburger button (header) and the drawer (sidebar).
 *
 * Auth gating is disabled for now, at explicit request: the real backend
 * isn't hosted anywhere reachable yet, so `useAuth()`'s `user` is always
 * null regardless of who's actually "logged in" — redirecting to /login on
 * that basis would block every route, including "/", rather than just the
 * ones that should genuinely require a session. TopNavBar still calls
 * `useAuth()` itself and degrades gracefully with no user (falls back to
 * "Account", skips the unread-count fetches), so nothing here crashes
 * without one.
 *
 * Once the API is deployed, restore the gate — see git history (this file,
 * pre-"skip auth for all dashboard routes") for the previous
 * `useAuth()` + redirect-on-no-user version.
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
