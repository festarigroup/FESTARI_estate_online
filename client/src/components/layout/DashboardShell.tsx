"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SideNavBar } from "@/components/layout/SideNavBar";
import { TopNavBar } from "@/components/layout/TopNavBar";
import { useAuth } from "@/context/AuthContext";

/**
 * Wraps every authenticated route with the persistent header + sidebar chrome
 * from the Figma "Home" screen, and owns the mobile drawer open/close state
 * shared between the hamburger button (header) and the drawer (sidebar).
 * Also gates every route behind auth — redirects to /login once we know
 * there's no signed-in user.
 */
export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
    <div className="min-h-screen bg-background">
      <TopNavBar onMenuClick={() => setSidebarOpen(true)} />
      <SideNavBar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="pt-[73px] lg:pl-64">{children}</main>
    </div>
  );
}
