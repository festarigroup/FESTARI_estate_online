import { StoryBar } from "@/components/home/StoryBar";
import { PostComposer } from "@/components/home/PostComposer";
import { FeedPostCard } from "@/components/home/FeedPostCard";
import { ConciergeCard } from "@/components/home/ConciergeCard";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { WhoToFollow } from "@/components/home/WhoToFollow";
import { TrendingProperties } from "@/components/home/TrendingProperties";
import { TopServiceProviders } from "@/components/home/TopServiceProviders";
import { FEED_POSTS } from "@/lib/mock-data";

export default function HomePage() {
  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-6 px-4 py-6 sm:px-6 lg:flex-row lg:items-start lg:gap-6 lg:px-10">
      <section className="flex w-full flex-col gap-6 lg:w-2/3">
        <StoryBar />
        <PostComposer />
        <div className="flex w-full flex-col gap-6">
          {FEED_POSTS.map((post) => (
            <FeedPostCard key={post.id} post={post} />
          ))}
        </div>
      </section>

      <aside className="flex w-full flex-col gap-6 pb-12 lg:w-1/3">
        <ConciergeCard />
        <CategoryGrid />
        <WhoToFollow />
        <TrendingProperties />
        <TopServiceProviders />
      </aside>
    </div>
  );
}
