"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { BookServiceModal } from "@/components/home/BookServiceModal";
import { RepostButton } from "@/components/home/RepostButton";
import { cn } from "@/lib/cn";

interface ServiceActionsBarProps {
  postId: string;
  /** Who "Book Service" sends the request to — the provider, not the viewer. */
  providerName: string;
  commentsOpen: boolean;
  onToggleComments: () => void;
  commentCount: number;
}

/** Like / Comment / Repost + a direct "Book Service" CTA — deliberately
 * lighter than PostEngagementBar (no Share/Save row): a service listing's
 * primary action is booking it, not sharing it, same distinction the
 * Figma file draws between the "Property Listing" and "Service/Promotion"
 * post variants. Shared by ServicePostCard and any GeneralPost tagged
 * "service" from the composer, so a service post looks and behaves the
 * same regardless of where it came from. Like/Comment labels collapse to
 * icon-only below sm: for the same cramped-mobile-row reason
 * PostEngagementBar's do. */
export function ServiceActionsBar({
  postId,
  providerName,
  commentsOpen,
  onToggleComments,
  commentCount,
}: ServiceActionsBarProps) {
  const [liked, setLiked] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);

  return (
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
        <RepostButton postId={postId} />
      </div>
      <Button variant="navy" onClick={() => setBookingOpen(true)} className="rounded-lg">
        Book Service
      </Button>

      <BookServiceModal open={bookingOpen} onClose={() => setBookingOpen(false)} providerName={providerName} />
    </div>
  );
}
