"use client";

import { useState } from "react";
import type { Comment } from "@/types/home";

const CURRENT_USER = {
  name: "Kwame",
  avatar: "/images/avatar-kwame-composer.png",
};

/** Shared comment-thread state for a single post: open/closed panel, the
 * comment list (seeded from mock/API data), and adding a new one locally. */
export function usePostComments(initialComments: Comment[]) {
  const [comments, setComments] = useState(initialComments);
  const [commentsOpen, setCommentsOpen] = useState(false);

  function addComment(body: string) {
    setComments((prev) => [
      ...prev,
      {
        id: `comment-${Date.now()}`,
        author: CURRENT_USER,
        body,
        createdAt: "Just now",
      },
    ]);
  }

  return {
    comments,
    commentsOpen,
    toggleComments: () => setCommentsOpen((v) => !v),
    addComment,
  };
}
