"use client";

import { useState } from "react";
import Image from "next/image";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { PostHeader } from "@/components/home/PostHeader";
import { PostEngagementBar } from "@/components/home/PostEngagementBar";
import { CommentsSection } from "@/components/home/CommentsSection";
import { PollBlock } from "@/components/home/PollBlock";
import { PostImageLightbox } from "@/components/home/PostImageLightbox";
import { usePostComments } from "@/hooks/usePostComments";
import { isLocalPreviewUrl } from "@/lib/is-local-preview-url";
import type { GeneralPost } from "@/types/home";

const TAG_LABEL = { property: "Property listing", service: "Service post" } as const;

/** Above this many photos, a grid stops being readable — show a single
 * cover photo with a "1/N" badge instead (same convention as
 * PropertyPostCard's hero image) and let the lightbox's prev/next handle
 * paging through the rest as a slideshow. */
const GRID_LIMIT = 4;

/** Renders posts created through the composer modal (text + at most one of
 * photos / a property-or-service tag / a poll) — not a Figma frame, built to
 * match the two feed-post variants that are. */
export function GeneralPostCard({ post }: { post: GeneralPost }) {
  const { comments, commentsOpen, toggleComments, addComment } = usePostComments(post.comments);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const images = post.images ?? [];

  return (
    <article className="flex w-full shrink-0 flex-col gap-4 rounded-xl bg-white p-6 shadow-[0px_4px_12px_0px_rgba(0,31,63,0.08)]">
      <PostHeader author={post.author} />

      {post.tag && (
        <span className="flex w-fit items-center gap-1.5 rounded-full bg-surface-muted px-3 py-1 text-xs font-semibold text-brand-navy">
          <DynamicIcon name={post.tag === "property" ? "Building2" : "Wrench"} className="size-3.5" />
          {TAG_LABEL[post.tag]}
        </span>
      )}

      {post.body.length > 0 && (
        <div className="text-base leading-relaxed text-ink">
          {post.body.map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
      )}

      {images.length > GRID_LIMIT && (
        // Too many to grid legibly — one cover photo + a "1/N" badge, same
        // convention as PropertyPostCard's hero image; the lightbox's
        // prev/next arrows are the slideshow through the rest.
        <button
          aria-label="View photo 1"
          onClick={() => setLightboxIndex(0)}
          className="relative h-[280px] w-full cursor-zoom-in overflow-hidden rounded-lg sm:h-[400px]"
        >
          {isLocalPreviewUrl(images[0].src) ? (
            // eslint-disable-next-line @next/next/no-img-element -- local blob: preview
            <img src={images[0].src} alt={images[0].alt} className="size-full object-cover" />
          ) : (
            <Image src={images[0].src} alt={images[0].alt} fill className="object-cover" />
          )}
          <span className="absolute top-4 right-4 rounded bg-brand-navy/80 px-2 py-1 text-xs text-white">
            1/{images.length}
          </span>
        </button>
      )}

      {images.length > 0 && images.length <= GRID_LIMIT && (
        <div className={images.length === 1 ? "" : "grid grid-cols-2 gap-1"}>
          {images.map((image, i) => (
            <button
              key={i}
              aria-label={`View photo ${i + 1}`}
              onClick={() => setLightboxIndex(i)}
              className="relative aspect-square cursor-zoom-in overflow-hidden rounded-lg"
            >
              {isLocalPreviewUrl(image.src) ? (
                // eslint-disable-next-line @next/next/no-img-element -- local blob: preview
                <img src={image.src} alt={image.alt} className="size-full object-cover" />
              ) : (
                <Image src={image.src} alt={image.alt} fill className="object-cover" />
              )}
            </button>
          ))}
        </div>
      )}

      {post.poll && <PollBlock poll={post.poll} />}

      <PostEngagementBar post={post} commentsOpen={commentsOpen} onToggleComments={toggleComments} />
      {commentsOpen && <CommentsSection comments={comments} onAddComment={addComment} />}

      {lightboxIndex !== null && (
        <PostImageLightbox images={images} initialIndex={lightboxIndex} onClose={() => setLightboxIndex(null)} />
      )}
    </article>
  );
}
