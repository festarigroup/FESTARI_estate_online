"use client";

import { usePathname } from "next/navigation";
import { NavLink } from "@/components/layout/NavLink";
import { Button } from "@/components/ui/Button";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { cn } from "@/lib/cn";
import { NAV_ITEMS, NAV_SECONDARY_ITEMS } from "@/lib/mock-data";

interface SideNavBarProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Persistent left navigation ("Aside - SideNavBar" in Figma). Fixed under the
 * header on desktop; slides in as an overlay drawer on mobile/tablet, since
 * the Figma file only specifies the desktop layout.
 */
export function SideNavBar({ open, onClose }: SideNavBarProps) {
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
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-brand-navy-light bg-brand-navy pt-[73px] transition-transform lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <button
          onClick={onClose}
          aria-label="Close navigation"
          className="self-end pt-4 pr-4 text-white/70 hover:text-white lg:hidden"
        >
          <DynamicIcon name="X" className="size-5" />
        </button>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto pt-6" aria-label="Primary">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.id} item={item} active={pathname === item.href} />
          ))}
        </nav>

        <div className="flex flex-col gap-1 border-t border-brand-navy-light pt-2 pb-2">
          {NAV_SECONDARY_ITEMS.map((item) => (
            <NavLink key={item.id} item={item} active={pathname === item.href} />
          ))}
        </div>

        <div className="flex flex-col gap-6 p-4">
          <Button variant="gold" className="w-full">
            <DynamicIcon name="Plus" className="size-5" />
            <span>List a Property</span>
          </Button>

          <div
            className="flex flex-col gap-2 rounded-xl border border-brand-navy-light p-4"
            style={{ backgroundImage: "linear-gradient(146deg, #2f486a 0%, #001f3f 100%)" }}
          >
            <p className="font-heading text-xs tracking-[1.2px] text-brand-gold uppercase">
              Grow with Festari
            </p>
            <p className="text-xs text-white/70">Invite friends and earn premium rewards.</p>
            <div className="flex items-center gap-2 pt-2">
              <button className="rounded px-4 py-1.5 text-xs font-semibold text-brand-navy bg-white">
                Invite Now
              </button>
              <div className="flex items-center">
                <span className="size-6 rounded-full border-2 border-brand-navy bg-muted" />
                <span className="-ml-2 size-6 rounded-full border-2 border-brand-navy bg-brand-gold" />
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
