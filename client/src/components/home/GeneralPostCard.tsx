"use client";

import { useState } from "react";
import Image from "next/image";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { PostHeader } from "@/components/home/PostHeader";
import { PostEngagementBar } from "@/components/home/PostEngagementBar";
import { ServiceActionsBar } from "@/components/home/ServiceActionsBar";
import { PropertyEnquiryButton } from "@/components/home/PropertyEnquiryButton";
import { VenueReservationButton } from "@/components/home/VenueReservationButton";
import { CommentsSection } from "@/components/home/CommentsSection";
import { PollBlock } from "@/components/home/PollBlock";
import { PostImageLightbox } from "@/components/home/PostImageLightbox";
import { usePostComments } from "@/hooks/usePostComments";
import { isLocalPreviewUrl } from "@/lib/is-local-preview-url";
import type { IconName } from "@/components/ui/DynamicIcon";
import type { GeneralPost } from "@/types/home";

const TAG_LABEL = { property: "Property listing", service: "Service post", venue: "Venue listing" } as const;
const TAG_ICON: Record<keyof typeof TAG_LABEL, IconName> = {
  property: "Building2",
  service: "Wrench",
  venue: "Landmark",
};

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
    if (image.type === "video") {
      // No `controls` here: every caller renders this inside a <button> that
      // opens the lightbox on click, and native video controls nested in a
      // button fight that click for the same gesture. Muted preview + a play
      // badge signals "this is a video"; PostImageLightbox is where it
      // actually gets `controls` and plays.
      return (
        <>
          <video src={image.src} muted playsInline className="size-full object-cover" />
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span className="flex size-10 items-center justify-center rounded-full bg-black/50">
              <DynamicIcon name="Play" className="size-4 fill-white text-white" />
            </span>
          </span>
        </>
      );
    }
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
          <DynamicIcon name={TAG_ICON[post.tag]} className="size-3.5" />
          {TAG_LABEL[post.tag]}
        </span>
      )}

      {post.tag === "venue" && post.venueDetails && (
        // Same "title + price row, location, stats row" shape as the
        // Trending Properties widget — the facts a guest needs before
        // tapping Make a Reservation, up front rather than buried in prose.
        <div className="flex flex-col gap-1 rounded-lg border border-border-subtle p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="text-sm font-semibold text-ink">{post.venueDetails.name}</h4>
            <span className="text-sm font-semibold text-brand-navy">
              GHS {post.venueDetails.pricePerNight.toLocaleString()} / night
            </span>
          </div>
          <p className="text-xs text-muted">{post.venueDetails.location}</p>
          <span className="flex items-center gap-1 text-xs text-muted">
            <DynamicIcon name="Users" className="size-3" />
            Up to {post.venueDetails.capacity} guests
          </span>
        </div>
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
          cta={
            post.tag === "property" ? (
              <PropertyEnquiryButton listerName={post.author.name} />
            ) : post.tag === "venue" ? (
              <VenueReservationButton venueName={post.author.name} />
            ) : undefined
          }
        />
      )}
      {commentsOpen && <CommentsSection comments={comments} onAddComment={addComment} />}

      {lightboxIndex !== null && (
        <PostImageLightbox images={images} initialIndex={lightboxIndex} onClose={() => setLightboxIndex(null)} />
      )}
    </article>
  );
}
