"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { cn } from "@/lib/cn";

interface PostEngagementBarProps {
  postAuthor: string;
}

/** Like / Comment / Share / Save action row, shared by every feed post variant. */
export function PostEngagementBar({ postAuthor }: PostEngagementBarProps) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

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
        onClick={() => toast(`Opening comments on ${postAuthor}'s post…`)}
        className="flex items-center gap-2 text-base font-medium text-muted hover:text-ink"
      >
        <DynamicIcon name="MessageCircle" className="size-5" />
        Comment
      </button>
      <button
        onClick={() => toast.success("Link copied to clipboard.")}
        className="flex items-center gap-2 text-base font-medium text-muted hover:text-ink"
      >
        <DynamicIcon name="Share2" className="size-5" />
        Share
      </button>
      <button
        onClick={() => {
          setSaved((v) => !v);
          toast.success(saved ? "Removed from saved." : "Saved.");
        }}
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
