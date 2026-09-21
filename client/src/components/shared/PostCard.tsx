"use client";

import Image from "next/image";

export interface PostCardData {
  id: string;
  authorName: string;
  authorRole: string;
  postedAt: string;
  text: string;
  image?: string;
  likes: number;
  comments: number;
  avatar: string;
}

interface PostCardProps {
  post: PostCardData;
  currentUserAvatarInitials?: string;
}

export function PostCard({ post, currentUserAvatarInitials = "SL" }: PostCardProps) {
  return (
    <article className="flex w-full flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-4">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="relative block size-12 shrink-0 overflow-hidden rounded-full">
            <Image src={post.avatar} alt={post.authorName} fill className="object-cover" sizes="48px" />
          </span>
          <div className="flex flex-col items-start whitespace-nowrap">
            <p className="text-sm font-bold text-brand-900">{post.authorName}</p>
            <p className="text-[10px] text-gray-500">
              {post.authorRole} | <span className="font-medium">{post.postedAt}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="flex h-10 w-[85px] items-center justify-center rounded-lg border border-brand-900 px-4 py-2.5 text-sm text-brand-900"
          >
            Follow
          </button>
          <span className="relative block size-6 shrink-0">
            <Image src="/icons/menu-03.svg" alt="Post options" fill sizes="24px" />
          </span>
        </div>
      </div>

      <div className="h-px w-full bg-gray-200" />

      <div className="flex w-full items-center gap-0.5 text-sm leading-5">
        <p className="min-w-0 flex-1 truncate text-[#1e293b]">{post.text}</p>
        <button type="button" className="shrink-0 font-bold text-gray-400">
          more
        </button>
      </div>

      {post.image && (
        <div className="relative h-[300px] w-full overflow-hidden rounded-2xl">
          <Image src={post.image} alt="" fill className="object-cover" sizes="770px" />
        </div>
      )}

      <div className="h-px w-full bg-gray-200" />

      <div className="flex w-full items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="relative block size-6 shrink-0">
            <Image src="/icons/heart-like.svg" alt="" fill sizes="24px" />
          </span>
          <span className="text-xs font-bold text-brand-900">{post.likes} Likes</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="relative block size-6 shrink-0">
            <Image src="/icons/message-03.svg" alt="" fill sizes="24px" />
          </span>
          <span className="text-xs font-bold text-brand-900">{post.comments} Comments</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="relative block size-6 shrink-0">
            <Image src="/icons/share-05.svg" alt="" fill sizes="24px" />
          </span>
          <span className="text-xs font-bold text-brand-900">Share</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="relative block size-6 shrink-0">
            <Image src="/icons/archive-save.svg" alt="" fill sizes="24px" />
          </span>
          <span className="text-xs font-bold text-brand-900">Save</span>
        </div>
      </div>

      <div className="flex w-full items-center gap-2 rounded-3xl bg-gray-100 p-2">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#eef2ff] text-sm font-extrabold text-[#4f46e5]">
          {currentUserAvatarInitials}
        </span>
        <input
          type="text"
          placeholder="Add a comment"
          className="min-w-0 flex-1 bg-transparent text-xs text-night-900/70 placeholder:text-night-900/40 focus:outline-none"
        />
        <button type="button" aria-label="Send comment" className="relative block size-6 shrink-0">
          <Image src="/icons/send-alt-filled.svg" alt="" fill sizes="24px" />
        </button>
      </div>
    </article>
  );
}
