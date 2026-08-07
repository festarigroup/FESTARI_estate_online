"use client";

import { useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { Button } from "@/components/ui/Button";
import { PostHeader } from "@/components/home/PostHeader";
import { CommentsSection } from "@/components/home/CommentsSection";
import { PostImageLightbox } from "@/components/home/PostImageLightbox";
import { usePostComments } from "@/hooks/usePostComments";
import { cn } from "@/lib/cn";
import type { ServicePost } from "@/types/home";

/** "Article - Post: Service/Promotion" — lighter footer with a direct booking CTA. */
export function ServicePostCard({ post }: { post: ServicePost }) {
  const [liked, setLiked] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const { comments, commentsOpen, toggleComments, addComment } = usePostComments(post.comments);

  function handleBookService() {
    toast.success(`Booking request sent to ${post.author.name}.`);
  }

  return (
    <article className="flex w-full shrink-0 flex-col gap-4 rounded-xl bg-white p-6 drop-shadow-[0px_4px_6px_rgba(0,31,63,0.08)]">
      <PostHeader author={post.author} />

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

      <div className="flex w-full items-center justify-between border-t border-border-subtle pt-[17px]">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setLiked((v) => !v)}
            className={cn(
              "flex items-center gap-2 text-base font-medium",
              liked ? "text-brand-rust" : "text-muted hover:text-ink",
            )}
          >
            <DynamicIcon name="Heart" className="size-5" fill={liked ? "currentColor" : "none"} />
            Like
          </button>
          <button
            onClick={toggleComments}
            aria-expanded={commentsOpen}
            className={cn(
              "flex items-center gap-2 text-base font-medium",
              commentsOpen ? "text-brand-navy" : "text-muted hover:text-ink",
            )}
          >
            <DynamicIcon name="MessageCircle" className="size-5" />
            {comments.length > 0 ? `Comment (${comments.length})` : "Comment"}
          </button>
        </div>
        <Button variant="navy" onClick={handleBookService} className="rounded-lg">
          Book Service
        </Button>
      </div>

      {commentsOpen && <CommentsSection comments={comments} onAddComment={addComment} />}
    </article>
  );
}
