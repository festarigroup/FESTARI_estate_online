"use client";

import { useState } from "react";
import { PostComposer } from "@/components/home/PostComposer";
import { FeedPostCard } from "@/components/home/FeedPostCard";
import { FEED_POSTS } from "@/lib/mock-data";
import type { FeedPost } from "@/types/home";

/** Owns the feed's post list so the composer can prepend a new post to it —
 * everything above (StoryBar) and beside (the sidebar widgets) stays server-
 * rendered; only this slice needs the client-side state. */
export function Feed() {
  const [posts, setPosts] = useState<FeedPost[]>(FEED_POSTS);

  function addPost(post: FeedPost) {
    setPosts((prev) => [post, ...prev]);
  }

  return (
    <>
      <PostComposer onCreatePost={addPost} />
      <div className="flex w-full flex-col gap-6">
        {posts.map((post) => (
          <FeedPostCard key={post.id} post={post} />
        ))}
      </div>
    </>
  );
}
