"use client";

import { useSyncExternalStore } from "react";

type Listener = () => void;
const listeners = new Set<Listener>();

/**
 * Module-level store (see useHiddenPosts for the identical pattern) holding
 * the ids of story items the current user has dismissed via "Report story"
 * in someone else's story — StoryBar filters these out of both the rail
 * and whatever it hands to StoryViewer.
 *
 * A separate store from useHiddenPosts rather than reusing it: post ids and
 * story ids are different id spaces, and keeping them apart means a report
 * here can never accidentally suppress an unrelated post that happens to
 * share an id.
 *
 * Deliberately IN-MEMORY ONLY, same reasoning as useHiddenPosts — there's
 * no real moderation backend behind "Report story", so a reload is the
 * escape hatch that puts every story back the way it started.
 */
let cachedIds: string[] = [];

function writeIds(ids: string[]) {
  cachedIds = ids;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return cachedIds;
}

const EMPTY_IDS: string[] = [];

function getServerSnapshot(): string[] {
  return EMPTY_IDS;
}

export function useHiddenStories() {
  const hiddenIds = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function isHidden(id: string) {
    return hiddenIds.includes(id);
  }

  function hideStory(id: string) {
    if (!hiddenIds.includes(id)) writeIds([id, ...hiddenIds]);
  }

  function unhideStory(id: string) {
    writeIds(hiddenIds.filter((i) => i !== id));
  }

  return { hiddenIds, isHidden, hideStory, unhideStory };
}
