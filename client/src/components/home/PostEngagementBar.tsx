"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { RepostButton } from "@/components/home/RepostButton";
import { useSavedPosts } from "@/hooks/useSavedPosts";
import { usePostShare } from "@/hooks/usePostShare";
import { likePost, unlikePost } from "@/lib/api/feed";
import { cn } from "@/lib/cn";
import type { ContentPost } from "@/types/home";

interface PostEngagementBarProps {
  post: ContentPost;
  commentsOpen: boolean;
  onToggleComments: () => void;
  /** Called after a real share completes (native share sheet or copy-to-clipboard),
   * so a parent that displays a share count (PropertyPostCard) can bump it. */
  onShare?: () => void;
  /** Extra CTA rendered on the right, e.g. PropertyEnquiryButton for a
   * property-tagged post — same "primary action" slot ServiceActionsBar's
   * Book Service button occupies, just kept optional here since most
   * posts don't have one. */
  cta?: React.ReactNode;
}

/** Like / Comment / Repost / Share / Save action row, shared by every feed post variant. */
export function PostEngagementBar({ post, commentsOpen, onToggleComments, onShare, cta }: PostEngagementBarProps) {
  const [liked, setLiked] = useState(!!post.isLiked);
  const { isSaved, toggleSave } = useSavedPosts();
  const saved = isSaved(post.id);
  const { handleShare } = usePostShare(post, onShare);

  function handleToggleLike() {
    const next = !liked;
    setLiked(next);
    const request = next ? likePost(post.id) : unlikePost(post.id);
    request.catch(() => setLiked(!next));
  }

  function handleSave() {
    const wasSaved = saved;
    toggleSave(post);
    toast.success(wasSaved ? "Removed from saved." : "Saved. Find it under Saved in the sidebar.");
  }

  // Labels collapse to icon-only below sm: (the row cramped up badly at
  // phone widths with five text+icon actions competing for space) — sr-only
  // rather than a plain hidden, so the label stays in the accessible name
  // instead of leaving the button an unlabeled icon for screen readers.
  const actions = (
    <>
      <button
        onClick={handleToggleLike}
        className={cn(
          "flex items-center gap-2 text-base font-medium",
          liked ? "text-brand-rust" : "text-muted hover:text-ink",
        )}
      >
        <DynamicIcon name="Heart" className="size-5" fill={liked ? "currentColor" : "none"} />
        <span className="sr-only sm:not-sr-only">Like</span>
      </button>
      <button
        onClick={onToggleComments}
        aria-expanded={commentsOpen}
        className={cn(
          "flex items-center gap-2 text-base font-medium",
          commentsOpen ? "text-brand-navy" : "text-muted hover:text-ink",
        )}
      >
        <DynamicIcon name="MessageCircle" className="size-5" />
        <span className="sr-only sm:not-sr-only">Comment</span>
      </button>
      <RepostButton postId={post.id} />
      <button
        onClick={handleShare}
        className="flex items-center gap-2 text-base font-medium text-muted hover:text-ink"
      >
        <DynamicIcon name="Share2" className="size-5" />
        <span className="sr-only sm:not-sr-only">Share</span>
      </button>
      <button
        onClick={handleSave}
        className={cn(
          "flex items-center gap-2 text-base font-medium",
          saved ? "text-brand-navy" : "text-muted hover:text-ink",
        )}
      >
        <DynamicIcon name="Bookmark" className="size-5" fill={saved ? "currentColor" : "none"} />
        <span className="sr-only sm:not-sr-only">Save</span>
      </button>
    </>
  );

  // With no CTA (the common case), the five actions spread evenly across
  // the full row exactly as before. With one, they cluster into a left
  // group so the CTA gets real room on the right — a different spacing
  // rule, which is why this branches instead of always wrapping in a group.
  if (cta) {
    return (
      <div className="flex w-full items-center justify-between border-t border-border-subtle pt-[17px]">
        <div className="flex items-center gap-4">{actions}</div>
        {cta}
      </div>
    );
  }

  return (
    <div className="flex w-full items-center justify-between border-t border-border-subtle pt-[17px]">
      {actions}
    </div>
  );
}
