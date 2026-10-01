"use client";

import { useEffect, useState } from "react";
import type { PostedStory } from "@/components/shared/PostStoryModal";

const STORY_LIFETIME_MS = 24 * 60 * 60 * 1000;

export interface MyStory extends PostedStory {
  id: string;
  postedAt: number;
}

function makeStoryId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `story-${Date.now()}`;
}

/** Shared "my story" state for Discover's two story-rail layouts (the
 * desktop vertical aside and the mobile horizontal bar) — lifted to a single
 * hook call in discover/page.tsx and threaded down as props, rather than
 * each layout owning its own copy, so posting/deleting a story stays
 * consistent regardless of which layout is visible at a given viewport. */
export function useDiscoverStories() {
  const [myStories, setMyStories] = useState<MyStory[]>([]);
  const [composerOpen, setComposerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);

  useEffect(() => {
    const prune = () => {
      setMyStories((current) => {
        const active = current.filter((story) => Date.now() - story.postedAt < STORY_LIFETIME_MS);
        return active.length === current.length ? current : active;
      });
    };
    const interval = setInterval(prune, 60_000);
    return () => clearInterval(interval);
  }, []);

  const activeStories = myStories.filter((story) => Date.now() - story.postedAt < STORY_LIFETIME_MS);

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
