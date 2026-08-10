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

interface ServiceActionsBarProps {
  post: ContentPost;
  commentsOpen: boolean;
  onToggleComments: () => void;
  commentCount: number;
  /** The post's one direct-action CTA — BookServiceButton for a service
   * post, VenueReservationButton for a venue post (or a Message+Reserve
   * pair wrapped together, for the Stay page's own listing card). Same
   * slot PostEngagementBar's `cta` prop is, just always present here rather
   * than optional, since every post that reaches this bar has one. */
  cta: React.ReactNode;
}

/** Like / Comment / Repost / Share / Save + a direct booking CTA — the
 * "Social Interactions & Actions" bar from the Figma Service/Promotion post
 * (node 3340:1076), reproduced with this app's existing interactive
 * Like/Comment/Save affordances (toggle + label) rather than Figma's
 * static counts, since these buttons actually do something here. Shared by
 * every post whose primary action is booking something directly rather
 * than just sharing it — service posts, venue posts, and both listing
 * pages' own venue/property cards, so all four render the exact same bar
 * instead of each maintaining a near-but-not-quite-identical copy.
 *
 * Labels collapse to icon-only below sm: for the same cramped-mobile-row
 * reason PostEngagementBar's do. The CTA drops to its own full-width row
 * below the icon actions at mobile widths (sm:w-auto un-stacks it back
 * onto the same row, right-aligned, once there's room) rather than
 * crowding in next to five icons on a phone-width card -- the
 * `[&>*]:w-full` on that wrapper stretches whatever's actually passed as
 * `cta` (a single button, or a caller's own multi-button group) to fill
 * that row without every CTA component needing its own width prop. */
export function ServiceActionsBar({ post, commentsOpen, onToggleComments, commentCount, cta }: ServiceActionsBarProps) {
  const [liked, setLiked] = useState(!!post.isLiked);
  const { isSaved, toggleSave } = useSavedPosts();
  const saved = isSaved(post.id);
  const { handleShare } = usePostShare(post);

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

  return (
    <div className="flex w-full flex-wrap items-center gap-3 border-t border-border-subtle pt-[17px]">
      <div className="flex items-center gap-4">
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
          <span className="sr-only sm:not-sr-only">
            {commentCount > 0 ? `Comment (${commentCount})` : "Comment"}
          </span>
        </button>
        <RepostButton postId={post.id} />
        {/* Circular icon buttons, not text+icon rows — matches Figma's
            share/save buttons on this bar exactly (nodes 3340:1087/1090),
            distinct from PostEngagementBar's labeled style. */}
        <button
          aria-label="Share"
          onClick={handleShare}
          className="flex size-9 items-center justify-center rounded-full border border-[#e9ecef] text-muted hover:bg-surface-muted"
        >
          <DynamicIcon name="Share2" className="size-4" />
        </button>
        <button
          aria-label={saved ? "Remove from saved" : "Save"}
          onClick={handleSave}
          className={cn(
            "flex size-9 items-center justify-center rounded-full border",
            saved
              ? "border-[rgba(119,90,25,0.3)] bg-[rgba(254,212,136,0.2)] text-brand-gold-dark"
              : "border-[#e9ecef] text-muted hover:bg-surface-muted",
          )}
        >
          <DynamicIcon name="Bookmark" className="size-4" fill={saved ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="w-full [&>*]:w-full sm:ml-auto sm:w-auto sm:[&>*]:w-auto">{cta}</div>
    </div>
  );
}
