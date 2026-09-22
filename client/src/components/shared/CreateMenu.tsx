"use client";

import Image from "next/image";
import Link from "next/link";
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
        icon: "/icons/create-menu-building.svg",
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
        icon: "/icons/create-menu-calendar-date.svg",
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
    <div className="flex w-[300px] flex-col gap-2 rounded-3xl bg-white p-4 shadow-[0px_20px_66px_rgba(34,48,73,0.2)]">
      {SECTIONS.map((section) => (
        <div key={section.title} className="flex w-full flex-col gap-2">
          <p className="text-sm font-semibold tracking-[-0.42px] text-night-900">{section.title}</p>
          <div className="flex w-full flex-col items-start">
            {section.items.map((item, index) => (
              <Link
                key={item.key}
                href={comingSoonHref(item.label)}
                onClick={onNavigate}
                className={
                  section.divider && index === section.items.length - 1
                    ? "flex w-full items-center gap-2 border-b border-gray-200 p-2"
                    : "flex w-full items-center gap-2 p-2 hover:bg-gray-50"
                }
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-brand-900 p-1">
                  <span className="relative block size-[18px]">
                    <Image src={item.icon} alt="" fill sizes="18px" />
                  </span>
                </span>
                <span className="flex min-w-0 flex-1 flex-col items-start">
                  <span className="w-full text-sm font-medium text-night-900">{item.label}</span>
                  <span className="w-full text-[11px] text-gray-500">{item.description}</span>
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
