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

/** Renders posts created through the composer modal (text + at most one of
 * photos / a property-or-service tag / a poll) — not a Figma frame, built to
 * match the two feed-post variants that are. */
export function GeneralPostCard({ post }: { post: GeneralPost }) {
  const { comments, commentsOpen, toggleComments, addComment } = usePostComments(post.comments);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

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

      {post.images && post.images.length > 0 && (
        <div className={post.images.length === 1 ? "" : "grid grid-cols-2 gap-1"}>
          {post.images.map((image, i) => (
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

      {post.images && lightboxIndex !== null && (
        <PostImageLightbox
          images={post.images}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </article>
  );
}
