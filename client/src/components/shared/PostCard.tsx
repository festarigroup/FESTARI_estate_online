"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { NavIcon } from "@/components/shared/NavIcon";
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

export interface CommentItem {
  id: string;
  authorName: string;
  avatar?: string;
  postedAt: string;
  text: string;
  likes?: number;
}

const DEFAULT_COMMENTS: CommentItem[] = [
  {
    id: "c1",
    authorName: "Jane Doe",
    postedAt: "17s ago",
    text: "We are very good. Your story is very inspiring!\nDon't stop keep going.",
    likes: 20,
  },
  { id: "c2", authorName: "John Doe", postedAt: "1m ago", text: "Cool Champ.", likes: 20 },
  { id: "c3", authorName: "Jane Doe", postedAt: "20m ago", text: "Cool Champ." },
];

export interface PostCardData {
  id: string;
  variant?: "text" | "poll" | "property" | "stay" | "project" | "professional" | "artisan";
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
  commentsList?: CommentItem[];
}

interface PostCardProps {
  post: PostCardData;
  currentUserAvatarInitials?: string;
}

export function PostCard({ post, currentUserAvatarInitials = "SL" }: PostCardProps) {
  const [showComments, setShowComments] = useState(false);

  return (
    <article className="flex w-full flex-col gap-[15px] rounded-[29px] border border-gray-200 bg-white p-[15px] sm:rounded-[15px]">
      <PostHeader post={post} />

      <div className="h-px w-full bg-gray-200" />

      {post.variant === "poll" ? (
        <PollBody post={post} />
      ) : (
        <>
          {(post.text || post.image) && (
            // Mobile shows the image first with the caption below it;
            // desktop keeps the caption above the image.
            <div className="flex w-full flex-col-reverse gap-[15px] sm:flex-col">
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
            </div>
          )}

          {(post.priceLine || post.actions) && <div className="h-px w-full bg-gray-200" />}

          {post.priceLine && <PriceRow post={post} />}

          {post.actions && <ActionsRow post={post} />}
        </>
      )}

      <div className="h-px w-full bg-gray-200" />

      <PostStatsBar post={post} showComments={showComments} onToggleComments={() => setShowComments((v) => !v)} />

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

      {showComments && <CommentsSection comments={post.commentsList ?? DEFAULT_COMMENTS} />}
    </article>
  );
}

function PostHeader({ post }: { post: PostCardData }) {
  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="relative block size-[46px] shrink-0">
          <span
            className={cn(
              "relative block size-full overflow-hidden rounded-full",
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
          </span>
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
            aria-label="Follow"
            className="flex h-[38px] w-[38px] items-center justify-center rounded-lg sm:w-[81px] sm:px-[15px] sm:py-2"
          >
            <span className="relative block size-5 shrink-0 sm:hidden">
              <Image src="/icons/user-add-01.svg" alt="" fill sizes="20px" />
            </span>
            <span className="hidden text-[13px] text-brand-900 sm:inline">Follow</span>
          </button>
        )}
        <span className="relative block size-[23px] shrink-0 sm:hidden">
          <Image src="/icons/more-horizontal.svg" alt="Post options" fill sizes="23px" />
        </span>
        <span className="relative hidden size-[23px] shrink-0 sm:block">
          <Image src="/icons/menu-03.svg" alt="Post options" fill sizes="23px" />
        </span>
      </div>
    </div>
  );
}

function ImageCarousel({ image }: { image: string }) {
  return (
    <div className="relative h-[285px] w-full overflow-hidden rounded-[29px] sm:rounded-[15px]">
      <Image src={image} alt="" fill className="object-cover" sizes="770px" />

      <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 items-center justify-between px-4">
        <button
          type="button"
          aria-label="Previous image"
          className="flex size-[21px] items-center justify-center rounded-full bg-white shadow-[0px_0px_10px_rgba(69,71,69,0.25)]"
        >
          <span className="relative block h-3 w-[5.5px] rotate-180">
            <Image src="/icons/carousel-arrow.svg" alt="" fill sizes="6px" />
          </span>
        </button>
        <button
          type="button"
          aria-label="Next image"
          className="flex size-[21px] items-center justify-center rounded-full bg-white shadow-[0px_0px_10px_rgba(69,71,69,0.25)]"
        >
          <span className="relative block h-3 w-[5.5px]">
            <Image src="/icons/carousel-arrow.svg" alt="" fill sizes="6px" />
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
            <p className="text-left text-[11px] font-medium text-gray-600">{post.pollFooter}</p>
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
            <span className="text-[9.5px] font-light text-gray-700">
              {post.beds}
              <span className="hidden sm:inline"> bedroom</span>
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="relative block h-[15px] w-[17px]">
              <Image src="/icons/bathtub-02.svg" alt="" fill sizes="17px" />
            </span>
            <span className="text-[9.5px] font-light text-gray-700">
              {post.baths}
              <span className="hidden sm:inline"> bathroom</span>
            </span>
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
          <Button
            variant="primary"
            className="h-auto w-auto rounded-xl px-3 py-1.5 text-[10px] sm:h-[38px] sm:rounded-lg sm:px-[15px] sm:py-0 sm:text-[13px]"
          >
            {primary.label}
          </Button>
        )}
        {secondary && (
          <Button
            variant={secondary.variant}
            className="h-auto w-auto rounded-xl px-3 py-1.5 text-[10px] sm:h-[38px] sm:rounded-lg sm:px-[15px] sm:py-0 sm:text-[13px]"
          >
            {secondary.label}
          </Button>
        )}
      </div>
      {post.messageHostLabel && (
        <Button
          variant="outline-brand"
          className="h-auto w-auto rounded-xl px-3 py-1.5 text-[10px] sm:h-[38px] sm:rounded-lg sm:px-[15px] sm:py-0 sm:text-[13px]"
        >
          {post.messageHostLabel}
        </Button>
      )}
    </div>
  );
}

function PostStatsBar({
  post,
  showComments,
  onToggleComments,
}: {
  post: PostCardData;
  showComments: boolean;
  onToggleComments: () => void;
}) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  const likeCount = post.likes + (liked ? 1 : 0);

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex w-full items-center justify-between sm:justify-start sm:gap-6">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 sm:gap-x-6">
          <button
            type="button"
            className="flex items-center gap-2"
            aria-label={`${likeCount} Likes`}
            onClick={() => setLiked((v) => !v)}
          >
            <NavIcon
              icon="/icons/heart-like.svg"
              color="night"
              size={23}
              className={liked ? "bg-[#ea5e9c]" : undefined}
            />
            <span
              className={cn(
                "hidden text-[11px] font-bold sm:inline",
                liked ? "text-[#ea5e9c]" : "text-brand-900",
              )}
            >
              {likeCount} Likes
            </span>
          </button>
          <button
            type="button"
            className="flex items-center gap-2"
            aria-expanded={showComments}
            aria-label={`${post.comments} Comments`}
            onClick={onToggleComments}
          >
            <span className="relative block size-[23px] shrink-0">
              <Image src="/icons/message-03.svg" alt="" fill sizes="23px" />
            </span>
            <span className="hidden text-[11px] font-bold text-brand-900 sm:inline">{post.comments} Comments</span>
          </button>
          <div className="flex items-center gap-2" aria-label={post.shareLabel ?? "Share"}>
            <span className="relative block size-[23px] shrink-0">
              <Image src="/icons/share-05.svg" alt="" fill sizes="23px" />
            </span>
            <span className="hidden text-[11px] font-bold text-brand-900 sm:inline">
              {post.shareLabel ?? "Share"}
            </span>
          </div>
        </div>
        <button
          type="button"
          className="flex items-center gap-2"
          aria-label={saved ? "Saved" : "Save"}
          onClick={() => setSaved((v) => !v)}
        >
          <NavIcon icon="/icons/archive-save.svg" color={saved ? "brand" : "night"} size={23} />
          <span className="hidden text-[11px] font-bold text-brand-900 sm:inline">{saved ? "Saved" : "Save"}</span>
        </button>
      </div>

      {likeCount > 0 && (
        <div className="flex items-center justify-between gap-2 sm:hidden">
          <p className="min-w-0 flex-1 truncate text-[11px] text-gray-600">
            Liked by <span className="font-bold text-brand-900">Kwame</span>
            {likeCount > 1 && (
              <>
                {" "}
                and <span className="font-bold text-brand-900">{likeCount - 1} others</span>
              </>
            )}
          </p>
          <span className="flex shrink-0 items-center -space-x-2">
            {[0, 1, 2].map((avatar) => (
              <span
                key={avatar}
                className="relative block size-[22px] shrink-0 overflow-hidden rounded-full bg-[#eef2ff] ring-2 ring-white"
              >
                <Image src="/icons/avatar-placeholder-user.svg" alt="" fill sizes="22px" className="p-0.5" />
              </span>
            ))}
            {likeCount > 3 && (
              <span className="relative flex size-[22px] shrink-0 items-center justify-center rounded-full bg-night-900 text-[8px] font-bold text-white ring-2 ring-white">
                +{likeCount - 3}
              </span>
            )}
          </span>
        </div>
      )}
    </div>
  );
}

function CommentsSection({ comments }: { comments: CommentItem[] }) {
  return (
    <div className="flex w-full flex-col gap-2.5">
      <p className="text-[11px] font-bold text-brand-900">Comments</p>
      <div className="flex w-full flex-col items-center gap-[14px]">
        {comments.map((comment) => (
          <CommentRow key={comment.id} comment={comment} />
        ))}
      </div>
      <button type="button" className="text-left text-[11px] font-bold text-brand-900">
        Load More Comments
      </button>
    </div>
  );
}

function CommentRow({ comment }: { comment: CommentItem }) {
  return (
    <div className="flex w-full items-start gap-[14px]">
      <span className="relative block size-[47px] shrink-0 overflow-hidden rounded-full bg-[#eef2ff]">
        {comment.avatar ? (
          <Image src={comment.avatar} alt={comment.authorName} fill className="object-cover" sizes="47px" />
        ) : (
          <span className="absolute left-1/2 top-1/2 block size-6 -translate-x-1/2 -translate-y-1/2">
            <Image src="/icons/avatar-placeholder-user.svg" alt="" fill sizes="24px" />
          </span>
        )}
      </span>
      <div className="flex min-w-0 flex-1 flex-col items-start gap-1.5">
        <div className="flex w-full items-start justify-between gap-2">
          <p className="text-[13px] font-bold text-brand-900">{comment.authorName}</p>
          <p className="shrink-0 text-[9.5px] text-gray-500">{comment.postedAt}</p>
        </div>
        <p className="whitespace-pre-line text-[13px] leading-[1.5] text-gray-600">{comment.text}</p>
        {!!comment.likes && (
          <div className="flex items-center gap-1">
            <NavIcon icon="/icons/heart-like.svg" color="brand" size={11} className="bg-[#ea5e9c]" />
            <span className="text-[9.5px] font-bold text-brand-900">{comment.likes}</span>
          </div>
        )}
      </div>
    </div>
  );
}
