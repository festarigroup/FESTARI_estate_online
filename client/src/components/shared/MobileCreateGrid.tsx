"use client";

import Link from "next/link";
import { NavIcon } from "@/components/shared/NavIcon";
import { comingSoonHref } from "@/lib/coming-soon";
import { cn } from "@/lib/utils";

type PostModalType = "media" | "poll" | "article";

interface GridAction {
  key: string;
  icon: string;
  label: string;
  postModalType?: PostModalType;
}

const GRID_ACTIONS: GridAction[] = [
  { key: "media", icon: "/icons/image-01.svg", label: "Media", postModalType: "media" },
  { key: "poll", icon: "/icons/chart-02.svg", label: "Poll", postModalType: "poll" },
  { key: "article", icon: "/icons/book-bookmark-01.svg", label: "Article", postModalType: "article" },
  { key: "property", icon: "/icons/building-03.svg", label: "Property" },
  { key: "stay", icon: "/icons/create-menu-dt-guest-house.svg", label: "Stay" },
  { key: "service", icon: "/icons/create-menu-dt-map-pin.svg", label: "Service" },
  { key: "project", icon: "/icons/create-menu-dt-briefcase.svg", label: "Project" },
  { key: "events", icon: "/icons/create-menu-calendar-17.svg", label: "Events" },
];

interface MobileCreateGridProps {
  open: boolean;
  onClose: () => void;
  onOpenPostModal: (type: PostModalType) => void;
}

/** The dark icon-grid the bottom nav's "+" button morphs into on mobile,
 * replacing the outer post-type composer menu (reference: Pinterest
 * "expandable tab bar" clip provided by the user). */
export function MobileCreateGrid({ open, onClose, onOpenPostModal }: MobileCreateGridProps) {
  if (!open) return null;

  return (
    <div
      className={cn(
        "fixed inset-x-4 bottom-24 z-40 grid grid-cols-4 gap-3 rounded-[32px] bg-[#171717] p-4 shadow-[0px_24px_48px_-12px_rgba(0,0,0,0.4)] lg:hidden",
        "animate-sheet-slide-up",
      )}
    >
      {GRID_ACTIONS.map((action) => {
        const content = (
          <>
            <span className="flex size-12 items-center justify-center rounded-2xl bg-white/10">
              <NavIcon icon={action.icon} color="white" size={20} />
            </span>
            <span className="truncate text-[11px] font-medium text-white">{action.label}</span>
          </>
        );

        return action.postModalType ? (
          <button
            key={action.key}
            type="button"
            onClick={() => {
              onOpenPostModal(action.postModalType!);
              onClose();
            }}
            className="flex flex-col items-center gap-1.5"
          >
            {content}
          </button>
        ) : (
          <Link key={action.key} href={comingSoonHref(action.label)} onClick={onClose} className="flex flex-col items-center gap-1.5">
            {content}
          </Link>
        );
      })}
    </div>
  );
}
