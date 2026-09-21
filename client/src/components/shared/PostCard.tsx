"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export type PostActionVariant = "primary" | "outline" | "outline-brand";

export interface PostAction {
  label: string;
  variant: PostActionVariant;
}

export interface PollOption {
  label: string;
  percent: number;
  votes: string;
  leading?: boolean;
}

export interface PostCardData {
  id: string;
  variant?: "text" | "poll" | "property" | "stay" | "project" | "artisan";
  authorName: string;
  roleLine: string;
  postedAt: string;
  avatar: string;
  avatarPlaceholder?: boolean;
  verified?: boolean;
  text?: string;
  truncated?: boolean;
  image?: string;
  likes: number;
  comments: number;
  shareLabel?: string;
  showComposer?: boolean;
  // poll
  participantAvatars?: string[];
  question?: string;
  hashtags?: string;
  pollOptions?: PollOption[];
  pollFooter?: string;
  // property / stay
  priceLine?: string;
  priceSuffix?: string;
  subLine?: string;
  beds?: number;
  baths?: number;
  rating?: string;
  actions?: PostAction[];
  messageHostLabel?: string;
}

interface PostCardProps {
  post: PostCardData;
  currentUserAvatarInitials?: string;
}

export function PostCard({ post, currentUserAvatarInitials = "SL" }: PostCardProps) {
  return (
    <article className="flex w-full flex-col gap-[15px] rounded-[15px] border border-gray-200 bg-white p-[15px]">
      <PostHeader post={post} />

      <div className="h-px w-full bg-gray-200" />

      {post.variant === "poll" ? (
        <PollBody post={post} />
      ) : (
        <>
          {post.text && (
            <div className="flex w-full items-center gap-0.5 text-sm leading-5">
              <p className="min-w-0 flex-1 truncate text-[#1e293b]">{post.text}</p>
              {post.truncated !== false && (
                <button type="button" className="shrink-0 font-bold text-gray-400">
                  more
                </button>
              )}
            </div>
          )}

          {post.image && <ImageCarousel image={post.image} />}

          {(post.priceLine || post.actions) && <div className="h-px w-full bg-gray-200" />}

          {post.priceLine && <PriceRow post={post} />}

          {post.actions && <ActionsRow post={post} />}
        </>
      )}

      <div className="h-px w-full bg-gray-200" />

      <PostStatsBar post={post} />

      {post.showComposer && (
        <div className="flex w-full items-center gap-2 rounded-3xl bg-gray-100 p-2">
          <span className="flex size-[38px] shrink-0 items-center justify-center rounded-full bg-[#eef2ff] text-[13px] font-extrabold text-[#4f46e5]">
            {currentUserAvatarInitials}
          </span>
          <input
            type="text"
            placeholder="Add a comment"
            className="min-w-0 flex-1 bg-transparent text-[11px] text-night-900/70 placeholder:text-night-900/40 focus:outline-none"
          />
          <button type="button" aria-label="Send comment" className="relative block size-[23px] shrink-0">
            <Image src="/icons/send-alt-filled.svg" alt="" fill sizes="23px" />
          </button>
        </div>
      )}
    </article>
  );
}

function PostHeader({ post }: { post: PostCardData }) {
  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "relative block size-[46px] shrink-0 overflow-hidden rounded-full",
            post.avatarPlaceholder && "flex items-center justify-center bg-[#eef2ff]",
          )}
        >
          {post.avatarPlaceholder ? (
            <span className="relative block size-[27px]">
              <Image src="/icons/avatar-placeholder-user.svg" alt="" fill sizes="27px" />
            </span>
          ) : (
            <Image src={post.avatar} alt={post.authorName} fill className="object-cover" sizes="46px" />
          )}
          {post.verified && (
            <span className="absolute -bottom-0.5 -right-0.5 block size-[17px]">
              <Image src="/icons/avatar-verified-badge.svg" alt="" fill sizes="17px" />
            </span>
          )}
        </span>
        <div className="flex flex-col items-start whitespace-nowrap">
          <p className="text-[13px] font-bold text-brand-900">{post.authorName}</p>
          <p className="text-[9.5px] text-gray-500">
            {post.roleLine} <span className="font-medium">{post.postedAt}</span>
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        {post.variant !== "poll" && (
          <button
            type="button"
            className="flex h-[38px] w-[81px] items-center justify-center rounded-lg border border-brand-900 px-[15px] py-2 text-[13px] text-brand-900"
          >
            Follow
          </button>
        )}
        <span className="relative block size-[23px] shrink-0">
          <Image src="/icons/menu-03.svg" alt="Post options" fill sizes="23px" />
        </span>
      </div>
    </div>
  );
}

function ImageCarousel({ image }: { image: string }) {
  return (
    <div className="relative h-[285px] w-full overflow-hidden rounded-[15px]">
      <Image src={image} alt="" fill className="object-cover" sizes="770px" />

      <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 items-center justify-between px-4">
        <button
          type="button"
          aria-label="Previous image"
          className="flex size-[27px] items-center justify-center rounded-full bg-white shadow-[0px_0px_10px_rgba(69,71,69,0.25)]"
        >
          <span className="relative block h-4 w-[7.5px] rotate-180">
            <Image src="/icons/carousel-arrow.svg" alt="" fill sizes="8px" />
          </span>
        </button>
        <button
          type="button"
          aria-label="Next image"
          className="flex size-[27px] items-center justify-center rounded-full bg-white shadow-[0px_0px_10px_rgba(69,71,69,0.25)]"
        >
          <span className="relative block h-4 w-[7.5px]">
            <Image src="/icons/carousel-arrow.svg" alt="" fill sizes="8px" />
          </span>
        </button>
      </div>

      <div className="absolute inset-x-0 bottom-[11px] flex items-center justify-center gap-2.5">
        {[0, 1, 2, 3].map((dot) => (
          <span
            key={dot}
            className={cn("size-[9.5px] rounded-full", dot === 0 ? "bg-brand-600" : "bg-white")}
          />
        ))}
      </div>
    </div>
  );
}

function PollBody({ post }: { post: PostCardData }) {
  return (
    <div className="flex w-full flex-col gap-[15px]">
      {post.participantAvatars && (
        <div className="flex items-center -space-x-1">
          {post.participantAvatars.map((avatar, index) => (
            <span
              key={avatar + index}
              className="relative block size-[38px] shrink-0 overflow-hidden rounded-xl ring-2 ring-white"
            >
              <Image src={avatar} alt="" fill className="object-cover" sizes="38px" />
            </span>
          ))}
        </div>
      )}

      {post.question && (
        <p className="text-[13px] leading-5 text-[#1e293b]">
          {post.question}{" "}
          {post.hashtags && <span className="text-[#ea5e9c]">{post.hashtags}</span>}
        </p>
      )}

      {post.pollOptions && (
        <div className="flex w-full flex-col gap-[15px] rounded-[15px] border border-gray-200 p-[15px]">
          <div className="flex w-full flex-col gap-2">
            {post.pollOptions.map((option) => (
              <div key={option.label} className="flex w-full items-center justify-between text-[13px]">
                <div
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-2 py-2",
                    option.leading ? "bg-brand-900 text-white" : "bg-gray-100 text-night-900",
                  )}
                  style={{ width: `${Math.max(option.percent, 18)}%` }}
                >
                  <span className="font-semibold">{option.percent}%</span>
                  <span className={cn(option.leading ? "text-white" : "text-gray-600")}>{option.label}</span>
                  {option.leading && (
                    <span className="relative block size-[19px] shrink-0">
                      <Image src="/icons/check-circle.svg" alt="" fill sizes="19px" />
                    </span>
                  )}
                </div>
                <span className="font-medium text-gray-400">{option.votes}</span>
              </div>
            ))}
          </div>
          {post.pollFooter && (
            <p className="text-center text-[11px] font-medium text-gray-600">{post.pollFooter}</p>
          )}
        </div>
      )}
    </div>
  );
}

function PriceRow({ post }: { post: PostCardData }) {
  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex flex-col gap-1 whitespace-nowrap text-gray-700">
        <p className="text-[19px] font-semibold">
          {post.priceLine}
          {post.priceSuffix && <span className="text-[10.5px] font-normal">{post.priceSuffix}</span>}
        </p>
        <p className="text-[13px] font-light">{post.subLine}</p>
      </div>

      {post.beds !== undefined && post.baths !== undefined ? (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <span className="relative block h-[15px] w-[17px]">
              <Image src="/icons/bed-single-01.svg" alt="" fill sizes="17px" />
            </span>
            <span className="text-[9.5px] font-light text-gray-700">{post.beds} bedroom</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="relative block h-[15px] w-[17px]">
              <Image src="/icons/bathtub-02.svg" alt="" fill sizes="17px" />
            </span>
            <span className="text-[9.5px] font-light text-gray-700">{post.baths} bedroom</span>
          </div>
        </div>
      ) : post.rating ? (
        <div className="flex items-center gap-1">
          <span className="relative block size-[13px]">
            <Image src="/icons/star-filled.svg" alt="" fill sizes="13px" />
          </span>
          <span className="text-[8px] font-light text-gray-700">{post.rating}</span>
        </div>
      ) : null}
    </div>
  );
}

function ActionsRow({ post }: { post: PostCardData }) {
  const [primary, secondary] = post.actions ?? [];
  return (
    <div className="flex w-full flex-wrap items-center justify-between gap-2">
      <div className="flex flex-wrap items-center gap-2 sm:gap-4">
        {primary && (
          <Button variant="primary" className="h-[38px] w-auto px-[15px] text-[13px]">
            {primary.label}
          </Button>
        )}
        {secondary && (
          <Button variant={secondary.variant} className="h-[38px] w-auto px-[15px] text-[13px]">
            {secondary.label}
          </Button>
        )}
      </div>
      {post.messageHostLabel && (
        <Button variant="outline-brand" className="h-[38px] w-auto px-[15px] text-[13px]">
          {post.messageHostLabel}
        </Button>
      )}
    </div>
  );
}

function PostStatsBar({ post }: { post: PostCardData }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  return (
    <div className="flex w-full flex-wrap items-center gap-x-4 gap-y-2 sm:gap-x-6">
      <button type="button" className="flex items-center gap-2" onClick={() => setLiked((v) => !v)}>
        <span className="relative block size-[23px] shrink-0">
          <Image src="/icons/heart-like.svg" alt="" fill sizes="23px" />
        </span>
        <span className="text-[11px] font-bold text-brand-900">
          {post.likes + (liked ? 1 : 0)} Likes
        </span>
      </button>
      <div className="flex items-center gap-2">
        <span className="relative block size-[23px] shrink-0">
          <Image src="/icons/message-03.svg" alt="" fill sizes="23px" />
        </span>
        <span className="text-[11px] font-bold text-brand-900">{post.comments} Comments</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="relative block size-[23px] shrink-0">
          <Image src="/icons/share-05.svg" alt="" fill sizes="23px" />
        </span>
        <span className="text-[11px] font-bold text-brand-900">{post.shareLabel ?? "Share"}</span>
      </div>
      <button type="button" className="flex items-center gap-2" onClick={() => setSaved((v) => !v)}>
        <span className="relative block size-[23px] shrink-0">
          <Image src="/icons/archive-save.svg" alt="" fill sizes="23px" />
        </span>
        <span className="text-[11px] font-bold text-brand-900">{saved ? "Saved" : "Save"}</span>
      </button>
    </div>
  );
}
