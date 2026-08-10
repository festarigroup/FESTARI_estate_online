"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { useRouter } from "next/navigation";
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
 * - auth gating: redirects to /login once we know there's no signed-in
 *   user, so /login (with its own link to /register) is effectively the
 *   app's landing screen for anyone signed out now that a real backend is
 *   wired up (see NEXT_PUBLIC_API_URL) — most of this app's real data
 *   (feed personalization, follow suggestions, unread counts, likes/saves)
 *   is only meaningful for an authenticated caller, and several endpoints
 *   require a token outright. (This has flip-flopped a couple of times
 *   this session depending on whether there was a real backend to sign in
 *   against yet — it's back on again now that there is one.)
 * - the mobile drawer open/close state shared between the hamburger button
 *   (header) and the drawer (sidebar);
 * - the desktop sidebar's collapsed/expanded state (Figma node 3393:17213's
 *   "Collapse bar"), exposed to children two ways: as the `--sidebar-w`
 *   custom property so TopNavBar and this shell's own `<main>` padding can
 *   size themselves against it, and as a plain `collapsed` prop to
 *   TopNavBar directly for the one thing sizing alone can't do — hiding
 *   its "Festari Estates" wordmark down to just the logo mark.
 */
export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  if (loading || !user) {
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
        <TopNavBar onMenuClick={() => setSidebarOpen(true)} collapsed={collapsed} />
        <SideNavBar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed((v) => !v)}
        />
        <main className="pt-[73px] lg:pt-16 lg:pr-6 lg:pb-6 lg:pl-[calc(var(--sidebar-w)+24px)]">
          {children}
        </main>
      </div>
    </PostComposerProvider>
  );
}
