"use client";

import Link from "next/link";
import { NavIcon } from "@/components/shared/NavIcon";
import { NAV_ITEMS } from "@/components/shared/nav-items";
import { cn } from "@/lib/utils";

const ALL_CHILDREN = NAV_ITEMS.flatMap((item) =>
  (item.children ?? []).map((child) => ({ ...child, parentKey: item.key })),
);

interface MobileNavGridProps {
  open: boolean;
  onClose: () => void;
  activeKey?: string;
  activeChildKey?: string;
}

/** The light/blue grid the bottom nav's menu button opens on mobile, listing
 * every nav category's sub-items flattened into one screen. */
export function MobileNavGrid({ open, onClose, activeKey, activeChildKey }: MobileNavGridProps) {
  if (!open) return null;

  return (
    <div className="fixed bottom-24 left-4 z-40 grid w-[320px] grid-cols-4 gap-4 rounded-[32px] border border-[#86b3fb] bg-white p-5 shadow-[0px_24px_48px_-12px_rgba(0,0,0,0.15)] lg:hidden">
      {ALL_CHILDREN.map((child) => {
        const isActive = child.parentKey === activeKey && child.key === activeChildKey;
        return (
          <Link
            key={`${child.parentKey}-${child.key}`}
            href={child.href}
            onClick={onClose}
            className="flex flex-col items-center gap-2"
          >
            <span
              className={cn(
                "flex size-14 items-center justify-center rounded-2xl border",
                isActive ? "border-brand-900 bg-[#f1f6ff]" : "border-gray-200 bg-white",
              )}
            >
              <NavIcon icon={child.icon} color={isActive ? "brand" : "night"} size={22} />
            </span>
            <span className="truncate text-[11px] font-medium text-night-900">{child.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
