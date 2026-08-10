"use client";

import toast from "react-hot-toast";
import { sharePost } from "@/lib/api/feed";
import type { ContentPost } from "@/types/home";

/**
 * Native share sheet with a copy-to-clipboard fallback — shared by
 * PostEngagementBar and every card that renders it. Also records the share
 * against the post on the backend, best-effort — a failed record shouldn't
 * block the share the user just completed.
 */
export function usePostShare(post: ContentPost, onShare?: () => void) {
  function recordShare() {
    sharePost(post.id).catch(() => {});
    onShare?.();
  }

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
        recordShare();
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
      recordShare();
    } catch {
      toast.error("Couldn't copy the link.");
    }
  }

  return { handleShare };
}
