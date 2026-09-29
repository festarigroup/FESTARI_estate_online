"use client";

import Link from "next/link";
import { NavIcon } from "@/components/shared/NavIcon";
import { PostCard } from "@/components/shared/PostCard";
import { usePostsFeed } from "@/context/PostsContext";
import { FEED_POSTS } from "@/lib/dummy-posts";

const PREVIEW_COUNT = 2;

/** "/home" dashboard's condensed look at the full "/feed" stream — the same
 * top-of-feed posts a viewer would see first on "/feed" (their own posts,
 * newest first, then the dummy stream), just capped to the top two. */
export function FeedPreviewSection() {
  const { posts: userPosts } = usePostsFeed();
  const previewPosts = [...userPosts, ...FEED_POSTS].slice(0, PREVIEW_COUNT);

  return (
    <section className="flex w-full flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-[15px] font-bold text-night-900">From your Feed</h2>
        <Link href="/feed" className="flex items-center gap-1 text-[12.5px] font-medium text-brand-600">
          Open Feed
          <NavIcon icon="/icons/chevron-right.svg" color="brand" size={10} />
        </Link>
      </div>

      <div className="flex w-full flex-col gap-[15px]">
        {previewPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
