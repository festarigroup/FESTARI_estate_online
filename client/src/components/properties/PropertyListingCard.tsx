"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { PostHeader } from "@/components/home/PostHeader";
import { PostImageLightbox } from "@/components/home/PostImageLightbox";
import { CommentsSection } from "@/components/home/CommentsSection";
import { PostEngagementBar } from "@/components/home/PostEngagementBar";
import { usePostComments } from "@/hooks/usePostComments";
import type { PropertyPost } from "@/types/home";

/** "Article - Property Card" from the Properties page (Figma node
 * 3340:1485, card instances e.g. 3340:2425) — a close cousin of
 * PropertyPostCard, but scoped to this listing page specifically: a "View
 * Details" CTA and the full beds/baths/sqm metadata strip. Same
 * `PropertyPost` data (Ama Serwaa's listing renders on both the Home feed
 * via PropertyPostCard and here via this component), just a different
 * presentation for a different context.
 *
 * The action bar itself is PostEngagementBar -- the exact same Like/
 * Comment/Repost/Share/Save bar the Home feed's own PropertyPostCard would
 * render (PropertyPostCard's own CTA was removed at explicit request
 * earlier, so it renders that bar with no `cta` at all; this one passes
 * "View Details" as PostEngagementBar's `cta`) -- rather than a bespoke
 * bar that only approximated it. */
export function PropertyListingCard({ listing }: { listing: PropertyPost }) {
  const { comments, commentsOpen, toggleComments, addComment } = usePostComments(listing.id, listing.comments);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const images = listing.images;

  const badge = (
    <span className="absolute top-3 left-3 rounded bg-brand-gold-dark px-2 py-1 text-[10px] font-semibold tracking-[0.5px] text-white uppercase shadow-sm">
      {listing.listingType}
    </span>
  );

  return (
    <article className="flex w-full flex-col overflow-hidden rounded-[39px] border border-border-subtle bg-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
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

      {/* Property Metadata Strip (node 3340:2446). min-w-0 + truncate on the
          left side: `price`/`propertyType` are free text (e.g. "GHS 8,000 /
          month", "4 Bedroom Detached House") that can run long, and without
          this they'd wrap and squeeze the beds/baths/sqm stats off a narrow
          card instead of just truncating with an ellipsis. */}
      <div className="flex items-center justify-between gap-3 border-y border-[#e9ecef] bg-[#f8f9fa] px-4 py-3">
        <div className="min-w-0">
          <p className="truncate font-heading text-2xl font-semibold text-ink">{listing.price}</p>
          <p className="truncate text-[13px] text-muted">{listing.propertyType}</p>
        </div>
        <div className="flex shrink-0 items-center gap-4 text-[13px] text-ink/80">
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

      {/* Social Interactions & Actions (node 3340:2465) -- see this
          component's own doc comment for why it's PostEngagementBar rather
          than a bespoke row. No py- here: the bar's own border-t/pt-[17px]
          already supplies the gap from the metadata strip above, matching
          every other card that renders this same bar. */}
      <div className="px-4 pb-4">
        <PostEngagementBar
          post={listing}
          commentsOpen={commentsOpen}
          onToggleComments={toggleComments}
          cta={
            // Matches the Button component's outline-gold variant exactly —
            // inlined since Button renders a <button>, not a link, and this
            // CTA needs to navigate to the listing's detail page.
            <Link
              href={`/properties/${listing.id}`}
              className="inline-flex items-center justify-center rounded-full border border-brand-gold-dark px-[21px] py-[9px] text-xs font-semibold tracking-[0.24px] text-brand-gold-dark hover:bg-brand-gold-dark/5"
            >
              View Details
            </Link>
          }
        />
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
