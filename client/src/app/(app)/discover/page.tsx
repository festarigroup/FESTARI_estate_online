"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AppShell } from "@/components/shared/AppShell";
import { DiscoverCommentPanel } from "@/components/shared/DiscoverCommentPanel";
import { DiscoverCommentSheet } from "@/components/shared/DiscoverCommentSheet";
import { DiscoverReelCard } from "@/components/shared/DiscoverReelCard";
import { DiscoverReelCardSkeleton } from "@/components/shared/DiscoverReelCardSkeleton";
import { DiscoverStoryRail } from "@/components/shared/DiscoverStoryRail";
import { DISCOVER_TABS, DiscoverTopBar, type DiscoverTab } from "@/components/shared/DiscoverTopBar";
import { FadeIn } from "@/components/motion/FadeIn";
import { PostStoryModal, VIDEO_ONLY_ACCEPT, type PostedStory } from "@/components/shared/PostStoryModal";
import { MyStoryViewer } from "@/components/shared/StoriesRow";
import { Tooltip } from "@/components/shared/Tooltip";
import { useDiscoverStories } from "@/hooks/useDiscoverStories";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { DISCOVER_REELS, type DiscoverReel } from "@/lib/dummy-reels";

function makeReelId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `reel-${Date.now()}`;
}

export default function DiscoverPage() {
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<DiscoverTab>(DISCOVER_TABS[0]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [commentsReelId, setCommentsReelId] = useState<string | null>(null);
  const [myReels, setMyReels] = useState<DiscoverReel[]>([]);
  const [composerOpen, setComposerOpen] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const stories = useDiscoverStories();

  // Simulates the brief fetch a real reels feed would need, so the stack's
  // skeleton state is actually reachable instead of being dead code.
  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 500);
    return () => window.clearTimeout(timer);
  }, []);

  function postReel({ url, caption }: PostedStory) {
    setMyReels((current) => [
      {
        id: makeReelId(),
        authorName: "Andy Ansong",
        authorAvatar: "/images/avatar-kasapa.png",
        verified: true,
        following: true,
        caption: caption ? `${caption} (More)` : "New reel",
        video: url,
        poster: "/images/avatar-kasapa.png",
        likes: 0,
        comments: 0,
        shares: 0,
        reposts: 0,
        saves: 0,
      },
      ...current,
    ]);
  }

  const reels = useMemo(() => {
    const allReels = [...myReels, ...DISCOVER_REELS];
    const byTab = activeTab === "Following" ? allReels.filter((reel) => reel.following) : allReels;
    const q = query.trim().toLowerCase();
    if (!q) return byTab;
    return byTab.filter(
      (reel) => reel.authorName.toLowerCase().includes(q) || reel.caption.toLowerCase().includes(q),
    );
  }, [activeTab, query, myReels]);

  function scrollToIndex(index: number) {
    const clamped = Math.max(0, Math.min(index, reels.length - 1));
    setActiveIndex(clamped);
    cardRefs.current[clamped]?.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "center",
    });
  }

  return (
    <AppShell
      activeKey="feed"
      activeChildKey="discover"
      rightRail={<DiscoverStoryRail activeStories={stories.activeStories} onYourStoryClick={stories.openYourStory} />}
      rightRailBare
      contentFullWidth
      contentPadding="px-0 pb-0"
      railAccessory={
        !loading && reels.length > 1 ? (
          // Fixed-footprint box — always exactly the nav buttons' size, so
          // opening the comment panel below never changes how much space
          // this slot claims in the layout, and `main`/the reel never
          // reflow. The panel is `absolute`, floating out over the content
          // to the left, not a layout participant.
          <div className="relative flex flex-col gap-[16px] px-[8px]">
            <ReelNavButton
              direction="prev"
              label="Previous reel"
              disabled={activeIndex === 0}
              onClick={() => scrollToIndex(activeIndex - 1)}
            />
            <ReelNavButton
              direction="next"
              label="Next reel"
              disabled={activeIndex === reels.length - 1}
              onClick={() => scrollToIndex(activeIndex + 1)}
            />
            {commentsReelId && (
              <div className="absolute right-full top-1/2 z-20 mr-[16px] -translate-y-1/2">
                <DiscoverCommentPanel reelId={commentsReelId} onClose={() => setCommentsReelId(null)} />
              </div>
            )}
          </div>
        ) : undefined
      }
      topNav={
        // DiscoverTopBar hides itself entirely below `xl:` — mobile has no
        // navbar/story-rail chrome at all, so there's nothing to pass as
        // `below` here any more (see DiscoverReelCard's mobile overlay for
        // the equivalent back/filter/more controls).
        <DiscoverTopBar query={query} onQueryChange={setQuery} activeTab={activeTab} onTabChange={setActiveTab} />
      }
    >
      {/* No gap, no extra padding — each reel's own wrapper below claims
          exactly one viewport's worth of height (`calc(100vh-67px)`, the
          Discover topbar's fixed height), so the scroll-snap stack moves
          one full reel per swipe/scroll on every breakpoint instead of
          leaving the next reel's edge visible. */}
      <div className="flex w-full flex-col gap-0">
        {loading ? (
          <DiscoverReelCardSkeleton />
        ) : reels.length > 0 ? (
          reels.map((reel, index) => (
            <FadeIn
              key={reel.id}
              delay={prefersReducedMotion ? 0 : index * 0.05}
              className="snap-start [scroll-snap-stop:always]"
            >
              <div
                ref={(el) => void (cardRefs.current[index] = el)}
                className="xl:flex xl:min-h-[calc(100vh-67px)] xl:items-center xl:justify-center xl:px-[16px] xl:py-[12px]"
              >
                <DiscoverReelCard
                  reel={reel}
                  onOpenComments={() => setCommentsReelId(reel.id)}
                  onOpenPostComposer={() => setComposerOpen(true)}
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                />
              </div>
            </FadeIn>
          ))
        ) : (
          <div className="flex w-full flex-col items-center gap-[15px] rounded-[15px] border border-gray-200 bg-white p-[15px] py-9 text-center">
            <p className="text-[13px] text-gray-500">No reels match that search yet.</p>
          </div>
        )}
      </div>

      <PostStoryModal
        open={composerOpen}
        onClose={() => setComposerOpen(false)}
        onPost={postReel}
        title="Post a Reel"
        ctaLabel="Post Reel"
        accept={VIDEO_ONLY_ACCEPT}
        dropHint="MP4, MKV, AVI, MOV, WEBM"
        missingMediaError="Add a video for your reel"
        postedMessage="Your reel has been posted"
      />

      {/* Mobile counterpart to the desktop `DiscoverCommentPanel` above —
          see DiscoverCommentSheet's own header comment for why they're
          separate components instead of one shared across breakpoints. */}
      <DiscoverCommentSheet
        open={commentsReelId !== null}
        reelId={commentsReelId ?? ""}
        onClose={() => setCommentsReelId(null)}
      />

      <PostStoryModal open={stories.composerOpen} onClose={() => stories.setComposerOpen(false)} onPost={stories.addStory} />

      {stories.viewerIndex !== null && stories.activeStories.length > 0 && (
        <MyStoryViewer
          stories={stories.activeStories}
          initialIndex={stories.viewerIndex}
          onClose={() => stories.setViewerIndex(null)}
          onDelete={stories.deleteStory}
          onAddAnother={() => {
            stories.setViewerIndex(null);
            stories.setComposerOpen(true);
          }}
        />
      )}
    </AppShell>
  );
}

/** The circular prev/next reel control (Figma node 790:37774) — one
 * "arrow-left" glyph rotated ±90° rather than two separate icons, matching
 * how Figma itself reuses the same `play-circle` component for both. */
function ReelNavButton({
  direction,
  label,
  disabled,
  onClick,
}: {
  direction: "prev" | "next";
  label: string;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <Tooltip label={label} side={direction === "prev" ? "top" : "bottom"} align="end">
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        aria-label={label}
        className="flex size-[54px] items-center justify-center rounded-full border border-gray-200 bg-white shadow-lg transition-opacity hover:bg-gray-50 disabled:opacity-30"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
          className={direction === "prev" ? "rotate-90" : "-rotate-90"}
        >
          <path d="M15 6l-6 6 6 6" stroke="#334154" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </Tooltip>
  );
}
