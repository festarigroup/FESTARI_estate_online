"use client";

import { useState } from "react";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { RepostButton } from "@/components/home/RepostButton";
import { likePost, unlikePost } from "@/lib/api/feed";
import { cn } from "@/lib/cn";
import type { ContentPost } from "@/types/home";

interface PostEngagementBarProps {
  post: ContentPost;
  commentsOpen: boolean;
  onToggleComments: () => void;
  /** Extra CTA rendered on the right — BookServiceButton for a service
   * post, VenueReservationButton for a venue post, PropertyEnquiryButton
   * for a property post — kept optional here since a plain post doesn't
   * have one. */
  cta?: React.ReactNode;
}

/** Like / Comment / Repost action row, shared by every post everywhere in
 * this app -- feed posts of every tag, and both the Stay and Properties
 * listing pages' own cards -- so a venue or service post's icons are never
 * a slightly-different lookalike of a plain post's. (Used to fork into a
 * second bar, ServiceActionsBar, for service/venue posts specifically --
 * circular icon-only Share/Save instead of these labeled ones, a comment
 * *count* instead of just "Comment" -- retired once that turned out to be
 * exactly the mismatch users kept noticing.)
 *
 * Share and Save used to live here too (hidden below `sm:`), duplicating
 * PostHeader's "⋮" overflow menu (PostOptionsMenu), which already carries
 * both at every width. Dropped from this row entirely now that the
 * dropdown is the one place for them -- one icon row, not two competing
 * paths to the same action. */
export function PostEngagementBar({ post, commentsOpen, onToggleComments, cta }: PostEngagementBarProps) {
  const [liked, setLiked] = useState(!!post.isLiked);

  function handleToggleLike() {
    const next = !liked;
    setLiked(next);
    const request = next ? likePost(post.id) : unlikePost(post.id);
    request.catch(() => setLiked(!next));
  }

  // Labels collapse to icon-only below sm: (Like/Comment cramped up next to
  // a CTA at phone widths) — sr-only rather than a plain hidden, so the
  // label stays in the accessible name instead of leaving the button an
  // unlabeled icon for screen readers.
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
    </>
  );

  // One layout always, cta or not -- clustered left with a consistent
  // gap-5 rather than branching between that and a justify-between
  // full-width spread, so every post's icon-to-icon spacing is identical
  // whether or not it has a CTA. The CTA (when there is one) sits beside
  // that group on the same row at every width -- with only three icons
  // here now (Like/Comment/Repost), there's enough room for a
  // single-button CTA right there instead of needing its own line below.
  // flex-wrap is a safety net, not the normal case: StayListingCard's own
  // CTA is two buttons together (Message + Reserve, see its own doc
  // comment), which no longer fits beside three icons at the very narrowest
  // widths (~320px, e.g. iPhone SE) -- without it, Reserve clipped straight
  // off the edge of the card instead of the row just breaking onto a
  // second line the way any other wrapping content would.
  return (
    <div className="flex w-full flex-wrap items-center gap-3 border-t border-border-subtle pt-[17px]">
      <div className="flex items-center gap-5">{actions}</div>
      {cta && <div className="ml-auto flex flex-wrap items-center justify-end gap-2">{cta}</div>}
    </div>
  );
}
