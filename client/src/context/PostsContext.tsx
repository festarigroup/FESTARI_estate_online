"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import type { PostCardData } from "@/components/shared/PostCard";

export type NewPostInput =
  | { kind: "media"; text: string; files: File[] }
  | { kind: "poll"; question: string; options: string[] }
  | { kind: "article"; headline: string; body: string };

const CURRENT_USER = {
  authorName: "Madeline Price",
  roleLine: "Researcher |",
  avatar: "/icons/avatar-sample.jpg",
} as const;

const TODAY = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

function buildPost(input: NewPostInput): PostCardData {
  const base = {
    id: `local-${Date.now()}`,
    authorName: CURRENT_USER.authorName,
    roleLine: CURRENT_USER.roleLine,
    postedAt: "Just now",
    avatar: CURRENT_USER.avatar,
    verified: "individual" as const,
    likes: 0,
    comments: 0,
    showComposer: true,
  };

  if (input.kind === "poll") {
    return {
      ...base,
      variant: "poll",
      question: input.question.trim(),
      pollOptions: input.options
        .map((option) => option.trim())
        .filter(Boolean)
        .map((label) => ({ label, percent: 0, votes: "0" })),
      pollFooter: `${TODAY} — 0 votes total`,
    };
  }

  if (input.kind === "article") {
    return {
      ...base,
      variant: "text",
      text: [input.headline.trim(), input.body.trim()].filter(Boolean).join("\n\n"),
      truncated: true,
    };
  }

  const isVideo = input.files.some((file) => file.type.startsWith("video/"));
  const urls = input.files.map((file) => URL.createObjectURL(file));

  return {
    ...base,
    variant: "text",
    text: input.text.trim() || undefined,
    truncated: false,
    video: isVideo ? urls[0] : undefined,
    image: !isVideo && urls.length === 1 ? urls[0] : undefined,
    images: !isVideo && urls.length > 1 ? urls : undefined,
  };
}

interface PostsContextValue {
  posts: PostCardData[];
  addPost: (input: NewPostInput) => void;
}

const PostsContext = createContext<PostsContextValue | null>(null);

export function PostsProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<PostCardData[]>([]);

  const addPost = useCallback((input: NewPostInput) => {
    setPosts((current) => [buildPost(input), ...current]);
  }, []);

  return <PostsContext.Provider value={{ posts, addPost }}>{children}</PostsContext.Provider>;
}

export function usePostsFeed() {
  const context = useContext(PostsContext);
  if (!context) throw new Error("usePostsFeed must be used within a PostsProvider");
  return context;
}
