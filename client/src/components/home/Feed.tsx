"use client";

import { useState } from "react";
import { PostComposer } from "@/components/home/PostComposer";
import { FeedPostCard } from "@/components/home/FeedPostCard";
import { useReposts } from "@/hooks/useReposts";
import { useHiddenPosts } from "@/hooks/useHiddenPosts";
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
  const { reposts } = useReposts();
  const { isHidden } = useHiddenPosts();

  function addPost(post: ContentPost) {
    setPosts((prev) => [post, ...prev]);
  }

  // "Not interested" / "Report post" filter a post out of view entirely —
  // including its repost wrapper, if it has one, since a lookup against
  // this filtered list is what repostCards builds from below.
  const visiblePosts = posts.filter((p) => !isHidden(p.id));

  // Each active repost renders as its own wrapper card at the very top of
  // the feed, most-recently-reposted first — the original post stays right
  // where it already was further down, same as the platforms this is
  // modeled on. Looked up from `visiblePosts` since a repost always targets
  // something already in the feed (seed content or composer-created).
  // `thoughts` carries through from a "Repost with thoughts" — absent for
  // a plain repost.
  const repostCards: RepostedPost[] = reposts.flatMap(({ postId, thoughts }) => {
    const original = visiblePosts.find((p) => p.id === postId);
    if (!original) return [];
    return [
      { id: `repost-${postId}`, kind: "repost", repostedBy: CURRENT_USER, repostedAt: "Just now", thoughts, original },
    ];
  });

  const feed: FeedPost[] = [...repostCards, ...visiblePosts];

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
