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

  // One layout always, cta or not -- used to branch between a
  // justify-between full-width spread (no CTA) and a clustered left group
  // (with one), which meant a plain post's icon-to-icon spacing never
  // actually matched a tagged post's: `justify-between` stretches its gaps
  // to fill the whole row width, `gap-5` doesn't. Clustering left
  // unconditionally is what makes every post's Like-to-Comment-to-Repost-
  // to-Share-to-Save spacing identical, cta or no cta, at every width.
  //
  // The CTA (when there is one) drops to its own full-width row below that
  // group at mobile widths (sm:w-auto un-stacks it back onto the same row,
  // right-aligned, once there's room) rather than crowding in next to five
  // icons on a phone-width card — `[&>*]:w-full` on that wrapper is what
  // actually stretches whatever gets passed as `cta` (a single button/
  // link, or a caller's own multi-button group), not a width prop on the
  // CTA component itself.
  return (
    <div className="flex w-full flex-wrap items-center gap-3 border-t border-border-subtle pt-[17px]">
      <div className="flex items-center gap-5">{actions}</div>
      {cta && <div className="w-full [&>*]:w-full sm:ml-auto sm:w-auto sm:[&>*]:w-auto">{cta}</div>}
    </div>
  );
}
