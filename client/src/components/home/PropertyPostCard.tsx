"use client";

import { useState } from "react";
import Image from "next/image";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { PostHeader } from "@/components/home/PostHeader";
import { PostEngagementBar } from "@/components/home/PostEngagementBar";
import { CommentsSection } from "@/components/home/CommentsSection";
import { PostImageLightbox } from "@/components/home/PostImageLightbox";
import { usePostComments } from "@/hooks/usePostComments";
import type { GalleryImage, PropertyPost } from "@/types/home";

/** "Article - Post: Property Listing" — body copy, image gallery, reactions, actions. */
export function PropertyPostCard({ post }: { post: PropertyPost }) {
  const images = post.images;
  const { comments, commentsOpen, toggleComments, addComment, commentsCount } = usePostComments(
    post.id,
    post.comments,
    post.commentsCount,
  );
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Same reasoning as GeneralPostCard's renderImage: next/image can't
  // decode a video src, so a video attachment needs its own muted preview
  // + play badge instead of silently rendering as a broken <Image>.
  function renderThumb(image: GalleryImage) {
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
    return <Image src={image.src} alt={image.alt} fill className="object-cover" />;
  }

  return (
    <article className="flex w-full shrink-0 flex-col overflow-hidden rounded-[19px] border border-border bg-white lg:rounded-[24px]">
      <div className="flex flex-col gap-4 px-6 pt-6 pb-10">
        <PostHeader post={post} />
        <div className="text-base leading-relaxed text-ink">
          {post.body.map((line) => (
            <p key={line}>{line}</p>
          ))}
          <p className="text-brand-gold">{post.hashtags}</p>
        </div>
      </div>

      {images.length === 1 && (
        <button
          aria-label="View photo 1"
          onClick={() => setLightboxIndex(0)}
          className="relative h-[280px] w-full cursor-zoom-in sm:h-[400px]"
        >
          {renderThumb(images[0])}
        </button>
      )}

      {images.length === 2 && (
        <div className="grid grid-cols-2 gap-1 px-1">
          {images.map((image, i) => (
            <button
              key={i}
              aria-label={`View photo ${i + 1}`}
              onClick={() => setLightboxIndex(i)}
              className="relative h-[280px] cursor-zoom-in sm:h-[400px]"
            >
              {renderThumb(image)}
            </button>
          ))}
        </div>
      )}

      {images.length >= 3 && (
        <div className="grid grid-cols-3 gap-1 px-1">
          <button
            aria-label="View photo 1"
            onClick={() => setLightboxIndex(0)}
            className="relative col-span-2 row-span-2 h-[280px] cursor-zoom-in sm:h-[400px]"
          >
            {renderThumb(images[0])}
            <span className="absolute top-4 right-4 rounded bg-brand-navy/80 px-2 py-1 text-xs text-white">
              1/{images.length}
            </span>
          </button>
          <button
            aria-label="View photo 2"
            onClick={() => setLightboxIndex(1)}
            className="relative h-[137px] cursor-zoom-in sm:h-[199px]"
          >
            {renderThumb(images[1])}
          </button>
          <button
            aria-label="View photo 3"
            onClick={() => setLightboxIndex(2)}
            className="relative h-[137px] cursor-zoom-in sm:h-[199px]"
          >
            {renderThumb(images[2])}
          </button>
        </div>
      )}

      {lightboxIndex !== null && (
        <PostImageLightbox
          images={images}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}

      {/* The old separate "❤ N likes · N Comments · N Shares" summary row
          that used to live here is gone — PostEngagementBar shows the same
          Like/Comment counts inline on its own icons now, and Share no
          longer has a visible count anywhere (see its own commit for why
          Share dropped out of this bar entirely). */}
      <div className="flex w-full flex-col gap-6 p-6">
        <PostEngagementBar
          post={post}
          commentsOpen={commentsOpen}
          onToggleComments={toggleComments}
          commentsCount={commentsCount}
        />
        {commentsOpen && <CommentsSection comments={comments} onAddComment={addComment} />}
      </div>
    </article>
  );
}
