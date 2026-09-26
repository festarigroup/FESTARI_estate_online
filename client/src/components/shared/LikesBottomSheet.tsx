"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { FollowButton } from "@/components/shared/FollowButton";
import { NavIcon } from "@/components/shared/NavIcon";
import { Tooltip } from "@/components/shared/Tooltip";
import { cn } from "@/lib/utils";
import { useAnimatedSheet } from "@/hooks/useAnimatedSheet";

interface LikesBottomSheetProps {
  open: boolean;
  onClose: () => void;
  names: string[];
}

/** Opened from a post's "Liked by X and N others" row: a bottom sheet on
 * mobile, and a centered All/Followers modal with Follow/Following actions
 * on desktop (Figma node 539:81165). Both variants share the same
 * All/Followers list, with its tabs pinned to the top of the scroll area. */
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
            "flex max-h-[75vh] w-full flex-col gap-2 rounded-t-[32px] bg-white pb-4 pt-4 shadow-[0px_-4px_8px_0px_rgba(69,71,69,0.15)]",
            closing ? "animate-sheet-slide-down" : "animate-sheet-slide-up",
          )}
        >
          <div className="h-[3px] w-[152px] shrink-0 self-center rounded-[20px] bg-[#334154]" />

          <div className="flex w-full shrink-0 items-center gap-2.5 px-6">
            <button
              type="button"
              aria-label="Close"
              onClick={onClose}
              className="flex size-6 shrink-0 items-center justify-center text-night-900"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M10 4V16M10 16L4 10M10 16L16 10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <p className="flex-1 text-center text-lg font-bold tracking-[-0.54px] text-black">
              {names.length} {names.length === 1 ? "Like" : "Likes"}
            </p>
            <span className="size-6 shrink-0" aria-hidden />
          </div>

          <LikesTabbedList names={names} className="px-6" variant="sheet" />
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

          <div className="flex max-h-[85vh] w-full flex-col rounded-2xl bg-white/95 p-6 shadow-[0px_24px_60px_-15px_rgba(0,0,0,0.15)] backdrop-blur-[8px]">
            <LikesTabbedList names={names} variant="modal" />
          </div>
        </div>
      </div>
    </>,
    document.body,
  );
}

function LikesTabbedList({
  names,
  className,
  variant,
}: {
  names: string[];
  className?: string;
  variant: "sheet" | "modal";
}) {
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
    <div className={cn("no-scrollbar flex w-full flex-1 flex-col overflow-y-auto overflow-x-hidden", className)}>
      <div className="sticky top-0 z-10 flex w-full shrink-0 gap-4 border-b border-[#ebebeb] bg-white">
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

      <div className="flex w-full flex-col gap-2 pt-2">
        {rows.map(({ name, index }) => {
          const isFollowing = following[index] ?? false;
          const toggle = () => setFollowing((current) => ({ ...current, [index]: !current[index] }));

          return (
            <div
              key={`${name}-${index}`}
              className="flex h-14 w-full items-center justify-between gap-2 rounded-xl border border-[#e2e8f0] px-3"
            >
              <span className="flex min-w-0 items-center gap-2">
                {variant === "modal" && (
                  <span className="relative block size-8 shrink-0 overflow-hidden rounded-full bg-[#eef2ff]">
                    <Image src="/icons/avatar-placeholder-user.svg" alt="" fill sizes="32px" className="p-1" />
                  </span>
                )}
                <span className="truncate text-sm font-medium text-[#111826]">{name}</span>
              </span>

              {variant === "sheet" ? (
                <Tooltip label={isFollowing ? "Following" : "Follow"}>
                  <button
                    type="button"
                    aria-pressed={isFollowing}
                    aria-label={isFollowing ? `Following ${name}` : `Follow ${name}`}
                    onClick={toggle}
                    className={cn(
                      "flex size-8 shrink-0 items-center justify-center rounded-full border",
                      isFollowing ? "border-brand-900 bg-brand-900" : "border-brand-900 bg-white",
                    )}
                  >
                    <NavIcon
                      icon={isFollowing ? "/icons/check-circle.svg" : "/icons/user-add-01.svg"}
                      color={isFollowing ? "white" : "brand"}
                      size={16}
                    />
                  </button>
                </Tooltip>
              ) : (
                <FollowButton following={isFollowing} onToggle={toggle} name={name} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
