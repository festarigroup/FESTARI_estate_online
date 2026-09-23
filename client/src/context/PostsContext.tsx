"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import type { PostCardData } from "@/components/shared/PostCard";

export interface NewPostInput {
  text: string;
  files: File[];
}

const CURRENT_USER = {
  authorName: "Madeline Price",
  roleLine: "Researcher |",
  avatar: "/icons/avatar-sample.jpg",
} as const;

function buildPostFromComposer({ text, files }: NewPostInput): PostCardData {
  const isVideo = files.some((file) => file.type.startsWith("video/"));
  const urls = files.map((file) => URL.createObjectURL(file));

  return {
    id: `local-${Date.now()}`,
    variant: "text",
    authorName: CURRENT_USER.authorName,
    roleLine: CURRENT_USER.roleLine,
    postedAt: "Just now",
    avatar: CURRENT_USER.avatar,
    verified: "individual",
    text: text.trim() || undefined,
    truncated: false,
    video: isVideo ? urls[0] : undefined,
    image: !isVideo && urls.length === 1 ? urls[0] : undefined,
    images: !isVideo && urls.length > 1 ? urls : undefined,
    likes: 0,
    comments: 0,
    showComposer: true,
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
    setPosts((current) => [buildPostFromComposer(input), ...current]);
  }, []);

  return <PostsContext.Provider value={{ posts, addPost }}>{children}</PostsContext.Provider>;
}

export function usePostsFeed() {
  const context = useContext(PostsContext);
  if (!context) throw new Error("usePostsFeed must be used within a PostsProvider");
  return context;
}
