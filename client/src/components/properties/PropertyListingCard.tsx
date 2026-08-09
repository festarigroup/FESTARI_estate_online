"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { PostHeader } from "@/components/home/PostHeader";
import { PostImageLightbox } from "@/components/home/PostImageLightbox";
import { CommentsSection } from "@/components/home/CommentsSection";
import { useSavedPosts } from "@/hooks/useSavedPosts";
import { usePostShare } from "@/hooks/usePostShare";
import { usePostComments } from "@/hooks/usePostComments";
import { likePost, unlikePost } from "@/lib/api/feed";
import { cn } from "@/lib/cn";
import type { PropertyPost } from "@/types/home";

/** "Article - Property Card" from the Properties page (Figma node
 * 3340:1485, card instances e.g. 3340:2425) — a close cousin of
 * PropertyPostCard, but scoped to this listing page specifically: a "View
 * Details" CTA and the full beds/baths/sqm metadata strip. Same
 * `PropertyPost` data (Ama Serwaa's listing renders on both the Home feed
 * via PropertyPostCard and here via this component), just a different
 * presentation for a different context — PropertyPostCard's Home-feed CTA
 * was removed at explicit request earlier, so that decision is left alone
 * rather than reintroduced through a shared component. */
export function PropertyListingCard({ listing }: { listing: PropertyPost }) {
  const [liked, setLiked] = useState(!!listing.isLiked);
  const [likeCount, setLikeCount] = useState(listing.reactions.likes);
  const { isSaved, toggleSave } = useSavedPosts();
  const saved = isSaved(listing.id);
  const { handleShare } = usePostShare(listing);
  const { comments, commentsOpen, toggleComments, addComment } = usePostComments(listing.id, listing.comments);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const images = listing.images;

  function handleLike() {
    const next = !liked;
    setLiked(next);
    setLikeCount((c) => (next ? c + 1 : c - 1));
    const request = next ? likePost(listing.id) : unlikePost(listing.id);
    request.catch(() => {
      setLiked(!next);
      setLikeCount((c) => (next ? c - 1 : c + 1));
    });
  }

  const badge = (
    <span className="absolute top-3 left-3 rounded bg-brand-gold-dark px-2 py-1 text-[10px] font-semibold tracking-[0.5px] text-white uppercase shadow-sm">
      {listing.listingType}
    </span>
  );

  return (
    <article className="flex w-full flex-col overflow-hidden rounded-xl border border-border-subtle bg-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
      <div className="flex flex-col gap-3 p-4 pb-3">
        <PostHeader post={listing} />
        <div>
          <div className="text-sm leading-relaxed text-ink">
            {listing.body.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
          <p className="text-sm text-brand-gold-dark">{listing.hashtags}</p>
        </div>
      </div>

      {/* Media Area (Bento-style grid) — adapts to however many photos this
          listing actually has, rather than always assuming three. */}
      {images.length === 1 && (
        <button
          aria-label="View photo 1"
          onClick={() => setLightboxIndex(0)}
          className="relative h-[320px] w-full cursor-zoom-in overflow-hidden"
        >
          <Image src={images[0].src} alt={images[0].alt} fill className="object-cover" />
          {badge}
        </button>
      )}

      {images.length === 2 && (
        <div className="grid grid-cols-2 gap-1">
          <button
            aria-label="View photo 1"
            onClick={() => setLightboxIndex(0)}
            className="relative h-[320px] cursor-zoom-in overflow-hidden"
          >
            <Image src={images[0].src} alt={images[0].alt} fill className="object-cover" />
            {badge}
          </button>
          <button
            aria-label="View photo 2"
            onClick={() => setLightboxIndex(1)}
            className="relative h-[320px] cursor-zoom-in overflow-hidden"
          >
            <Image src={images[1].src} alt={images[1].alt} fill className="object-cover" />
          </button>
        </div>
      )}

      {images.length >= 3 && (
        <div className="grid grid-cols-2 gap-1">
          <button
            aria-label="View photo 1"
            onClick={() => setLightboxIndex(0)}
            className="relative h-[320px] cursor-zoom-in overflow-hidden"
          >
            <Image src={images[0].src} alt={images[0].alt} fill className="object-cover" />
            {badge}
          </button>
          <div className="grid grid-rows-2 gap-1">
            <button
              aria-label="View photo 2"
              onClick={() => setLightboxIndex(1)}
              className="relative h-[158px] cursor-zoom-in overflow-hidden"
            >
              <Image src={images[1].src} alt={images[1].alt} fill className="object-cover" />
              <span className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-brand-navy/80 px-2.5 py-1 text-xs text-white backdrop-blur-[2px]">
                <DynamicIcon name="ImageIcon" className="size-3" />
                1/{listing.totalImages}
              </span>
            </button>
            <button
              aria-label="View photo 3"
              onClick={() => setLightboxIndex(2)}
              className="relative h-[158px] cursor-zoom-in overflow-hidden"
            >
              <Image src={images[2].src} alt={images[2].alt} fill className="object-cover" />
            </button>
          </div>
        </div>
      )}

      {/* Property Metadata Strip (node 3340:2446) */}
      <div className="flex items-center justify-between border-y border-[#e9ecef] bg-[#f8f9fa] px-4 py-3">
        <div>
          <p className="font-heading text-2xl font-semibold text-ink">{listing.price}</p>
          <p className="text-[13px] text-muted">{listing.propertyType}</p>
        </div>
        <div className="flex items-center gap-4 text-[13px] text-ink/80">
          <span className="flex items-center gap-1">
            <DynamicIcon name="BedDouble" className="size-3.5" />
            {listing.beds}
          </span>
          <span className="flex items-center gap-1">
            <DynamicIcon name="Bath" className="size-3.5" />
            {listing.baths}
          </span>
          <span className="flex items-center gap-1">
            <DynamicIcon name="Ruler" className="size-3.5" />
            {listing.areaSqm} sqm
          </span>
        </div>
      </div>

      {/* Social Interactions & Actions (node 3340:2465) */}
      <div className="flex items-center justify-between px-4 py-3">
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
            onClick={() => toggleSave(listing)}
            className={cn(
              "flex size-9 items-center justify-center rounded-full border",
              saved
                ? "border-[rgba(119,90,25,0.3)] bg-[rgba(254,212,136,0.2)] text-brand-gold-dark"
                : "border-[#e9ecef] text-muted hover:bg-surface-muted",
            )}
          >
            <DynamicIcon name="Bookmark" className="size-4" fill={saved ? "currentColor" : "none"} />
          </button>
          {/* Matches the Button component's outline-gold variant exactly —
              inlined since Button renders a <button>, not a link, and this
              CTA needs to navigate to the listing's detail page. */}
          <Link
            href={`/properties/${listing.id}`}
            className="inline-flex items-center justify-center rounded-full border border-brand-gold-dark px-[21px] py-[9px] text-xs font-semibold tracking-[0.24px] text-brand-gold-dark hover:bg-brand-gold-dark/5"
          >
            View Details
          </Link>
        </div>
      </div>

      {commentsOpen && (
        <div className="px-4 pb-4">
          <CommentsSection comments={comments} onAddComment={addComment} />
        </div>
      )}

      {lightboxIndex !== null && (
        <PostImageLightbox images={images} initialIndex={lightboxIndex} onClose={() => setLightboxIndex(null)} />
      )}
    </article>
  );
}
