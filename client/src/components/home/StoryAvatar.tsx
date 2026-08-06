import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import type { Story } from "@/types/home";

/** One story bubble: ringed avatar, name, and an optional LIVE badge. */
export function StoryAvatar({ story, onClick }: { story: Story; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex shrink-0 flex-col items-center gap-2">
      <div className="relative">
        <Avatar
          src={story.avatar}
          alt={story.name}
          size={56}
          ring={story.ringColor === "live" ? "live" : "gold"}
        />
        {story.isLive && (
          <Badge
            variant="listing-rent"
            className="absolute top-[calc(100%-16px)] right-0 px-1"
          >
            Live
          </Badge>
        )}
      </div>
      <span className="text-[11px] font-medium whitespace-nowrap text-ink">{story.name}</span>
    </button>
  );
}
