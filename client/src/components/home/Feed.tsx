"use client";

import { useMemo, useState } from "react";
import { PostComposer } from "@/components/home/PostComposer";
import { FeedPostCard } from "@/components/home/FeedPostCard";
import { useReposts } from "@/hooks/useReposts";
import { FEED_POSTS } from "@/lib/mock-data";
import type { ContentPost, FeedPost, RepostedPost } from "@/types/home";

/** Same "Kwame" identity used everywhere else a composer-side action needs
 * an author (PostComposer, CreateStoryModal, CreatePostModal). */
const CURRENT_USER = { name: "Kwame", avatar: "/images/avatar-kwame-composer.png", subtitle: "Just now" };

/** Owns the feed's post list so the composer can prepend a new post to it —
 * everything above (StoryBar) and beside (the sidebar widgets) stays server-
 * rendered; only this slice needs the client-side state. */
export function Feed() {
  const [posts, setPosts] = useState<ContentPost[]>(FEED_POSTS);
  const { repostedIds } = useReposts();

  function addPost(post: ContentPost) {
    setPosts((prev) => [post, ...prev]);
  }

  // Each active repost renders as its own wrapper card at the very top of
  // the feed, most-recently-reposted first — the original post stays right
  // where it already was further down, same as the platforms this is
  // modeled on. Looked up from `posts` since a repost always targets
  // something already in the feed (seed content or composer-created).
  const repostCards = useMemo<RepostedPost[]>(
    () =>
      repostedIds.flatMap((id) => {
        const original = posts.find((p) => p.id === id);
        if (!original) return [];
        return [{ id: `repost-${id}`, kind: "repost", repostedBy: CURRENT_USER, repostedAt: "Just now", original }];
      }),
    [repostedIds, posts],
  );

  const feed: FeedPost[] = [...repostCards, ...posts];

  return (
    <>
      <PostComposer onCreatePost={addPost} />
      <div className="flex w-full flex-col gap-6">
        {feed.map((post) => (
          <FeedPostCard key={post.id} post={post} />
        ))}
      </div>
    </>
  );
}
