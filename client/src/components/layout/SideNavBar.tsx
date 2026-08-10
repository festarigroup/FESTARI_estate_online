"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavLink } from "@/components/layout/NavLink";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { cn } from "@/lib/cn";
import { NAV_ITEMS, NAV_SECONDARY_ITEMS } from "@/lib/mock-data";

interface SideNavBarProps {
  open: boolean;
  onClose: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

/**
 * Persistent left navigation ("Sidebar" in Figma, node 3393:17104). On
 * desktop it's a flush white panel touching the top and left edges of the
 * viewport (`lg:top-16 lg:left-0`, width driven by the shared
 * `--sidebar-w` custom property DashboardShell sets), same as TopNavBar's
 * own edge-to-edge treatment, rather than the earlier floating rounded
 * card inset from all four edges.
 *
 * Below `lg` this is a fixed-position overlay drawer instead of a
 * permanent column — there's no room for a persistent sidebar on a phone —
 * but it's the same white/navy/gold palette as the desktop panel now, not
 * the inverted all-navy drawer it used to fall back to (Figma has no
 * mobile frame at all to match against here). Collapsing stays
 * desktop-only: a mobile drawer that already closes with one tap gets
 * nothing from also being collapsible.
 *
 * The brand header only renders here below `lg` — on desktop the logo
 * lives in TopNavBar instead, and this aside no longer needs to dodge it
 * (TopNavBar sits beside this card now, not above it).
 */
export function SideNavBar({ open, onClose, collapsed, onToggleCollapse }: SideNavBarProps) {
  const pathname = usePathname();

  return (
    <>
      {open && (
        <button
          aria-label="Dismiss navigation overlay"
          onClick={onClose}
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-[55] flex w-64 flex-col border-r border-[#e6e7ec] bg-white transition-transform",
          // Starts *below* TopNavBar (top-16 = its own 64px lg height,
          // flush against it, no gap) and flush against the left edge
          // (left-0) — matches Figma, where the Sidebar sits directly
          // under and beside the full-width Top Nav with no inset on
          // either edge.
          "lg:inset-y-auto lg:top-16 lg:bottom-0 lg:left-0 lg:z-40 lg:w-[var(--sidebar-w)] lg:translate-x-0 lg:transition-[width]",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between px-4 pt-4 pb-2 lg:hidden">
          <Link href="/" onClick={onClose} className="flex items-center gap-2">
            <Image src="/images/logo-festari.png" alt="" width={31} height={40} className="h-9 w-auto" />
            <span className="font-display text-base font-bold tracking-[-0.5px] text-ink">Festari Estates</span>
          </Link>
          <button onClick={onClose} aria-label="Close navigation" className="text-muted hover:text-ink">
            <DynamicIcon name="X" className="size-5" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-2 pt-6 lg:pt-4" aria-label="Primary">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.id} item={item} active={pathname === item.href} collapsed={collapsed} />
          ))}
        </nav>

        <div className="flex flex-col gap-1 border-t border-[#e6e7ec] px-2 pt-2 pb-2">
          {NAV_SECONDARY_ITEMS.map((item) => (
            <NavLink key={item.id} item={item} active={pathname === item.href} collapsed={collapsed} />
          ))}

          {/* "Collapse bar" (Figma node 3393:17213) — desktop-only, no
              matching control exists for the mobile drawer. */}
          <button
            onClick={onToggleCollapse}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={cn(
              "hidden items-center gap-3 rounded-xl px-4 py-3 text-sm text-muted hover:bg-surface-muted hover:text-ink lg:flex",
              collapsed && "justify-center",
            )}
          >
            <DynamicIcon name={collapsed ? "PanelLeftOpen" : "PanelLeftClose"} className="size-[18px] shrink-0" />
            {!collapsed && "Collapse bar"}
          </button>
        </div>
      </aside>
    </>
  );
}
