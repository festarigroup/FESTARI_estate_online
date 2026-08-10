"use client";

import toast from "react-hot-toast";
import { Avatar } from "@/components/ui/Avatar";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { cn } from "@/lib/cn";

const MEMBER_AVATARS = [
  "/images/avatar-dee-interiors-follow.png",
  "/images/avatar-kojo-mensah-follow.png",
  "/images/avatar-builders-gh-follow.png",
];

/** "Community Banner" at the bottom of the Stay feed column (Figma node
 * 3384:8477) — a promo for a communities feature that doesn't exist yet
 * anywhere else in this app, so "Explore Communities" just acknowledges
 * that rather than linking somewhere real. */
export function StayCommunityBanner() {
  return (
    <div className="relative flex items-center justify-between overflow-hidden rounded-[19px] bg-brand-navy p-6 lg:rounded-[24px]">
      <div
        className="pointer-events-none absolute -top-10 -right-10 size-40 rounded-full bg-brand-gold/10 blur-3xl"
        aria-hidden
      />
      <div className="relative flex flex-col items-start gap-2">
        <div className="flex items-center gap-3">
          <DynamicIcon name="Users" className="size-5 text-white" />
          <p className="font-heading text-base text-white">Join communities. Share, learn &amp; grow together.</p>
        </div>
        <button
          onClick={() => toast.success("Communities are coming soon — we'll let you know when they're live.")}
          className="flex items-center gap-2 rounded-full bg-white px-6 py-2 text-sm text-brand-navy"
        >
          Explore Communities
          <DynamicIcon name="ChevronRight" className="size-3" />
        </button>
      </div>
      <div className="relative hidden items-center gap-4 sm:flex">
        <div className="flex items-center">
          {MEMBER_AVATARS.map((avatar, i) => (
            <Avatar
              key={avatar}
              src={avatar}
              alt=""
              size={40}
              className={cn("border-2 border-brand-navy", i > 0 && "-ml-3")}
            />
          ))}
        </div>
        <span className="text-sm font-medium text-white">+2.3K members</span>
      </div>
    </div>
  );
}
