import { PropertyPostCard } from "@/components/home/PropertyPostCard";
import { ServicePostCard } from "@/components/home/ServicePostCard";
import { GeneralPostCard } from "@/components/home/GeneralPostCard";
import { RepostedPostCard } from "@/components/home/RepostedPostCard";
import type { FeedPost } from "@/types/home";

/** Picks the right card renderer for a feed item's kind. */
export function FeedPostCard({ post }: { post: FeedPost }) {
  switch (post.kind) {
    case "property":
      return <PropertyPostCard post={post} />;
    case "service":
      return <ServicePostCard post={post} />;
    case "general":
      return <GeneralPostCard post={post} />;
    case "repost":
      return <RepostedPostCard post={post} />;
  }
}
