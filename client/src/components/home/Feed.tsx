"use client";

import { useEffect, useState } from "react";
import { PostComposer } from "@/components/home/PostComposer";
import { FeedPostCard } from "@/components/home/FeedPostCard";
import { useReposts } from "@/hooks/useReposts";
import { useHiddenPosts } from "@/hooks/useHiddenPosts";
import { useAuth } from "@/context/AuthContext";
import * as feedApi from "@/lib/api/feed";
import { mapPost } from "@/lib/adapters";
import type { ContentPost, FeedPost, RepostedPost } from "@/types/home";

/** Owns the feed's post list so the composer can prepend a new post to it —
 * everything above (StoryBar) and beside (the sidebar widgets) stays server-
 * rendered; only this slice needs the client-side state. */
export function Feed() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<ContentPost[]>([]);
  const [loading, setLoading] = useState(true);
  const { reposts } = useReposts();
  const { isHidden } = useHiddenPosts();

  useEffect(() => {
    feedApi
      .listPosts({ limit: 20 })
      .then(({ items }) => setPosts(items.map(mapPost)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function addPost(post: ContentPost) {
    setPosts((prev) => [post, ...prev]);
  }

  const CURRENT_USER = {
    name: [user?.firstname, user?.lastname].filter(Boolean).join(" ") || "You",
    avatar: user?.profile_picture ?? "/images/avatar-kwame-composer.png",
    subtitle: "Just now",
  };

  // "Not interested" / "Report post" filter a post out of view entirely —
  // including its repost wrapper, if it has one, since a lookup against
  // this filtered list is what repostCards builds from below.
  const visiblePosts = posts.filter((p) => !isHidden(p.id));

  // Each active repost renders as its own wrapper card at the very top of
  // the feed, most-recently-reposted first — the original post stays right
  // where it already was further down, same as the platforms this is
  // modeled on. Looked up from `visiblePosts` since a repost always targets
  // something already in the feed. `thoughts` carries through from a
  // "Repost with thoughts" — absent for a plain repost.
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
        {loading && <p className="py-8 text-center text-sm text-muted">Loading feed...</p>}
        {!loading && feed.length === 0 && (
          <p className="py-8 text-center text-sm text-muted">
            No posts yet — be the first to share something.
          </p>
        )}
        {feed.map((post) => (
          <FeedPostCard key={post.id} post={post} />
        ))}
      </div>
    </>
  );
}
