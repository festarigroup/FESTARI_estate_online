"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { useSavedPosts } from "@/hooks/useSavedPosts";
import { cn } from "@/lib/cn";
import type { FeedPost } from "@/types/home";

interface PostEngagementBarProps {
  post: FeedPost;
  commentsOpen: boolean;
  onToggleComments: () => void;
  /** Called after a real share completes (native share sheet or copy-to-clipboard),
   * so a parent that displays a share count (PropertyPostCard) can bump it. */
  onShare?: () => void;
}

/** Like / Comment / Share / Save action row, shared by every feed post variant. */
export function PostEngagementBar({ post, commentsOpen, onToggleComments, onShare }: PostEngagementBarProps) {
  const [liked, setLiked] = useState(false);
  const { isSaved, toggleSave } = useSavedPosts();
  const saved = isSaved(post.id);

  async function handleShare() {
    const url = window.location.href;
    const shareData: ShareData = {
      title: `${post.author.name} on Festari Estates`,
      text: post.body[0] ?? `A post from ${post.author.name} on Festari Estates`,
      url,
    };

    if (navigator.share && (navigator.canShare?.(shareData) ?? true)) {
      try {
        await navigator.share(shareData);
        onShare?.();
      } catch (err) {
        // AbortError just means the user dismissed the native share sheet —
        // not a failure worth surfacing.
        if ((err as Error)?.name !== "AbortError") {
          toast.error("Couldn't share this post.");
        }
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard.");
      onShare?.();
    } catch {
      toast.error("Couldn't copy the link.");
    }
  }

  function handleSave() {
    const wasSaved = saved;
    toggleSave(post);
    toast.success(wasSaved ? "Removed from saved." : "Saved. Find it under Saved in the sidebar.");
  }

  return (
    <div className="flex w-full items-center justify-between border-t border-border-subtle pt-[17px]">
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
        onClick={onToggleComments}
        aria-expanded={commentsOpen}
        className={cn(
          "flex items-center gap-2 text-base font-medium",
          commentsOpen ? "text-brand-navy" : "text-muted hover:text-ink",
        )}
      >
        <DynamicIcon name="MessageCircle" className="size-5" />
        Comment
      </button>
      <button
        onClick={handleShare}
        className="flex items-center gap-2 text-base font-medium text-muted hover:text-ink"
      >
        <DynamicIcon name="Share2" className="size-5" />
        Share
      </button>
      <button
        onClick={handleSave}
        className={cn(
          "flex items-center gap-2 text-base font-medium",
          saved ? "text-brand-navy" : "text-muted hover:text-ink",
        )}
      >
        <DynamicIcon name="Bookmark" className="size-5" fill={saved ? "currentColor" : "none"} />
        Save
      </button>
    </div>
  );
}
