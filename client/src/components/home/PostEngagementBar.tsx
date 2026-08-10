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
  /** Extra CTA rendered on the right — BookServiceButton for a service
   * post, VenueReservationButton for a venue post, PropertyEnquiryButton
   * for a property post — kept optional here since a plain post doesn't
   * have one. */
  cta?: React.ReactNode;
}

/** Like / Comment / Repost / Share / Save action row, shared by every post
 * everywhere in this app -- feed posts of every tag, and both the Stay and
 * Properties listing pages' own cards -- so a venue or service post's
 * icons are never a slightly-different lookalike of a plain post's. (Used
 * to fork into a second bar, ServiceActionsBar, for service/venue posts
 * specifically -- circular icon-only Share/Save instead of these labeled
 * ones, a comment *count* instead of just "Comment" -- retired once that
 * turned out to be exactly the mismatch users kept noticing.) */
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
  const likeButton = (
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
  );

  const commentButton = (
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
  );

  const shareButton = (
    <button onClick={handleShare} className="flex items-center gap-2 text-base font-medium text-muted hover:text-ink">
      <DynamicIcon name="Share2" className="size-5" />
      <span className="sr-only sm:not-sr-only">Share</span>
    </button>
  );

  const saveButton = (
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
  );

  // Share/Save move down next to the CTA at mobile widths only, when
  // there is one -- rendered twice (once here, hidden below sm:; once in
  // the CTA row, hidden from sm: up) rather than reflowed with CSS order,
  // since the two copies live in genuinely different flex containers (this
  // row vs. the CTA row) that plain `order` can't move an element between.
  // Both copies close over the exact same `saved`/handleSave/handleShare
  // above, so there's no separate state to keep in sync -- only whichever
  // copy is actually visible at a given width can be interacted with.
  // With no CTA at all (a plain post), there's nowhere to send them, so
  // they just stay put at every width.
  return (
    <div className="flex w-full flex-wrap items-center gap-3 border-t border-border-subtle pt-[17px]">
      <div className="flex items-center gap-5">
        {likeButton}
        {commentButton}
        <RepostButton postId={post.id} />
        {cta ? (
          <span className="hidden items-center gap-5 sm:flex">
            {shareButton}
            {saveButton}
          </span>
        ) : (
          <>
            {shareButton}
            {saveButton}
          </>
        )}
      </div>
      {cta && (
        <div className="flex w-full items-center gap-4 sm:ml-auto sm:w-auto">
          <span className="flex items-center gap-5 sm:hidden">
            {shareButton}
            {saveButton}
          </span>
          <div className="flex-1 [&>*]:w-full sm:w-auto sm:flex-none sm:[&>*]:w-auto">{cta}</div>
        </div>
      )}
    </div>
  );
}
