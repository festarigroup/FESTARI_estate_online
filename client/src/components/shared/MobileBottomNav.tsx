"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/components/shared/nav-items";

interface MobileBottomNavProps {
  activeKey?: string;
}

export function MobileBottomNav({ activeKey = "feed" }: MobileBottomNavProps) {
  return (
    <nav
      aria-label="Primary navigation"
      className="no-scrollbar flex h-[61px] w-full shrink-0 items-center justify-between gap-1 overflow-x-auto border-t border-gray-200 bg-white px-2 lg:hidden"
    >
      {NAV_ITEMS.map((item) => {
        const isActive = item.key === activeKey;
        return (
          <Link
            key={item.key}
            href={item.href}
            onClick={(event) => {
              if (item.href === "#") event.preventDefault();
            }}
            className={cn(
              "flex min-w-14 flex-1 flex-col items-center justify-center gap-1 rounded-lg py-1.5 text-[9.5px] font-medium",
              isActive ? "text-brand-600" : "text-night-700",
            )}
          >
            <span className="relative block size-[19px] shrink-0">
              <Image src={item.icon} alt="" fill sizes="19px" />
            </span>
            <span className="whitespace-nowrap">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
