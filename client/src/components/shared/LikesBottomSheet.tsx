"use client";

import Image from "next/image";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { useAnimatedSheet } from "@/hooks/useAnimatedSheet";

interface LikesBottomSheetProps {
  open: boolean;
  onClose: () => void;
  names: string[];
}

/** The mobile bottom sheet opened from a post's "Liked by X and N others"
 * row, listing everyone who liked the post. */
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
    <div
      className="fixed inset-0 z-[130] flex items-end bg-black/50"
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
    </div>,
    document.body,
  );
}
