"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import type { PostCardData } from "@/components/shared/PostCard";
import type { PropertyListing } from "@/lib/dummy-listings";

export type NewPostInput =
  | { kind: "media"; text: string; files: File[] }
  | { kind: "poll"; question: string; options: string[] }
  | { kind: "article"; headline: string; body: string; files?: File[] }
  | { kind: "property"; note: string; listing: PropertyListing };

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

  if (input.kind === "property") {
    const { listing } = input;
    return {
      ...base,
      variant: "property",
      text: input.note.trim() || undefined,
      images: listing.images,
      priceLine: listing.priceLine,
      priceSuffix: listing.priceSuffix,
      subLine: listing.subLine,
      beds: listing.beds,
      baths: listing.baths,
      actions: [
        { label: "Request viewing", variant: "primary" },
        { label: "View Property", variant: "outline" },
      ],
      messageHostLabel: "Message Host",
    };
  }

  if (input.kind === "article") {
    const articleFiles = input.files ?? [];
    return {
      ...base,
      variant: "text",
      text: [input.headline.trim(), input.body.trim()].filter(Boolean).join("\n\n"),
      truncated: true,
      media: buildMedia(articleFiles),
    };
  }

  return {
    ...base,
    variant: "text",
    text: input.text.trim() || undefined,
    media: buildMedia(input.files),
  };
}

function buildMedia(files: File[]) {
  if (files.length === 0) return undefined;
  return files.map((file) => ({
    url: URL.createObjectURL(file),
    isVideo: file.type.startsWith("video/"),
  }));
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
