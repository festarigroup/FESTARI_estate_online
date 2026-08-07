"use client";

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "festari:reposted-post-ids";

type Listener = () => void;
const listeners = new Set<Listener>();

/**
 * Module-level store (see useSavedPosts for why) holding the ids of posts
 * the current user has reposted, most-recent-first — Feed reads this to
 * render a RepostedPost wrapper at the top of the feed for each one, and
 * every card's Repost button reads/writes the same list without a context
 * provider. Persisted to localStorage so it survives a reload.
 */
let cachedIds: string[] = typeof window !== "undefined" ? readFromStorage() : [];

function readFromStorage(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeToStorage(ids: string[]) {
  cachedIds = ids;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // storage full/disabled — the in-memory cache still reflects the change
    // for the rest of this session, just won't survive a reload.
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return cachedIds;
}

// A stable (not freshly-allocated) empty array — useSyncExternalStore warns
// if getServerSnapshot's result isn't referentially cached.
const EMPTY_IDS: string[] = [];

function getServerSnapshot(): string[] {
  return EMPTY_IDS;
}

export function useReposts() {
  const repostedIds = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function isReposted(id: string) {
    return repostedIds.includes(id);
  }

  function toggleRepost(id: string) {
    const already = repostedIds.includes(id);
    writeToStorage(already ? repostedIds.filter((i) => i !== id) : [id, ...repostedIds]);
  }

  return { repostedIds, isReposted, toggleRepost };
}
