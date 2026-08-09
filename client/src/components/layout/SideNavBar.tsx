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
}

/**
 * Persistent left navigation ("Aside - SideNavBar" in Figma). Fixed under the
 * header on desktop; slides in as an overlay drawer on mobile/tablet, since
 * the Figma file only specifies the desktop layout.
 *
 * The brand header only renders here below `lg` — on desktop the logo stays
 * in TopNavBar's top-left corner (this aside starts below it via
 * `lg:pt-[73px]`), but the mobile drawer is a self-contained overlay with no
 * padding to spare, so it carries its own logo instead of leaving TopNavBar's
 * to sit above a drawer that no longer has a gap for it. That's also why
 * this aside's z-index sits above TopNavBar's (z-50) *below* `lg` only —
 * without that, the drawer's own header would render underneath it, not
 * over it. Above `lg` it drops back to z-40: this aside's background spans
 * its full height regardless of the padding, so staying above TopNavBar on
 * desktop too would paint over its logo with plain navy instead of leaving
 * it visible in the gap the padding creates.
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
          // z-[55] (above TopNavBar's z-50) only below lg, where this
          // aside's own logo header needs to sit over TopNavBar's — not on
          // desktop, where this aside's *background* would otherwise paint
          // over TopNavBar's actual logo despite having no content of its
          // own in that corner (lg:pt-[73px] leaves it empty on purpose).
          "fixed inset-y-0 left-0 z-[55] flex w-64 flex-col border-r border-brand-navy-light bg-brand-navy transition-transform lg:z-40 lg:translate-x-0 lg:pt-[73px]",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between px-4 pt-4 pb-2 lg:hidden">
          <Link href="/" onClick={onClose} className="flex items-center gap-2">
            <Image src="/images/logo-festari.png" alt="" width={31} height={40} className="h-9 w-auto" />
            <span className="font-display text-base font-bold tracking-[-0.5px] text-white">Festari Estates</span>
          </Link>
          <button onClick={onClose} aria-label="Close navigation" className="text-white/70 hover:text-white">
            <DynamicIcon name="X" className="size-5" />
          </button>
        </div>

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
      </aside>
    </>
  );
}
