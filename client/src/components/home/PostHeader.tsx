import { Avatar } from "@/components/ui/Avatar";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { PostOptionsMenu } from "@/components/home/PostOptionsMenu";
import type { ContentPost } from "@/types/home";

/** Shared post byline: avatar, name + verified badge, subtitle, and overflow menu. */
export function PostHeader({ post }: { post: ContentPost }) {
  const { author } = post;

  return (
    <div className="flex w-full items-start justify-between">
      <div className="flex items-center gap-3">
        <Avatar src={author.avatar} icon={author.avatarIcon} alt={author.name} size={48} />
        <div>
          <div className="flex items-center gap-1">
            <h3 className="font-heading text-sm text-ink">{author.name}</h3>
            {author.verified && (
              <DynamicIcon name="BadgeCheck" className="size-3 text-brand-blue" />
            )}
          </div>
          <p className="text-xs text-muted">{author.subtitle}</p>
        </div>
      </div>
      <PostOptionsMenu post={post} />
    </div>
  );
}
