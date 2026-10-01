"use client";

import Image from "next/image";
import Link from "next/link";
import { RING_GRADIENT } from "@/components/shared/StoriesRow";
import { Tooltip } from "@/components/shared/Tooltip";
import type { MyStory } from "@/hooks/useDiscoverStories";
import { comingSoonHref } from "@/lib/coming-soon";
import { STORIES } from "@/lib/dummy-stories";

interface DiscoverStoryRailProps {
  activeStories: MyStory[];
  onYourStoryClick: () => void;
  /** `vertical` is the desktop aside (Figma node 789:36669); `horizontal` is
   * the mobile bar that sits beneath the top nav instead. Both are driven by
   * the same lifted story state (see `useDiscoverStories`/discover/page.tsx)
   * so posting a story stays in sync regardless of which layout is visible
   * at the current viewport. */
  layout?: "vertical" | "horizontal";
}

/** Discover's "channel stories" rail — the same posting/viewing mechanics as
 * the home dashboard's `StoriesRow` (`PostStoryModal` to post,
 * `MyStoryViewer` to view/delete your own, a 24h lifetime), just laid out
 * either as a narrow full-height aside or a horizontal bar. */
export function DiscoverStoryRail({ activeStories, onYourStoryClick, layout = "vertical" }: DiscoverStoryRailProps) {
  const latestStory = activeStories[activeStories.length - 1];
  const yourStoryLabel = activeStories.length > 0 ? "View your story" : "Add to your story";

  const yourStoryButton = (
    <Tooltip label={yourStoryLabel} side="bottom" align="end">
      <button
        type="button"
        onClick={onYourStoryClick}
        aria-label={yourStoryLabel}
        className="relative flex size-[48px] shrink-0 items-center justify-center"
      >
        <span
          className="flex size-[48px] items-center justify-center rounded-full p-0.5"
          style={activeStories.length > 0 ? { backgroundImage: RING_GRADIENT } : { backgroundColor: "#e2e8f0" }}
        >
          <span className="relative block size-[42px] overflow-hidden rounded-full">
            <Image src={latestStory?.url ?? "/images/stories/your-story.jpg"} alt="" fill sizes="42px" className="object-cover" />
          </span>
        </span>
        <span className="absolute bottom-[-2px] right-0 flex size-5 items-center justify-center rounded-full border-2 border-white bg-brand-900 text-[11px] font-bold leading-none text-white">
          +
        </span>
      </button>
    </Tooltip>
  );

  const channelAvatars = (sizeClass: string) =>
    STORIES.slice(0, 5).map((story) => (
      <Tooltip key={story.id} label={story.name} side="bottom" align="end">
        <Link
          href={comingSoonHref(`${story.name}'s Story`)}
          aria-label={`${story.name}'s story`}
          className={`${sizeClass} shrink-0 rounded-full p-0.5`}
          style={{ backgroundImage: RING_GRADIENT }}
        >
          <span className="relative block size-full overflow-hidden rounded-full border-2 border-white">
            <Image src={story.avatar} alt="" fill sizes="32px" className="object-cover" />
          </span>
        </Link>
      </Tooltip>
    ));

  if (layout === "horizontal") {
    return (
      <div className="no-scrollbar flex w-full items-center gap-[16px] overflow-x-auto border-b border-gray-200 bg-white px-[15px] py-[12px]">
        {yourStoryButton}
        {channelAvatars("size-[48px]")}
      </div>
    );
  }

  return (
    <div className="flex h-full w-[59px] shrink-0 flex-col items-center justify-between border-l border-gray-200 bg-white py-[24px]">
      <div className="flex flex-col items-center gap-[16px]">
        {channelAvatars("size-[32px]")}
        {yourStoryButton}
      </div>
    </div>
  );
}
