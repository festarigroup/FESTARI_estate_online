"use client";

import { useState } from "react";
import Image from "next/image";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { PostHeader } from "@/components/home/PostHeader";
import { PostEngagementBar } from "@/components/home/PostEngagementBar";
import { ServiceActionsBar } from "@/components/home/ServiceActionsBar";
import { PropertyEnquiryButton } from "@/components/home/PropertyEnquiryButton";
import { CommentsSection } from "@/components/home/CommentsSection";
import { PollBlock } from "@/components/home/PollBlock";
import { PostImageLightbox } from "@/components/home/PostImageLightbox";
import { usePostComments } from "@/hooks/usePostComments";
import { isLocalPreviewUrl } from "@/lib/is-local-preview-url";
import type { GeneralPost } from "@/types/home";

const TAG_LABEL = { property: "Property listing", service: "Service post" } as const;

/** The inline grid never shows more than this many tiles — beyond it, the
 * hero tile gets a "1/N" badge (same convention as PropertyPostCard's hero
 * image, which does this unconditionally against its own totalImages) and
 * the lightbox's prev/next arrows are the slideshow through the rest. */
const GRID_LIMIT = 3;

/** Renders posts created through the composer modal (text + at most one of
 * photos / a property-or-service tag / a poll) — not a Figma frame, built to
 * match the two feed-post variants that are. */
export function GeneralPostCard({ post }: { post: GeneralPost }) {
  const { comments, commentsOpen, toggleComments, addComment } = usePostComments(post.comments);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const images = post.images ?? [];

  function renderImage(image: (typeof images)[number]) {
    return isLocalPreviewUrl(image.src) ? (
      // eslint-disable-next-line @next/next/no-img-element -- local blob: preview
      <img src={image.src} alt={image.alt} className="size-full object-cover" />
    ) : (
      <Image src={image.src} alt={image.alt} fill className="object-cover" />
    );
  }

  return (
    <article className="flex w-full shrink-0 flex-col gap-4 rounded-xl bg-white p-6 shadow-[0px_4px_12px_0px_rgba(0,31,63,0.08)]">
      <PostHeader post={post} />

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

      {images.length === 1 && (
        <button
          aria-label="View photo 1"
          onClick={() => setLightboxIndex(0)}
          className="relative h-[280px] w-full cursor-zoom-in overflow-hidden rounded-lg sm:h-[400px]"
        >
          {renderImage(images[0])}
        </button>
      )}

      {images.length === 2 && (
        // Side by side, evenly split — nothing to stack with only one
        // "other" photo.
        <div className="grid grid-cols-2 gap-1">
          {images.map((image, i) => (
            <button
              key={i}
              aria-label={`View photo ${i + 1}`}
              onClick={() => setLightboxIndex(i)}
              className="relative h-[280px] cursor-zoom-in overflow-hidden rounded-lg sm:h-[400px]"
            >
              {renderImage(image)}
            </button>
          ))}
        </div>
      )}

      {images.length >= GRID_LIMIT && (
        // One big photo on the left, the other two stacked on the right —
        // same mosaic as PropertyPostCard's hero image (Ama Serwaa's post).
        // Always capped at exactly these 3 tiles: with more than 3 images
        // total, the hero tile gets a "1/N" badge instead of growing the
        // grid, and the lightbox pages through everything else.
        <div className="grid grid-cols-3 gap-1">
          <button
            aria-label="View photo 1"
            onClick={() => setLightboxIndex(0)}
            className="relative col-span-2 row-span-2 h-[280px] cursor-zoom-in overflow-hidden rounded-lg sm:h-[400px]"
          >
            {renderImage(images[0])}
            {images.length > GRID_LIMIT && (
              <span className="absolute top-4 right-4 rounded bg-brand-navy/80 px-2 py-1 text-xs text-white">
                1/{images.length}
              </span>
            )}
          </button>
          <button
            aria-label="View photo 2"
            onClick={() => setLightboxIndex(1)}
            className="relative h-[137px] cursor-zoom-in overflow-hidden rounded-lg sm:h-[199px]"
          >
            {renderImage(images[1])}
          </button>
          <button
            aria-label="View photo 3"
            onClick={() => setLightboxIndex(2)}
            className="relative h-[137px] cursor-zoom-in overflow-hidden rounded-lg sm:h-[199px]"
          >
            {renderImage(images[2])}
          </button>
        </div>
      )}

      {post.poll && <PollBlock poll={post.poll} />}

      {post.tag === "service" ? (
        // A service post is meant to drive a booking, not a share — same
        // lighter footer + "Book Service" CTA as the seeded ServicePost
        // variant, so a service post looks and behaves the same whichever
        // way it was created.
        <ServiceActionsBar
          postId={post.id}
          providerName={post.author.name}
          commentsOpen={commentsOpen}
          onToggleComments={toggleComments}
          commentCount={comments.length}
        />
      ) : (
        <PostEngagementBar
          post={post}
          commentsOpen={commentsOpen}
          onToggleComments={toggleComments}
          cta={post.tag === "property" ? <PropertyEnquiryButton listerName={post.author.name} /> : undefined}
        />
      )}
      {commentsOpen && <CommentsSection comments={comments} onAddComment={addComment} />}

      {lightboxIndex !== null && (
        <PostImageLightbox images={images} initialIndex={lightboxIndex} onClose={() => setLightboxIndex(null)} />
      )}
    </article>
  );
}
