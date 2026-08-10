"use client";

import { useState } from "react";
import Image from "next/image";
import { PostHeader } from "@/components/home/PostHeader";
import { CommentsSection } from "@/components/home/CommentsSection";
import { PostImageLightbox } from "@/components/home/PostImageLightbox";
import { PostEngagementBar } from "@/components/home/PostEngagementBar";
import { BookServiceButton } from "@/components/home/BookServiceButton";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { usePostComments } from "@/hooks/usePostComments";
import type { ServicePost } from "@/types/home";

/** "Article - Post: Service/Promotion" — lighter footer with a direct booking CTA. */
export function ServicePostCard({ post }: { post: ServicePost }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const { comments, commentsOpen, toggleComments, addComment } = usePostComments(post.id, post.comments);

  return (
    <article className="flex w-full shrink-0 flex-col gap-4 rounded-[19px] border border-border bg-white p-6 lg:rounded-[24px]">
      <PostHeader post={post} />

      <div className="text-base leading-relaxed text-ink">
        {post.body.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>

      <button
        aria-label="View photo"
        onClick={() => setLightboxOpen(true)}
        className="relative h-64 w-full cursor-zoom-in overflow-hidden rounded-xl border border-border-subtle"
      >
        {/* Same reasoning as GeneralPostCard's renderImage: next/image can't
            decode a video src, so a video attachment needs its own muted
            preview + play badge instead of rendering as a broken <Image>. */}
        {post.image.type === "video" ? (
          <>
            <video src={post.image.src} muted playsInline className="size-full object-cover" />
            <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <span className="flex size-10 items-center justify-center rounded-full bg-black/50">
                <DynamicIcon name="Play" className="size-4 fill-white text-white" />
              </span>
            </span>
          </>
        ) : (
          <Image src={post.image.src} alt={post.image.alt} fill className="object-cover" />
        )}
      </button>

      {lightboxOpen && (
        <PostImageLightbox
          images={[post.image]}
          initialIndex={0}
          onClose={() => setLightboxOpen(false)}
        />
      )}

      <PostEngagementBar
        post={post}
        commentsOpen={commentsOpen}
        onToggleComments={toggleComments}
        cta={<BookServiceButton providerName={post.author.name} artisanId={post.providerId} />}
      />

      {commentsOpen && <CommentsSection comments={comments} onAddComment={addComment} />}
    </article>
  );
}
