"use client";

import toast from "react-hot-toast";
import type { ContentPost } from "@/types/home";

/**
 * Native share sheet with a copy-to-clipboard fallback — pulled out once
 * PostEngagementBar and ServiceActionsBar both needed the identical
 * behavior (ServiceActionsBar didn't have a Share action at all until
 * venue posts needed the same "Social Interactions & Actions" bar Figma's
 * Service/Promotion post uses, which does have one).
 */
export function usePostShare(post: ContentPost, onShare?: () => void) {
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

  return { handleShare };
}
