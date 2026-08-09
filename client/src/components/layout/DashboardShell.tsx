"use client";

import { useState, type CSSProperties } from "react";
import { SideNavBar } from "@/components/layout/SideNavBar";
import { TopNavBar } from "@/components/layout/TopNavBar";
import { useAuth } from "@/context/AuthContext";
import { PostComposerProvider } from "@/context/PostComposerContext";

// Read by SideNavBar/TopNavBar/main via `var(--sidebar-w)` so all three
// stay in sync with the collapse toggle without prop-drilling a pixel
// value through components that don't otherwise need it.
const SIDEBAR_WIDTH_EXPANDED = "272px";
const SIDEBAR_WIDTH_COLLAPSED = "88px";

/**
 * Wraps every route under `(app)` with the persistent header + sidebar
 * chrome, and owns:
 * - the mobile drawer open/close state shared between the hamburger button
 *   (header) and the drawer (sidebar);
 * - the desktop sidebar's collapsed/expanded state (Figma node 3393:17213's
 *   "Collapse bar"), exposed to children as `--sidebar-w` so TopNavBar and
 *   this shell's own `<main>` padding can react to it too.
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
  const [collapsed, setCollapsed] = useState(false);
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-muted">Loading...</p>
      </div>
    );
  }

  return (
    <PostComposerProvider>
      <div
        className="min-h-screen bg-background"
        style={{ "--sidebar-w": collapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH_EXPANDED } as CSSProperties}
      >
        <TopNavBar onMenuClick={() => setSidebarOpen(true)} />
        <SideNavBar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed((v) => !v)}
        />
        <main className="pt-[73px] lg:pt-16 lg:pr-6 lg:pb-6 lg:pl-[calc(var(--sidebar-w)+48px)]">
          {children}
        </main>
      </div>
    </PostComposerProvider>
  );
}
