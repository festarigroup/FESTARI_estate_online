"use client";

import { useEffect, useState } from "react";
import { isStoryActive, makeStoryId } from "@/lib/stories";
import type { MyStory, PostedStory } from "@/types/story";

/** The signed-in user's own stories — posting, viewing, deleting, and the
 * 24h expiry — shared by every "your story" surface (the home dashboard's
 * `StoriesRow` and Discover's `DiscoverStoryRail`) so the mechanics are
 * defined exactly once. */
export function useMyStories() {
  const [myStories, setMyStories] = useState<MyStory[]>([]);
  const [composerOpen, setComposerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);

  // Prune on an interval, not just on the next unrelated render, so a story
  // left open in a tab past 24h still disappears.
  useEffect(() => {
    const prune = () => {
      setMyStories((current) => {
        const active = current.filter((story) => isStoryActive(story));
        return active.length === current.length ? current : active;
      });
    };
    const interval = setInterval(prune, 60_000);
    return () => clearInterval(interval);
  }, []);

  const activeStories = myStories.filter((story) => isStoryActive(story));

  function addStory(story: PostedStory) {
    setMyStories((current) => [...current, { ...story, id: makeStoryId(), postedAt: Date.now() }]);
  }

  function deleteStory(id: string) {
    setMyStories((current) => current.filter((story) => story.id !== id));
  }

  function openYourStory() {
    if (activeStories.length > 0) setViewerIndex(0);
    else setComposerOpen(true);
  }

  return {
    activeStories,
    composerOpen,
    setComposerOpen,
    viewerIndex,
    setViewerIndex,
    addStory,
    deleteStory,
    openYourStory,
  };
}
