"use client";

import { useState } from "react";
import Image from "next/image";
import { PostHeader } from "@/components/home/PostHeader";
import { CommentsSection } from "@/components/home/CommentsSection";
import { PostImageLightbox } from "@/components/home/PostImageLightbox";
import { ServiceActionsBar } from "@/components/home/ServiceActionsBar";
import { BookServiceButton } from "@/components/home/BookServiceButton";
import { usePostComments } from "@/hooks/usePostComments";
import type { ServicePost } from "@/types/home";

/** "Article - Post: Service/Promotion" — lighter footer with a direct booking CTA. */
export function ServicePostCard({ post }: { post: ServicePost }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const { comments, commentsOpen, toggleComments, addComment } = usePostComments(post.id, post.comments);

  return (
    <article className="flex w-full shrink-0 flex-col gap-4 rounded-[39px] bg-white p-6 drop-shadow-[0px_4px_6px_rgba(0,31,63,0.08)]">
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
        <Image src={post.image.src} alt={post.image.alt} fill className="object-cover" />
      </button>

      {lightboxOpen && (
        <PostImageLightbox
          images={[post.image]}
          initialIndex={0}
          onClose={() => setLightboxOpen(false)}
        />
      )}

      <ServiceActionsBar
        post={post}
        commentsOpen={commentsOpen}
        onToggleComments={toggleComments}
        commentCount={comments.length}
        cta={<BookServiceButton providerName={post.author.name} artisanId={post.providerId} />}
      />

      {commentsOpen && <CommentsSection comments={comments} onAddComment={addComment} />}
    </article>
  );
}
