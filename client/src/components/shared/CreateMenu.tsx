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

interface DesktopSubmenuItem {
  key: string;
  icon: string;
  label: string;
}

interface DesktopMenuItem {
  key: string;
  icon: string;
  label: string;
  locked?: boolean;
  highlighted?: boolean;
  submenu?: DesktopSubmenuItem[];
}

interface DesktopMenuSection {
  title?: string;
  items: DesktopMenuItem[];
  divider?: boolean;
}

const DESKTOP_SHARE_SECTION: DesktopMenuSection = {
  title: "Share",
  items: [
    {
      key: "post",
      icon: "/icons/create-menu-dt-add-alt.svg",
      label: "Create Post",
      highlighted: true,
      submenu: [
        { key: "video", icon: "/icons/video-01.svg", label: "Video post" },
        { key: "image", icon: "/icons/image-01.svg", label: "Image post" },
      ],
    },
  ],
};

const DESKTOP_LIST_SECTIONS: DesktopMenuSection[] = [
  {
    divider: true,
    items: [
      { key: "property", icon: "/icons/building-03.svg", label: "List Property", locked: true },
      { key: "stay", icon: "/icons/create-menu-dt-guest-house.svg", label: "Add Stay", locked: true },
      { key: "service", icon: "/icons/create-menu-dt-map-pin.svg", label: "Offer a Service", locked: true },
      { key: "project", icon: "/icons/create-menu-dt-briefcase.svg", label: "Post Project", locked: true },
    ],
  },
  {
    divider: true,
    items: [
      { key: "event", icon: "/icons/create-menu-calendar-17.svg", label: "Create Events" },
      { key: "community", icon: "/icons/create-menu-dt-user-group.svg", label: "Create Community" },
    ],
  },
  {
    items: [{ key: "request", icon: "/icons/create-menu-dt-help-circle.svg", label: "Post a Request" }],
  },
];

function DesktopMenuRow({ item, onNavigate }: { item: DesktopMenuItem; onNavigate: () => void }) {
  return (
    <div className={cn("relative w-full", item.submenu && "group")}>
      <Link
        href={comingSoonHref(item.label)}
        onClick={onNavigate}
        className={cn(
          "flex h-8 w-full items-center gap-2 rounded-xl px-2",
          item.highlighted ? "border-b border-gray-200 bg-[#e2edff]" : "hover:bg-white",
        )}
      >
        <NavIcon
          icon={item.icon}
          color="night"
          size={14}
          className={cn("shrink-0", item.highlighted && "bg-brand-900")}
        />
        <span
          className={cn(
            "flex-1 truncate text-sm",
            item.highlighted ? "font-medium text-brand-900" : "text-night-700",
          )}
        >
          {item.label}
        </span>
        {item.locked && (
          <span className="relative block size-2.5 shrink-0">
            <Image src="/icons/create-menu2-lock-key.svg" alt="" fill sizes="10px" />
          </span>
        )}
      </Link>

      {item.submenu && (
        <div className="absolute left-full top-0 z-10 ml-2 hidden w-36 flex-col gap-1 rounded-2xl border border-gray-200 bg-white p-2 shadow-lg group-hover:flex">
          {item.submenu.map((sub) => (
            <Link
              key={sub.key}
              href={comingSoonHref(sub.label)}
              onClick={onNavigate}
              className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-gray-50"
            >
              <span className="relative block size-4 shrink-0">
                <Image src={sub.icon} alt="" fill sizes="16px" />
              </span>
              <span className="text-[13px] text-night-900">{sub.label}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

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

      <div className="hidden w-[280px] flex-col gap-2 rounded-[28px] border border-[rgba(226,232,240,0.8)] bg-gray-50 p-2 shadow-[0px_24px_60px_-15px_rgba(0,0,0,0.06)] sm:flex">
        <div className="flex w-full flex-col gap-1 rounded-2xl bg-white p-2">
          <div className="flex items-center gap-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.5px] text-gray-500">
              {DESKTOP_SHARE_SECTION.title}
            </p>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="text-gray-400">
              <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          {DESKTOP_SHARE_SECTION.items.map((item) => (
            <DesktopMenuRow key={item.key} item={item} onNavigate={onNavigate} />
          ))}
        </div>

        <div className="flex w-full flex-col gap-1.5 rounded-2xl bg-gray-100 p-2">
          {DESKTOP_LIST_SECTIONS.map((section, sectionIndex) => (
            <div
              key={sectionIndex}
              className={cn(
                "flex w-full flex-col items-start gap-0.5",
                section.divider && "border-b border-gray-200 pb-1.5",
              )}
            >
              {section.items.map((item) => (
                <DesktopMenuRow key={item.key} item={item} onNavigate={onNavigate} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
