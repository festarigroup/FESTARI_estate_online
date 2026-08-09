"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import * as feedApi from "@/lib/api/feed";
import { mapComment } from "@/lib/adapters";
import { ApiError } from "@/lib/api/client";
import type { Comment } from "@/types/home";

/** Shared comment-thread state for a single post: open/closed panel, the
 * comment list, and adding a new one. Real comments (and the running total
 * shown before the panel is even opened) are lazily fetched from the API
 * the first time the panel opens, seeded with `initialComments` until then. */
export function usePostComments(postId: string, initialComments: Comment[]) {
  const [comments, setComments] = useState(initialComments);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  async function toggleComments() {
    const opening = !commentsOpen;
    setCommentsOpen(opening);

    if (opening && !loaded) {
      setLoaded(true);
      try {
        const { items } = await feedApi.listComments(postId);
        setComments(items.map(mapComment).reverse());
      } catch {
        // Keep whatever seed comments were passed in — the panel still works,
        // it just won't reflect the latest from the server this time.
      }
    }
  }

  async function addComment(body: string) {
    const previous = comments;
    const optimistic: Comment = {
      id: `pending-${Date.now()}`,
      author: { name: "You" },
      body,
      createdAt: "Just now",
    };
    setComments((prev) => [...prev, optimistic]);

    try {
      await feedApi.addComment(postId, body);
    } catch (err) {
      setComments(previous);
      toast.error(err instanceof ApiError ? err.message : "Couldn't post your comment.");
    }
  }

  return { comments, commentsOpen, toggleComments, addComment };
}
