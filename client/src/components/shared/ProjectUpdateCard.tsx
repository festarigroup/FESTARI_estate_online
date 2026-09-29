"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { EmojiPicker } from "@/components/shared/EmojiPicker";
import { FollowButton } from "@/components/shared/FollowButton";
import { LikesBottomSheet } from "@/components/shared/LikesBottomSheet";
import { NavIcon } from "@/components/shared/NavIcon";
import { CommentsModal, CommentsSection, DEFAULT_COMMENTS, type CommentItem } from "@/components/shared/PostComments";
import { comingSoonHref } from "@/lib/coming-soon";
import { buildLikerNames } from "@/lib/likes";
import { shareContent } from "@/lib/share";
import { cn } from "@/lib/utils";

const LIKED_BY_AVATARS = [
  "/images/stories/sonya.jpg",
  "/images/stories/adam.jpg",
  "/images/stories/andrew.jpg",
  "/images/stories/nicole.jpg",
  "/images/stories/ashley.jpg",
];

const AUTHOR_NAME = "Andy Ansong";
const PROJECT_TITLE = "Adenta Heights · Phase 2";
const CURRENT_USER_AVATAR_INITIALS = "SL";

/**
 * Compact "project update" post — a developer's progress note with an inline
 * project thumbnail + CTA, distinct from the full-width media layout the
 * general PostCard variants use. Only used in the "/home" dashboard's feed
 * preview for now, but the engagement bar (like/comment/share/save, the
 * comments list + modal, the likes sheet, the "Add a comment" composer) is
 * the exact same shared machinery every PostCard variant on "/feed" uses,
 * so this card behaves identically — just with its own bespoke header/body.
 */
export function ProjectUpdateCard() {
  const [following, setFollowing] = useState(false);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(42);
  const [likesSheetOpen, setLikesSheetOpen] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<CommentItem[]>(DEFAULT_COMMENTS);
  const [commentDraft, setCommentDraft] = useState("");

  function toggleLike() {
    setLiked((v) => {
      const next = !v;
      setLikeCount((count) => count + (next ? 1 : -1));
      return next;
    });
  }

  function submitComment() {
    const text = commentDraft.trim();
    if (!text) return;
    setComments((current) => [{ id: `local-${Date.now()}`, authorName: "You", postedAt: "Just now", text }, ...current]);
    setCommentDraft("");
    setShowComments(true);
  }

  const likerNames = buildLikerNames(likeCount);

  return (
    <div className="flex w-full flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-4">
      <div className="flex w-full items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="relative block size-12 shrink-0">
            <span className="relative block size-full overflow-hidden rounded-full">
              <Image src="/icons/avatar-andy.png" alt={AUTHOR_NAME} fill className="object-cover" sizes="48px" />
            </span>
            <span className="absolute -bottom-0.5 -right-0.5 block size-[17px]">
              <Image src="/icons/avatar-verified-badge.svg" alt="" fill sizes="17px" />
            </span>
          </span>
          <div className="flex flex-col items-start gap-0.5">
            <div className="flex flex-wrap items-center gap-1.5">
              <p className="text-[14px] font-bold text-brand-900">{AUTHOR_NAME}</p>
              <span className="flex w-fit items-center gap-1 rounded-full border border-emerald-800/20 bg-emerald-50 px-1.5 py-0.5 text-[9px] text-emerald-600">
                <span className="relative block size-2 shrink-0">
                  <Image src="/icons/check-circle.svg" alt="" fill sizes="8px" />
                </span>
                Business Verified
              </span>
            </div>
            <p className="text-[10px] text-gray-500">
              Project update · by Coastline Developerst | <span className="font-medium">5h</span>
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <FollowButton following={following} onToggle={() => setFollowing((v) => !v)} name={AUTHOR_NAME} />
          <Link href={comingSoonHref("Post options")} className="relative block size-[23px] shrink-0">
            <Image src="/icons/menu-03.svg" alt="Post options" fill sizes="23px" />
          </Link>
        </div>
      </div>

      <div className="h-px w-full bg-gray-200" />

      <p className="flex w-full items-baseline gap-1 overflow-hidden text-[13px] text-night-800">
        <span className="truncate">
          Phase 2 roofing is complete on Blocks C and D. Two-bedroom units in Block D are open for viewing from 5
          October.
        </span>
        <Link href={comingSoonHref("Post")} className="shrink-0 text-[13px] font-bold text-gray-400">
          more
        </Link>
      </p>

      <div className="flex w-full items-stretch overflow-hidden rounded-2xl border border-gray-200">
        <div className="relative h-[120px] w-[152px] shrink-0 sm:w-[203px]">
          <Image src="/images/post-property-exterior.jpg" alt={PROJECT_TITLE} fill className="object-cover" sizes="203px" />
        </div>
        <div className="flex flex-1 flex-col items-start justify-center gap-3 bg-gray-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1">
            <p className="text-[15px] font-semibold text-gray-700 sm:text-[17px]">{PROJECT_TITLE}</p>
            <p className="text-[11px] text-gray-700">Under construction · 68% complete · Handover Q2 2027</p>
          </div>
          <Link
            href={comingSoonHref("View Project")}
            className="flex h-10 w-full shrink-0 items-center justify-center rounded-lg bg-brand-900 px-4 text-[13px] text-white hover:bg-brand-900/90 sm:w-auto"
          >
            View Project
          </Link>
        </div>
      </div>

      <div className="h-px w-full bg-gray-200" />

      <div className="flex w-full items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <button type="button" className="flex items-center gap-2" aria-pressed={liked} aria-label={`${likeCount} Likes`} onClick={toggleLike}>
            <NavIcon
              key={liked ? "liked" : "unliked"}
              icon={liked ? "/icons/heart-like-filled.svg" : "/icons/heart-like.svg"}
              color="night"
              size={20}
              className={liked ? "bg-[#ef575f] animate-like-pop" : undefined}
            />
            <span className={cn("hidden text-[11px] font-bold sm:inline", liked ? "text-[#ef575f]" : "text-brand-900")}>
              {likeCount} Likes
            </span>
          </button>
          <button
            type="button"
            className="flex items-center gap-2"
            aria-expanded={showComments}
            aria-label={`${comments.length} Comments`}
            onClick={() => setShowComments((v) => !v)}
          >
            <span className="relative block size-5 shrink-0">
              <Image src="/icons/message-03.svg" alt="" fill sizes="20px" />
            </span>
            <span className="hidden text-[11px] font-bold text-brand-900 sm:inline">{comments.length} Comments</span>
          </button>
          <button
            type="button"
            className="flex items-center gap-2"
            aria-label="Share"
            onClick={() => shareContent({ title: AUTHOR_NAME, path: "#post-project-update" })}
          >
            <span className="relative block size-5 shrink-0">
              <Image src="/icons/share-05.svg" alt="" fill sizes="20px" />
            </span>
            <span className="hidden text-[11px] font-bold text-brand-900 sm:inline">Share</span>
          </button>
          <button type="button" className="flex items-center gap-2" aria-label={saved ? "Saved" : "Save"} onClick={() => setSaved((v) => !v)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" className={saved ? "text-brand-600" : "text-night-700"}>
              <path
                d="M5 4.6C5 3.84575 5 3.46863 5.23431 3.23431C5.46863 3 5.84575 3 6.6 3H17.4C18.1542 3 18.5314 3 18.7657 3.23431C19 3.46863 19 3.84575 19 4.6V19.4454C19 20.1263 19 20.4667 18.783 20.5784C18.5661 20.69 18.289 20.4922 17.735 20.0964L12.93 16.6643C12.4809 16.3435 12.2564 16.1831 12 16.1831C11.7436 16.1831 11.5191 16.3435 11.07 16.6643L6.26499 20.0964C5.71095 20.4922 5.43393 20.69 5.21697 20.5784C5 20.4667 5 20.1263 5 19.4454V4.6Z"
                fill={saved ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
            <span className="hidden text-[11px] font-bold text-brand-900 sm:inline">{saved ? "Saved" : "Save"}</span>
          </button>
        </div>

        {likeCount > 0 && (
          <button
            type="button"
            onClick={() => setLikesSheetOpen(true)}
            className="flex shrink-0 items-center gap-1.5 text-[12px] font-semibold text-night-900"
          >
            Liked by
            <span className="flex shrink-0 items-center -space-x-1.5">
              {LIKED_BY_AVATARS.map((avatar) => (
                <span key={avatar} className="relative block size-[13px] shrink-0 overflow-hidden rounded-full ring-[1.5px] ring-white">
                  <Image src={avatar} alt="" fill className="object-cover" sizes="13px" />
                </span>
              ))}
              {likeCount > LIKED_BY_AVATARS.length && (
                <span className="relative flex size-[13px] shrink-0 items-center justify-center rounded-full bg-gray-200 text-[6px] font-medium text-gray-500 ring-[1.5px] ring-white">
                  +{likeCount - LIKED_BY_AVATARS.length}
                </span>
              )}
            </span>
          </button>
        )}
      </div>

      <div className="flex w-full items-center gap-2 rounded-3xl bg-gray-100 p-2">
        <span className="flex size-[38px] shrink-0 items-center justify-center rounded-full bg-[#eef2ff] text-[13px] font-extrabold text-[#4f46e5]">
          {CURRENT_USER_AVATAR_INITIALS}
        </span>
        <input
          type="text"
          value={commentDraft}
          onChange={(event) => setCommentDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") submitComment();
          }}
          placeholder="Add a comment"
          className="min-w-0 flex-1 bg-transparent text-[11px] text-night-900/70 placeholder:text-night-900/40 focus:outline-none"
        />
        <EmojiPicker onSelect={(emoji) => setCommentDraft((current) => current + emoji)} />
        <button type="button" aria-label="Send comment" onClick={submitComment} className="relative block size-[23px] shrink-0">
          <Image src="/icons/send-alt-filled.svg" alt="" fill sizes="23px" />
        </button>
      </div>

      {showComments && (
        <>
          <div className="sm:hidden">
            <CommentsSection comments={comments} />
          </div>
          <CommentsModal
            comments={comments}
            commentDraft={commentDraft}
            setCommentDraft={setCommentDraft}
            submitComment={submitComment}
            currentUserAvatarInitials={CURRENT_USER_AVATAR_INITIALS}
            showComposer
            likeCount={likeCount}
            commentsCount={comments.length}
            onShare={() => shareContent({ title: AUTHOR_NAME, path: "#post-project-update" })}
            onClose={() => setShowComments(false)}
          />
        </>
      )}

      <LikesBottomSheet open={likesSheetOpen} onClose={() => setLikesSheetOpen(false)} names={likerNames} />
    </div>
  );
}
