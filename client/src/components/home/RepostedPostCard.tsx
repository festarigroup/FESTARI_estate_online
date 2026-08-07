import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { Avatar } from "@/components/ui/Avatar";
import { FeedPostCard } from "@/components/home/FeedPostCard";
import type { RepostedPost } from "@/types/home";

/** Wraps an existing feed post with a slim "X reposted this" attribution
 * line and renders the original post's own card, untouched, right beneath
 * it — not a Figma frame (no repost frame was provided); modeled on the
 * Facebook/LinkedIn convention where the repost note carries no engagement
 * row of its own. Reposting from inside that nested card re-targets
 * `original`, so a repost of a repost can't nest — see types/home.ts. */
export function RepostedPostCard({ post }: { post: RepostedPost }) {
  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex items-center gap-2 px-2 text-sm text-muted">
        <DynamicIcon name="Repeat2" className="size-4" />
        <Avatar
          src={post.repostedBy.avatar}
          alt={post.repostedBy.name}
          icon={post.repostedBy.avatarIcon}
          size={20}
        />
        <span>
          <span className="font-medium text-ink">{post.repostedBy.name}</span> reposted this · {post.repostedAt}
        </span>
      </div>
      <FeedPostCard post={post.original} />
    </div>
  );
}
