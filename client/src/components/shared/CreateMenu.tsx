"use client";

import Image from "next/image";
import Link from "next/link";
import { NavIcon } from "@/components/shared/NavIcon";
import { comingSoonHref } from "@/lib/coming-soon";
import { cn } from "@/lib/utils";

interface MobileMenuItem {
  key: string;
  icon: string;
  iconSize?: number;
  label: string;
  locked?: boolean;
  highlighted?: boolean;
  flip?: boolean;
}

interface MobileMenuSection {
  items: MobileMenuItem[];
  divider?: boolean;
}

const MOBILE_SECTIONS: MobileMenuSection[] = [
  {
    items: [{ key: "post", icon: "/icons/create-menu2-add-alt.svg", label: "Create post", highlighted: true }],
  },
  {
    divider: true,
    items: [
      { key: "property", icon: "/icons/create-menu2-building.svg", label: "List property", locked: true, flip: true },
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

interface DesktopMenuItem {
  key: string;
  icon: string;
  label: string;
  description: string;
  locked?: boolean;
  highlighted?: boolean;
}

interface DesktopMenuSection {
  title?: string;
  items: DesktopMenuItem[];
  divider?: boolean;
}

const DESKTOP_SECTIONS: DesktopMenuSection[] = [
  {
    items: [
      {
        key: "post",
        icon: "/icons/create-menu-dt-add-alt.svg",
        label: "Create Post",
        description: "Photo, video, poll or article",
        highlighted: true,
      },
    ],
  },
  {
    title: "List something",
    divider: true,
    items: [
      {
        key: "property",
        icon: "/icons/building-03.svg",
        label: "List Property",
        description: "Needs ownership or agency evidence",
        locked: true,
      },
      {
        key: "stay",
        icon: "/icons/create-menu-dt-guest-house.svg",
        label: "Add Stay",
        description: "Needs a verified business",
        locked: true,
      },
      {
        key: "service",
        icon: "/icons/create-menu-dt-map-pin.svg",
        label: "Offer a Service",
        description: "Needs Professional or Artisan capabilities",
        locked: true,
      },
      {
        key: "project",
        icon: "/icons/create-menu-dt-briefcase.svg",
        label: "Post Project",
        description: "Needs developer verification",
        locked: true,
      },
    ],
  },
  {
    title: "Bring people together",
    divider: true,
    items: [
      {
        key: "event",
        icon: "/icons/create-menu-calendar-17.svg",
        label: "Create Events",
        description: "open house, tour or meeting",
      },
      {
        key: "community",
        icon: "/icons/create-menu-dt-user-group.svg",
        label: "Create Community",
        description: "Tied to an estate, project or area",
      },
    ],
  },
  {
    title: "Need something done",
    items: [
      {
        key: "request",
        icon: "/icons/create-menu-dt-help-circle.svg",
        label: "Post a Request",
        description: "Let providers come to you with quotes",
      },
    ],
  },
];

export function CreateMenu({ onNavigate }: { onNavigate: () => void }) {
  return (
    <>
      <div className="flex w-[240px] flex-col gap-2 rounded-3xl border border-gray-200 bg-white p-2 shadow-[0px_0px_20px_rgba(69,71,69,0.15)] sm:hidden">
        {MOBILE_SECTIONS.map((section, sectionIndex) => (
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
                <span
                  className={cn("relative block shrink-0", item.flip && "rotate-180 -scale-x-100")}
                  style={{ width: item.iconSize ?? 12, height: item.iconSize ?? 12 }}
                >
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

      <div className="hidden w-[300px] flex-col gap-1.5 rounded-[28px] border border-[rgba(226,232,240,0.8)] bg-white p-3 shadow-[0px_24px_60px_-15px_rgba(0,0,0,0.06)] sm:flex">
        {DESKTOP_SECTIONS.map((section, sectionIndex) => (
          <div key={sectionIndex} className="flex w-full flex-col gap-1">
            {section.title && (
              <p className="text-[13px] font-semibold leading-4 tracking-[-0.42px] text-night-900">{section.title}</p>
            )}
            <div
              className={cn(
                "flex w-full flex-col items-start gap-0.5",
                section.divider && "border-b border-gray-200 pb-1.5",
              )}
            >
              {section.items.map((item) => (
                <Link
                  key={item.key}
                  href={comingSoonHref(item.label)}
                  onClick={onNavigate}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-xl p-1.5",
                    item.highlighted
                      ? "border-b border-gray-200 bg-[#e2edff]"
                      : "hover:bg-gray-50",
                  )}
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand-900 p-1">
                    <NavIcon icon={item.icon} color="white" size={16} />
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col items-start">
                    <span className="w-full text-[13px] font-medium leading-4 text-night-900">{item.label}</span>
                    <span className="w-full truncate text-[10px] leading-3 text-gray-500">{item.description}</span>
                  </span>
                  {item.locked && (
                    <span className="relative block size-2.5 shrink-0">
                      <Image src="/icons/create-menu-dt-lock-key.svg" alt="" fill sizes="10px" />
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
