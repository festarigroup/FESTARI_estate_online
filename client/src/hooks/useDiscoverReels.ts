"use client";

import { useEffect, useMemo, useState } from "react";
import { DISCOVER_TABS, type DiscoverTab } from "@/lib/discover-tabs";
import { DISCOVER_REELS } from "@/lib/dummy-reels";
import type { DiscoverReel } from "@/types/reel";
import type { PostedStory } from "@/types/story";

const FAKE_FETCH_MS = 500;

const CURRENT_USER = {
  authorName: "Andy Ansong",
  authorAvatar: "/images/avatar-kasapa.png",
} as const;

function makeReelId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `reel-${Date.now()}`;
}

/** Data layer for the Discover screen: loading state, the reels you've posted,
 * and tab + search filtering. Backed by dummy data for now — when the feed API
 * lands, only this hook changes; the page and cards don't. */
export function useDiscoverReels() {
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<DiscoverTab>(DISCOVER_TABS[0]);
  const [myReels, setMyReels] = useState<DiscoverReel[]>([]);

  // Simulates the brief fetch a real reels feed would need, so the skeleton
  // state is actually reachable instead of being dead code.
  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), FAKE_FETCH_MS);
    return () => window.clearTimeout(timer);
  }, []);

  function addReel({ url, caption }: PostedStory) {
    setMyReels((current) => [
      {
        id: makeReelId(),
        ...CURRENT_USER,
        verified: true,
        following: true,
        caption: caption ? `${caption} (More)` : "New reel",
        video: url,
        poster: CURRENT_USER.authorAvatar,
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
    return byTab.filter((reel) => reel.authorName.toLowerCase().includes(q) || reel.caption.toLowerCase().includes(q));
  }, [activeTab, query, myReels]);

  return { reels, loading, query, setQuery, activeTab, setActiveTab, addReel };
}
