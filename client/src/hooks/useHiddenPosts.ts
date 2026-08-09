"use client";

import { useSyncExternalStore } from "react";

type Listener = () => void;
const listeners = new Set<Listener>();

/**
 * Module-level store (see useSavedPosts for the pattern) holding the ids
 * of posts the current user has dismissed via "Not interested" or "Report
 * post" — Feed filters these out of what renders.
 *
 * Deliberately IN-MEMORY ONLY, unlike useSavedPosts/useReposts — neither
 * action is backed by a real moderation/feed-ranking system here, so
 * persisting a hide forever (past the toast's few-second Undo window,
 * with no page to review or restore it from — unlike Saved) would mean
 * quietly losing seed content for good. A reload is the escape hatch: it
 * puts every post back the way it started, same as everything else that
 * isn't explicitly saved.
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

export function useHiddenPosts() {
  const hiddenIds = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function isHidden(id: string) {
    return hiddenIds.includes(id);
  }

  function hidePost(id: string) {
    if (!hiddenIds.includes(id)) writeIds([id, ...hiddenIds]);
  }

  function unhidePost(id: string) {
    writeIds(hiddenIds.filter((i) => i !== id));
  }

  return { hiddenIds, isHidden, hidePost, unhidePost };
}
