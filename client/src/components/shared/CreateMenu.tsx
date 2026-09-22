"use client";

import Image from "next/image";
import Link from "next/link";
import { NavIcon } from "@/components/shared/NavIcon";
import { comingSoonHref } from "@/lib/coming-soon";

interface CreateMenuItem {
  key: string;
  icon: string;
  label: string;
  description: string;
  locked?: boolean;
}

interface CreateMenuSection {
  title: string;
  items: CreateMenuItem[];
  divider?: boolean;
}

const SECTIONS: CreateMenuSection[] = [
  {
    title: "Share",
    divider: true,
    items: [
      { key: "post", icon: "/icons/create-menu-add-alt.svg", label: "Create Post", description: "Photo, video, poll or article" },
    ],
  },
  {
    title: "List something",
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
        icon: "/icons/create-menu-guest-house.svg",
        label: "Add Stay",
        description: "Needs a verified business",
        locked: true,
      },
      {
        key: "service",
        icon: "/icons/create-menu-map-pin.svg",
        label: "Offer a Service",
        description: "Needs Professional or Artisan capabilities",
        locked: true,
      },
      {
        key: "project",
        icon: "/icons/create-menu-briefcase.svg",
        label: "Post Project",
        description: "Needs developer verification",
        locked: true,
      },
    ],
  },
  {
    title: "Bring people together",
    items: [
      {
        key: "event",
        icon: "/icons/create-menu-calendar-17.svg",
        label: "Create Events",
        description: "open house, tour or meeting",
      },
      {
        key: "community",
        icon: "/icons/create-menu-user-group.svg",
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
        icon: "/icons/create-menu-help-circle.svg",
        label: "Post a Request",
        description: "Let providers come to you with quotes",
      },
    ],
  },
];

export function CreateMenu({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div className="flex w-[320px] flex-col gap-1.5 rounded-2xl bg-white p-3 shadow-[0px_20px_66px_rgba(34,48,73,0.2)]">
      {SECTIONS.map((section) => (
        <div key={section.title} className="flex w-full flex-col gap-1">
          <p className="text-sm font-semibold tracking-[-0.42px] text-night-900">{section.title}</p>
          <div className="flex w-full flex-col items-start">
            {section.items.map((item, index) => (
              <Link
                key={item.key}
                href={comingSoonHref(item.label)}
                onClick={onNavigate}
                className={
                  section.divider && index === section.items.length - 1
                    ? "flex w-full items-center gap-2 rounded-xl border-b border-gray-200 px-2 py-1.5 hover:bg-[#e2edff]"
                    : "flex w-full items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-[#e2edff]"
                }
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-brand-900 p-1">
                  <NavIcon icon={item.icon} color="white" size={17} />
                </span>
                <span className="flex min-w-0 flex-1 flex-col items-start">
                  <span className="w-full text-[13px] font-medium leading-5 text-night-900">{item.label}</span>
                  <span className="w-full truncate text-[11px] leading-[15px] text-gray-500">{item.description}</span>
                </span>
                {item.locked && (
                  <span className="relative block size-3.5 shrink-0">
                    <Image src="/icons/create-menu-lock-key.svg" alt="" fill sizes="14px" />
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
