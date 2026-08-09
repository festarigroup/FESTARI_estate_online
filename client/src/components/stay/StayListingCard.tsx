"use client";

import { useState } from "react";
import Image from "next/image";
import { DynamicIcon, type IconName } from "@/components/ui/DynamicIcon";
import { PostHeader } from "@/components/home/PostHeader";
import { PostImageLightbox } from "@/components/home/PostImageLightbox";
import { CommentsSection } from "@/components/home/CommentsSection";
import { VenueMessageButton } from "@/components/home/VenueMessageButton";
import { VenueReservationButton } from "@/components/home/VenueReservationButton";
import { useSavedPosts } from "@/hooks/useSavedPosts";
import { usePostShare } from "@/hooks/usePostShare";
import { usePostComments } from "@/hooks/usePostComments";
import { likePost, unlikePost } from "@/lib/api/feed";
import { AMENITIES } from "@/lib/mock-data";
import { isLocalPreviewUrl } from "@/lib/is-local-preview-url";
import { cn } from "@/lib/cn";
import type { GalleryImage, GeneralPost } from "@/types/home";

const AMENITY_ICON: Record<string, IconName> = Object.fromEntries(AMENITIES.map((a) => [a.id, a.icon]));

// One big tile plus up to two stacked beside it — never more than this many
// tiles inline, same convention GeneralPostCard's own grid uses; the hero
// tile picks up a "1/N" badge once a listing has more photos than that.
const GRID_LIMIT = 3;

/** "Article - Post: Property Listing" from the Stay page (Figma node
 * 3384:8282) — a close cousin of GeneralPostCard's own venue-tag rendering,
 * scoped to this listing page specifically: a category badge, star rating,
 * amenity chips, and a Message + Reserve pair instead of the single "Make a
 * Reservation" CTA the Home feed's card uses. Same `GeneralPost` data (a
 * venue posted from here also renders via GeneralPostCard wherever else it
 * might show up), just a different presentation for a different context —
 * mirrors exactly how PropertyListingCard relates to PropertyPostCard. */
export function StayListingCard({ post }: { post: GeneralPost }) {
  const venue = post.venueDetails;
  const [liked, setLiked] = useState(!!post.isLiked);
  const [likeCount, setLikeCount] = useState(post.reactions?.likes ?? 0);
  const { isSaved, toggleSave } = useSavedPosts();
  const saved = isSaved(post.id);
  const { handleShare } = usePostShare(post);
  const { comments, commentsOpen, toggleComments, addComment } = usePostComments(post.id, post.comments);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const images = post.images ?? [];

  // Callers only ever render this for a venue-tagged post — guarded rather
  // than assumed, since `venueDetails` is still optional on the shared
  // GeneralPost type.
  if (!venue) return null;

  function handleLike() {
    const next = !liked;
    setLiked(next);
    setLikeCount((c) => (next ? c + 1 : c - 1));
    const request = next ? likePost(post.id) : unlikePost(post.id);
    request.catch(() => {
      setLiked(!next);
      setLikeCount((c) => (next ? c - 1 : c + 1));
    });
  }

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

      {/* Social Interactions & Actions (Figma node 3384:8328) */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-6">
          <button
            onClick={handleLike}
            className={cn(
              "flex items-center gap-2 text-xs font-semibold",
              liked ? "text-brand-rust" : "text-[#44474e] hover:text-ink",
            )}
          >
            <DynamicIcon name="Heart" className="size-5" fill={liked ? "currentColor" : "none"} />
            {likeCount}
          </button>
          <button
            onClick={toggleComments}
            aria-expanded={commentsOpen}
            className={cn(
              "flex items-center gap-2 text-xs font-semibold",
              commentsOpen ? "text-brand-navy" : "text-[#44474e] hover:text-ink",
            )}
          >
            <DynamicIcon name="MessageCircle" className="size-5" />
            {comments.length}
          </button>
        </div>
        <div className="flex items-center gap-3">
          <button
            aria-label="Share"
            onClick={handleShare}
            className="flex size-9 items-center justify-center rounded-full border border-[#e9ecef] text-muted hover:bg-surface-muted"
          >
            <DynamicIcon name="Share2" className="size-4" />
          </button>
          <button
            aria-label={saved ? "Remove from saved" : "Save"}
            onClick={() => toggleSave(post)}
            className={cn(
              "flex size-9 items-center justify-center rounded-full border",
              saved
                ? "border-[rgba(119,90,25,0.3)] bg-[rgba(254,212,136,0.2)] text-brand-gold-dark"
                : "border-[#e9ecef] text-muted hover:bg-surface-muted",
            )}
          >
            <DynamicIcon name="Bookmark" className="size-4" fill={saved ? "currentColor" : "none"} />
          </button>
          <VenueMessageButton venueName={venue.name} />
          <VenueReservationButton venueName={venue.name} variant="gold-pill" label="Reserve" />
        </div>
      </div>

      {commentsOpen && (
        <CommentsSection comments={comments} onAddComment={addComment} />
      )}

      {lightboxIndex !== null && (
        <PostImageLightbox images={images} initialIndex={lightboxIndex} onClose={() => setLightboxIndex(null)} />
      )}
    </article>
  );
}
