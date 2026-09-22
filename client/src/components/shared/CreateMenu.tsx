"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { NavIcon } from "@/components/shared/NavIcon";
import { comingSoonHref } from "@/lib/coming-soon";
import { cn } from "@/lib/utils";

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
}

interface DesktopMenuSection {
  items: DesktopMenuItem[];
  divider?: boolean;
}

const CREATE_POST_ITEM = { key: "post", icon: "/icons/create-menu-dt-add-alt.svg", label: "Create Post" };
const CREATE_POST_SUBMENU: DesktopSubmenuItem[] = [
  { key: "video", icon: "/icons/video-01.svg", label: "Video Post" },
  { key: "image", icon: "/icons/image-01.svg", label: "Image Post" },
  { key: "poll", icon: "/icons/chart-02.svg", label: "Poll" },
  { key: "article", icon: "/icons/book-bookmark-01.svg", label: "Article" },
];

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
    <Link
      href={comingSoonHref(item.label)}
      onClick={onNavigate}
      className="flex h-8 w-full items-center gap-2 rounded-xl px-2 hover:bg-gray-100"
    >
      <NavIcon icon={item.icon} color="night" size={14} className="shrink-0" />
      <span className="flex-1 truncate text-sm text-night-700">{item.label}</span>
      {item.locked && (
        <NavIcon icon="/icons/create-menu2-lock-key.svg" color="night" size={10} className="shrink-0" />
      )}
    </Link>
  );
}

interface MobileMenuItem {
  key: string;
  icon: string;
  label: string;
  submenu?: DesktopSubmenuItem[];
  /** Render via <Image> as-is instead of NavIcon's color mask (the source SVG already has its own baked-in colors). */
  rawIcon?: boolean;
}

const LISTINGS_SUBMENU: DesktopSubmenuItem[] = [
  { key: "property", icon: "/icons/building-03.svg", label: "List Property" },
  { key: "stay", icon: "/icons/create-menu-dt-guest-house.svg", label: "Add Stay" },
  { key: "service", icon: "/icons/create-menu-dt-map-pin.svg", label: "Offer a Service" },
  { key: "project", icon: "/icons/create-menu-dt-briefcase.svg", label: "Post Project" },
];

const MOBILE_ITEMS: MobileMenuItem[] = [
  { key: "post", icon: "/icons/create-menu-mobile-add-alt.svg", label: "Create post", submenu: CREATE_POST_SUBMENU, rawIcon: true },
  { key: "listings", icon: "/icons/clipboard-list-01.svg", label: "Listings", submenu: LISTINGS_SUBMENU },
  { key: "event", icon: "/icons/create-menu-calendar-17.svg", label: "Create Event" },
  { key: "community", icon: "/icons/create-menu-dt-user-group.svg", label: "Create Community" },
];

const MOBILE_REQUEST_ITEM: MobileMenuItem = {
  key: "request",
  icon: "/icons/create-menu-dt-help-circle.svg",
  label: "Post a Request",
};

function MobileRowIcon({ item }: { item: MobileMenuItem }) {
  if (item.rawIcon) {
    return (
      <span className="relative block size-5 shrink-0">
        <Image src={item.icon} alt="" fill sizes="20px" />
      </span>
    );
  }
  return <NavIcon icon={item.icon} color="night" size={20} className="shrink-0" />;
}

function MobileMenuRow({ item, onNavigate }: { item: MobileMenuItem; onNavigate: () => void }) {
  const [open, setOpen] = useState(false);

  if (!item.submenu) {
    return (
      <Link
        href={comingSoonHref(item.label)}
        onClick={onNavigate}
        className="flex h-11 w-full items-center gap-3 rounded-xl px-1 hover:bg-gray-50"
      >
        <MobileRowIcon item={item} />
        <span className="flex-1 truncate text-[15px] font-medium text-night-900">{item.label}</span>
      </Link>
    );
  }

  return (
    <div className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex h-11 w-full items-center gap-3 rounded-xl px-1 text-left outline-none hover:bg-gray-50"
      >
        <MobileRowIcon item={item} />
        <span className="flex-1 truncate text-[15px] font-medium text-night-900">{item.label}</span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
          className={cn("shrink-0 text-gray-400 transition-transform", open && "rotate-90")}
        >
          <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-9 top-full z-10 mt-1 flex w-60 flex-col gap-0.5 rounded-2xl border border-gray-200 bg-white p-1.5 shadow-lg">
          {item.submenu.map((sub) => (
            <Link
              key={sub.key}
              href={comingSoonHref(sub.label)}
              onClick={onNavigate}
              className="flex items-center gap-3 rounded-lg p-2 hover:bg-gray-50"
            >
              <NavIcon icon={sub.icon} color="night" size={16} className="shrink-0" />
              <span className="text-sm text-night-900">{sub.label}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function CreatePostRow({ onNavigate }: { onNavigate: () => void }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex h-8 w-full items-center gap-2 rounded-xl border border-brand-900 px-2 text-left outline-none hover:bg-gray-100"
      >
        <NavIcon icon={CREATE_POST_ITEM.icon} color="night" size={14} className="shrink-0 bg-brand-900" />
        <span className="flex-1 truncate text-sm font-medium text-night-900">{CREATE_POST_ITEM.label}</span>
        <NavIcon icon="/icons/more-horizontal.svg" color="night" size={16} className="shrink-0" />
      </button>

      {open && (
        <div className="absolute left-1/2 top-full z-10 mt-2 flex w-56 flex-col gap-1 rounded-2xl border border-gray-200 bg-white p-2 shadow-lg">
          {CREATE_POST_SUBMENU.map((sub) => (
            <Link
              key={sub.key}
              href={comingSoonHref(sub.label)}
              onClick={onNavigate}
              className="flex items-center gap-3 rounded-lg p-2 hover:bg-gray-50"
            >
              <NavIcon icon={sub.icon} color="night" size={14} className="shrink-0" />
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
      <div className="flex w-60 flex-col gap-0.5 rounded-3xl border border-gray-200 bg-white p-2 shadow-[0px_20px_48px_-10px_rgba(0,0,0,0.12),0px_8px_20px_-6px_rgba(0,0,0,0.06)] sm:hidden">
        {MOBILE_ITEMS.map((item) => (
          <MobileMenuRow key={item.key} item={item} onNavigate={onNavigate} />
        ))}
        <div className="my-1 h-px w-full bg-gray-200" />
        <MobileMenuRow item={MOBILE_REQUEST_ITEM} onNavigate={onNavigate} />
      </div>

      <div className="hidden w-[300px] flex-col items-center gap-1.5 rounded-[28px] border border-[rgba(226,232,240,0.8)] bg-white/70 px-3 pb-3 pt-5 shadow-[0px_24px_60px_-15px_rgba(0,0,0,0.06)] backdrop-blur-xl backdrop-saturate-150 sm:flex">
        <div className="flex w-[270px] flex-col gap-1">
          <div className="flex items-center gap-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.5px] text-gray-500">Share</p>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="text-gray-400">
              <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <CreatePostRow onNavigate={onNavigate} />
        </div>

        <div className="flex w-[270px] flex-col gap-1.5 rounded-2xl border border-gray-200 bg-white p-1.5">
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
