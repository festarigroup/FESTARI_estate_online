"use client";

import { useState } from "react";
import Image from "next/image";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { PostHeader } from "@/components/home/PostHeader";
import { PostEngagementBar } from "@/components/home/PostEngagementBar";
import { BookServiceButton } from "@/components/home/BookServiceButton";
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
  const { comments, commentsOpen, toggleComments, addComment } = usePostComments(post.id, post.comments);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const images = post.images ?? [];

  // Matches PropertyListingCard's exact badge (Figma node 3340:2487) —
  // shown on the first/hero tile only, same placement as that card.
  const listingBadge =
    post.tag === "property" && post.propertyDetails ? (
      <span className="absolute top-4 left-4 rounded bg-brand-gold-dark px-2 py-1 text-[10px] font-semibold tracking-[0.5px] text-white uppercase shadow-sm">
        {post.propertyDetails.listingType}
      </span>
    ) : null;

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
    <article className="flex w-full shrink-0 flex-col gap-4 rounded-[19px] border border-border bg-white p-6 lg:rounded-[24px]">
      <PostHeader post={post} />

      {post.tag && (
        <span className="flex w-fit items-center gap-1.5 rounded-full bg-surface-muted px-3 py-1 text-xs font-semibold text-brand-navy">
          <DynamicIcon name={TAG_ICON[post.tag]} className="size-3.5" />
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
          {listingBadge}
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
              {i === 0 && listingBadge}
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
            {listingBadge}
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

      {post.tag === "property" && post.propertyDetails && (
        // "Property Metadata Strip" (Figma node 3340:936/2446) — same
        // facts and same look as PropertyListingCard's on the Properties
        // page, so a property posted from here carries the same
        // information as one seeded there.
        <div className="-mx-6 flex items-center justify-between gap-3 border-y border-[#e9ecef] bg-[#f8f9fa] px-6 py-3">
          {/* min-w-0 so a long free-text propertyType (e.g. "4 Bedroom
              Detached House With Pool And Garden") truncates instead of
              wrapping onto the beds/baths/sqm stats' column and squeezing
              them off a narrow screen. */}
          <div className="min-w-0">
            <p className="truncate font-heading text-2xl font-semibold text-ink">{post.propertyDetails.price}</p>
            <p className="truncate text-[13px] text-muted">{post.propertyDetails.propertyType}</p>
          </div>
          <div className="flex shrink-0 items-center gap-4 text-[13px] text-ink/80">
            <span className="flex items-center gap-1">
              <DynamicIcon name="BedDouble" className="size-3.5" />
              {post.propertyDetails.beds}
            </span>
            <span className="flex items-center gap-1">
              <DynamicIcon name="Bath" className="size-3.5" />
              {post.propertyDetails.baths}
            </span>
            <span className="flex items-center gap-1">
              <DynamicIcon name="Ruler" className="size-3.5" />
              {post.propertyDetails.areaSqm} sqm
            </span>
          </div>
        </div>
      )}

      {post.tag === "venue" && post.venueDetails && (
        // "Property Metadata Strip" from Figma (node 3340:936, part of
        // "Article - Post 1: Property Listing" — node 3303:5351) — a
        // full-bleed light strip between the gallery and the action bar,
        // price + context on the left, the one key stat on the right
        // (that post shows "4 Bedrooms"; a venue's equivalent stat is its
        // own bedroom count, not guest capacity).
        <div className="-mx-6 flex items-center justify-between gap-3 border-y border-[#e9ecef] bg-[#f8f9fa] px-6 py-3">
          {/* min-w-0 + truncate: same reasoning as the property strip above
              — a venue's free-text name/location can run long. */}
          <div className="min-w-0">
            <p className="truncate font-heading text-2xl font-semibold text-ink">
              GHS {post.venueDetails.pricePerNight.toLocaleString()} / night
            </p>
            <p className="truncate text-[13px] text-muted">
              {post.venueDetails.name} • {post.venueDetails.location}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1.5 text-[13px] text-ink/70">
            <DynamicIcon name="BedDouble" className="size-4" />
            {post.venueDetails.bedrooms} Bedrooms
          </div>
        </div>
      )}

      {post.poll && <PollBlock poll={post.poll} />}

      {/* Every post tag renders the exact same PostEngagementBar now --
          service/venue posts used to get a distinct "Social Interactions &
          Actions" bar (ServiceActionsBar, circular icon-only Share/Save,
          no RepostButton reuse) modeled on the Figma Service/Promotion
          post (node 3303:5412), but that meant a venue or service post's
          icons never quite matched a plain post's. Only the `cta` itself
          still varies by tag. */}
      <PostEngagementBar
        post={post}
        commentsOpen={commentsOpen}
        onToggleComments={toggleComments}
        cta={
          post.tag === "service" ? (
            <BookServiceButton providerName={post.author.name} />
          ) : post.tag === "venue" ? (
            <VenueReservationButton venueName={post.author.name} hotelId={post.hotelId} />
          ) : post.tag === "property" ? (
            <PropertyEnquiryButton listerName={post.author.name} propertyId={post.propertyId} />
          ) : undefined
        }
      />
      {commentsOpen && <CommentsSection comments={comments} onAddComment={addComment} />}

      {lightboxIndex !== null && (
        <PostImageLightbox images={images} initialIndex={lightboxIndex} onClose={() => setLightboxIndex(null)} />
      )}
    </article>
  );
}
