"use client";

import Link from "next/link";
import { NavIcon } from "@/components/shared/NavIcon";
import { NAV_ITEMS } from "@/components/shared/nav-items";

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
    <div className="fixed bottom-4 left-16 z-40 grid aspect-square w-64 grid-cols-4 content-center gap-x-2 gap-y-3 rounded-[32px] border-2 border-white bg-[#e6e6e6] p-4 shadow-[0px_24px_48px_-12px_rgba(0,0,0,0.25)] lg:hidden">
      {ALL_CHILDREN.map((child) => {
        const isActive = child.parentKey === activeKey && child.key === activeChildKey;
        return (
          <Link
            key={`${child.parentKey}-${child.key}`}
            href={child.href}
            onClick={onClose}
            className="flex flex-col items-center gap-1"
          >
            <span className="flex size-10 items-center justify-center rounded-2xl bg-white">
              <NavIcon icon={child.icon} color={isActive ? "brand" : "night"} size={16} />
            </span>
            <span className="w-full truncate text-center text-[9px] font-medium text-night-900">{child.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
