"use client";

import { useState } from "react";
import Image from "next/image";
import { DynamicIcon, type IconName } from "@/components/ui/DynamicIcon";
import { PostHeader } from "@/components/home/PostHeader";
import { PostImageLightbox } from "@/components/home/PostImageLightbox";
import { CommentsSection } from "@/components/home/CommentsSection";
import { PostEngagementBar } from "@/components/home/PostEngagementBar";
import { VenueMessageButton } from "@/components/home/VenueMessageButton";
import { VenueReservationButton } from "@/components/home/VenueReservationButton";
import { usePostComments } from "@/hooks/usePostComments";
import { AMENITIES } from "@/lib/mock-data";
import { isLocalPreviewUrl } from "@/lib/is-local-preview-url";
import type { GalleryImage, GeneralPost } from "@/types/home";

const AMENITY_ICON: Record<string, IconName> = Object.fromEntries(AMENITIES.map((a) => [a.id, a.icon]));

// One big tile plus up to two stacked beside it — never more than this many
// tiles inline, same convention GeneralPostCard's own grid uses; the hero
// tile picks up a "1/N" badge once a listing has more photos than that.
const GRID_LIMIT = 3;

/** "Article - Post: Property Listing" from the Stay page (Figma node
 * 3384:8282) — a close cousin of GeneralPostCard's own venue-tag rendering,
 * scoped to this listing page specifically: a category badge, star rating,
 * and amenity chips above the action bar. Same `GeneralPost` data (a venue
 * posted from here also renders via GeneralPostCard wherever else it might
 * show up), just a different presentation for a different context — mirrors
 * exactly how PropertyListingCard relates to PropertyPostCard.
 *
 * The action bar itself is PostEngagementBar -- the exact same Like/
 * Comment/Repost/Share/Save bar every post on the Home feed renders,
 * venue-tagged or not (GeneralPostCard routes every tag through this one
 * component now — see its own doc comment for why the venue/service-only
 * ServiceActionsBar variant was retired) -- rather than a bespoke one that
 * only approximated it. Message + Reserve ride together in
 * PostEngagementBar's single `cta` slot as one wrapped pair, since this
 * card needs two direct actions where a plain post only ever has one. */
export function StayListingCard({ post }: { post: GeneralPost }) {
  const venue = post.venueDetails;
  const { comments, commentsOpen, toggleComments, addComment } = usePostComments(post.id, post.comments);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const images = post.images ?? [];

  // Callers only ever render this for a venue-tagged post — guarded rather
  // than assumed, since `venueDetails` is still optional on the shared
  // GeneralPost type.
  if (!venue) return null;

  function renderImage(image: GalleryImage) {
    if (image.type === "video") {
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

  const categoryBadge = (
    <span className="absolute top-4 left-4 rounded bg-brand-gold-dark px-2 py-1 text-[10px] font-semibold tracking-[0.5px] text-white uppercase shadow-sm">
      {venue.category}
    </span>
  );

  return (
    <article className="flex w-full shrink-0 flex-col gap-4 overflow-hidden rounded-[39px] border border-border bg-white p-6">
      <PostHeader post={post} />

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
          {categoryBadge}
        </button>
      )}

      {images.length === 2 && (
        <div className="grid grid-cols-2 gap-1">
          {images.map((image, i) => (
            <button
              key={i}
              aria-label={`View photo ${i + 1}`}
              onClick={() => setLightboxIndex(i)}
              className="relative h-[280px] cursor-zoom-in overflow-hidden rounded-lg sm:h-[400px]"
            >
              {renderImage(image)}
              {i === 0 && categoryBadge}
            </button>
          ))}
        </div>
      )}

      {images.length >= GRID_LIMIT && (
        <div className="grid grid-cols-3 gap-1">
          <button
            aria-label="View photo 1"
            onClick={() => setLightboxIndex(0)}
            className="relative col-span-2 row-span-2 h-[280px] cursor-zoom-in overflow-hidden rounded-lg sm:h-[400px]"
          >
            {renderImage(images[0])}
            {categoryBadge}
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

      {/* Property Metadata Strip (Figma node 3387:8880) — price/night and
          the venue's name+rating on the left, amenity chips on the right. */}
      <div className="flex items-center justify-between gap-4 border-y border-[#e9ecef] py-3">
        <div>
          <p className="font-heading text-2xl font-semibold text-ink">
            GHS {venue.pricePerNight.toLocaleString()} <span className="text-sm font-normal text-muted">/night</span>
          </p>
          <div className="flex items-center gap-1.5 text-[13px] text-ink/80">
            <span>{venue.name}</span>
            {typeof venue.rating === "number" && (
              <span className="flex items-center gap-1 font-semibold text-brand-gold-dark">
                <DynamicIcon name="Star" className="size-3.5 fill-current" />
                {venue.rating.toFixed(1)}
              </span>
            )}
          </div>
        </div>
        {venue.amenities && venue.amenities.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {venue.amenities.map((amenity) => (
              <span
                key={amenity}
                className="flex items-center gap-1.5 rounded-md bg-surface-muted-2 px-2 py-1 text-xs text-muted"
              >
                <DynamicIcon name={AMENITY_ICON[amenity] ?? "Check"} className="size-3.5" />
                {amenity}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Social Interactions & Actions (Figma node 3384:8328) -- see this
          component's own doc comment for why it's PostEngagementBar rather
          than a bespoke row. */}
      <PostEngagementBar
        post={post}
        commentsOpen={commentsOpen}
        onToggleComments={toggleComments}
        cta={
          <div className="flex gap-2">
            <VenueMessageButton venueName={venue.name} />
            <VenueReservationButton venueName={venue.name} hotelId={post.hotelId} variant="gold-pill" label="Reserve" />
          </div>
        }
      />

      {commentsOpen && (
        <CommentsSection comments={comments} onAddComment={addComment} />
      )}

      {lightboxIndex !== null && (
        <PostImageLightbox images={images} initialIndex={lightboxIndex} onClose={() => setLightboxIndex(null)} />
      )}
    </article>
  );
}
