import { PropertyPostCard } from "@/components/home/PropertyPostCard";
import { ServicePostCard } from "@/components/home/ServicePostCard";
import type { FeedPost } from "@/types/home";

/** Picks the right card renderer for a feed item's kind. */
export function FeedPostCard({ post }: { post: FeedPost }) {
  switch (post.kind) {
    case "property":
      return <PropertyPostCard post={post} />;
    case "service":
      return <ServicePostCard post={post} />;
  }
}
