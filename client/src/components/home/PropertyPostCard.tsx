"use client";

import { useState } from "react";
import Image from "next/image";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { PostHeader } from "@/components/home/PostHeader";
import { PostEngagementBar } from "@/components/home/PostEngagementBar";
import { CommentsSection } from "@/components/home/CommentsSection";
import { PostImageLightbox } from "@/components/home/PostImageLightbox";
import { usePostComments } from "@/hooks/usePostComments";
import type { PropertyPost } from "@/types/home";

/** "Article - Post: Property Listing" — body copy, image gallery, reactions, actions. */
export function PropertyPostCard({ post }: { post: PropertyPost }) {
  const [main, thumb1, thumb2] = post.images;
  const { comments, commentsOpen, toggleComments, addComment } = usePostComments(post.comments);
  const [shares, setShares] = useState(post.reactions.shares);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <article className="flex w-full shrink-0 flex-col overflow-hidden rounded-xl bg-white shadow-[0px_4px_12px_0px_rgba(0,31,63,0.08)]">
      <div className="flex flex-col gap-4 px-6 pt-6 pb-10">
        <PostHeader author={post.author} />
        <div className="text-base leading-relaxed text-ink">
          {post.body.map((line) => (
            <p key={line}>{line}</p>
          ))}
          <p className="text-brand-gold">{post.hashtags}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-1 px-1">
        <button
          aria-label="View photo 1"
          onClick={() => setLightboxIndex(0)}
          className="relative col-span-2 row-span-2 h-[280px] cursor-zoom-in sm:h-[400px]"
        >
          <Image src={main.src} alt={main.alt} fill className="object-cover" />
          <span className="absolute top-4 right-4 rounded bg-brand-navy/80 px-2 py-1 text-xs text-white">
            1/{post.totalImages}
          </span>
        </button>
        <button
          aria-label="View photo 2"
          onClick={() => setLightboxIndex(1)}
          className="relative h-[137px] cursor-zoom-in sm:h-[199px]"
        >
          <Image src={thumb1.src} alt={thumb1.alt} fill className="object-cover" />
        </button>
        <button
          aria-label="View photo 3"
          onClick={() => setLightboxIndex(2)}
          className="relative h-[137px] cursor-zoom-in sm:h-[199px]"
        >
          <Image src={thumb2.src} alt={thumb2.alt} fill className="object-cover" />
        </button>
      </div>

      {lightboxIndex !== null && (
        <PostImageLightbox
          images={post.images}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}

      <div className="flex w-full flex-col gap-6 p-6">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <span className="flex size-5 items-center justify-center rounded-full border-2 border-white bg-brand-blue">
                <DynamicIcon name="ThumbsUp" className="size-2.5 text-white" fill="currentColor" />
              </span>
              <span className="-ml-1 flex size-5 items-center justify-center rounded-full border-2 border-white bg-brand-rust">
                <DynamicIcon name="Heart" className="size-2.5 text-white" fill="currentColor" />
              </span>
            </div>
            <span className="text-sm text-muted">{post.reactions.likes} likes</span>
          </div>
          <div className="flex gap-4 text-sm text-muted">
            <span>{comments.length} Comments</span>
            <span>{shares} Shares</span>
          </div>
        </div>

        <PostEngagementBar
          post={post}
          commentsOpen={commentsOpen}
          onToggleComments={toggleComments}
          onShare={() => setShares((s) => s + 1)}
        />
        {commentsOpen && <CommentsSection comments={comments} onAddComment={addComment} />}
      </div>
    </article>
  );
}
