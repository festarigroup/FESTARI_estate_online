"use client";

import Image from "next/image";
import Link from "next/link";
import { comingSoonHref } from "@/lib/coming-soon";
import { cn } from "@/lib/utils";

interface CreateMenuItem {
  key: string;
  icon: string;
  iconSize?: number;
  label: string;
  locked?: boolean;
  highlighted?: boolean;
}

interface CreateMenuSection {
  items: CreateMenuItem[];
  divider?: boolean;
}

const SECTIONS: CreateMenuSection[] = [
  {
    divider: true,
    items: [{ key: "post", icon: "/icons/create-menu2-add-alt.svg", label: "Create post", highlighted: true }],
  },
  {
    divider: true,
    items: [
      { key: "property", icon: "/icons/create-menu2-building.svg", label: "List property", locked: true },
      { key: "stay", icon: "/icons/create-menu2-guest-house.svg", label: "Add stay", locked: true },
      { key: "service", icon: "/icons/create-menu2-map-pin.svg", label: "Offer a service", locked: true },
      { key: "project", icon: "/icons/create-menu2-briefcase.svg", label: "Post project", locked: true },
    ],
  },
  {
    divider: true,
    items: [
      { key: "event", icon: "/icons/create-menu2-calendar-date.svg", label: "Create events" },
      { key: "community", icon: "/icons/create-menu2-user-group.svg", label: "Create community" },
    ],
  },
  {
    items: [{ key: "request", icon: "/icons/create-menu2-help-circle.svg", label: "Post a request", iconSize: 18 }],
  },
];

export function CreateMenu({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div className="flex w-[240px] flex-col gap-2 rounded-3xl border border-gray-200 bg-white p-2 shadow-[0px_0px_20px_rgba(69,71,69,0.15)]">
      {SECTIONS.map((section, sectionIndex) => (
        <div
          key={sectionIndex}
          className={cn(
            "flex w-full flex-col items-start gap-1",
            section.divider && "border-b border-gray-200 pb-2",
          )}
        >
          {section.items.map((item) => (
            <Link
              key={item.key}
              href={comingSoonHref(item.label)}
              onClick={onNavigate}
              className={cn(
                "flex h-8 w-full items-center gap-2 rounded-2xl px-2",
                item.highlighted ? "bg-[#e2edff]" : "hover:bg-gray-50",
              )}
            >
              <span className="relative block shrink-0" style={{ width: item.iconSize ?? 12, height: item.iconSize ?? 12 }}>
                <Image src={item.icon} alt="" fill sizes={`${item.iconSize ?? 12}px`} />
              </span>
              <span className={cn("flex-1 truncate text-sm", item.highlighted ? "text-brand-900" : "text-gray-500")}>
                {item.label}
              </span>
              {item.locked && (
                <span className="relative block size-[7px] shrink-0">
                  <Image src="/icons/create-menu2-lock-key.svg" alt="" fill sizes="7px" />
                </span>
              )}
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
}
