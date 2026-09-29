import Link from "next/link";
import { PostCard } from "@/components/shared/PostCard";
import { ProjectUpdateCard } from "@/components/shared/ProjectUpdateCard";
import { FEED_POSTS, HOME_FEED_PREVIEW_IDS } from "@/lib/dummy-posts";

/** "/home" dashboard's condensed look at the full "/feed" stream — same post
 * data, just the two most relevant picks rather than the whole feed. */
export function FeedPreviewSection() {
  const previewPosts = FEED_POSTS.filter((post) => (HOME_FEED_PREVIEW_IDS as readonly string[]).includes(post.id));

  return (
    <section className="flex w-full flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-[15px] font-bold text-night-900">From your Feed</h2>
        <Link href="/feed" className="text-[12.5px] font-medium text-brand-600">
          Open Feed
        </Link>
      </div>

      <div className="flex w-full flex-col gap-[15px]">
        {previewPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
        <ProjectUpdateCard />
      </div>
    </section>
  );
}
