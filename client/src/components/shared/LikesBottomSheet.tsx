"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { FollowButton } from "@/components/shared/FollowButton";
import { cn } from "@/lib/utils";
import { useAnimatedSheet } from "@/hooks/useAnimatedSheet";

interface LikesBottomSheetProps {
  open: boolean;
  onClose: () => void;
  names: string[];
}

/** Opened from a post's "Liked by X and N others" row: a bottom sheet on
 * mobile, and a centered All/Followers modal with Follow/Following actions
 * on desktop (Figma node 539:81165). */
export function LikesBottomSheet({ open, onClose, names }: LikesBottomSheetProps) {
  const { mounted, closing } = useAnimatedSheet(open);

  useEffect(() => {
    if (!mounted) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mounted]);

  if (!mounted) return null;

  return createPortal(
    <>
      <div
        className="fixed inset-0 z-[130] flex items-end bg-black/50 sm:hidden"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label="Likes"
      >
        <div
          onClick={(event) => event.stopPropagation()}
          className={cn(
            "flex max-h-[75vh] w-full flex-col gap-4 rounded-t-[32px] bg-white pb-4 pt-4 shadow-[0px_-4px_8px_0px_rgba(69,71,69,0.15)]",
            closing ? "animate-sheet-slide-down" : "animate-sheet-slide-up",
          )}
        >
          <div className="h-[3px] w-[152px] shrink-0 self-center rounded-[20px] bg-[#334154]" />

          <div className="flex w-full shrink-0 items-center gap-2.5 px-6">
            <p className="flex-1 text-center text-lg font-bold tracking-[-0.54px] text-black">
              {names.length} {names.length === 1 ? "Like" : "Likes"}
            </p>
            <button
              type="button"
              aria-label="Close"
              onClick={onClose}
              className="absolute right-6 flex size-6 shrink-0 items-center justify-center"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M19 12H5M5 12L12 5M5 12L12 19" stroke="#141b34" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          <div className="flex w-full flex-col overflow-y-auto px-6">
            {names.map((name, index) => (
              <div key={`${name}-${index}`} className="flex w-full items-center gap-3 border-b border-[#f1f5f9] py-2.5 last:border-b-0">
                <span className="relative block size-9 shrink-0 overflow-hidden rounded-full bg-[#eef2ff]">
                  <Image src="/icons/avatar-placeholder-user.svg" alt="" fill sizes="36px" className="p-1.5" />
                </span>
                <p className="truncate text-sm font-semibold text-[#111826]">{name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        className="fixed inset-0 z-[130] hidden items-center justify-center bg-black/50 p-4 sm:flex"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label="Likes"
      >
        <div onClick={(event) => event.stopPropagation()} className="relative w-full max-w-[680px]">
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="absolute -right-3 -top-3 z-10 flex size-7 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-md hover:bg-gray-50"
          >
            <svg width="9" height="9" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M1 1L11 11M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>

          <LikesTabbedList names={names} />
        </div>
      </div>
    </>,
    document.body,
  );
}

function LikesTabbedList({ names }: { names: string[] }) {
  const [tab, setTab] = useState<"all" | "followers">("all");
  const [following, setFollowing] = useState<Record<number, boolean>>(() =>
    Object.fromEntries(names.map((_, index) => [index, index % 3 === 0])),
  );

  // Mock split for the "Followers" tab, since there's no real follow-graph
  // backing this data yet — every third liker stands in as a follower.
  const rows = names
    .map((name, index) => ({ name, index, isFollower: index % 3 !== 1 }))
    .filter((row) => tab === "all" || row.isFollower);

  return (
    <div className="flex max-h-[85vh] w-full flex-col gap-4 overflow-y-auto overflow-x-hidden rounded-2xl bg-white px-4 py-6 shadow-[0px_24px_60px_-15px_rgba(0,0,0,0.15)]">
      <div className="flex w-full gap-4 border-b border-[#ebebeb]">
        {(["all", "followers"] as const).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={cn(
              "flex flex-col items-center gap-1.5 px-1 pb-0 text-sm capitalize",
              tab === key ? "text-brand-900" : "text-[#64748a]",
            )}
          >
            {key}
            <span className={cn("h-0.5 w-full rounded-full", tab === key ? "bg-brand-900" : "bg-transparent")} />
          </button>
        ))}
      </div>

      <div className="flex w-full flex-col">
        {rows.map(({ name, index }) => (
          <div key={`${name}-${index}`} className="flex h-10 w-full items-center justify-between border-b border-[#f1f5f9] last:border-b-0">
            <span className="flex items-center gap-1.5">
              <span className="relative block size-8 shrink-0 overflow-hidden rounded-full bg-[#eef2ff]">
                <Image src="/icons/avatar-placeholder-user.svg" alt="" fill sizes="32px" className="p-1" />
              </span>
              <span className="truncate text-sm font-medium text-[#111826]">{name}</span>
            </span>
            <FollowButton
              following={following[index] ?? false}
              onToggle={() => setFollowing((current) => ({ ...current, [index]: !current[index] }))}
              name={name}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
