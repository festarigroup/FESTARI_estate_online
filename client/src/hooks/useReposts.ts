"use client";

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "festari:reposts";

export interface RepostRecord {
  postId: string;
  /** Present for a "Repost with thoughts" — the commentary shown above the
   * nested original in RepostedPostCard. Absent for a plain repost. */
  thoughts?: string;
}

type Listener = () => void;
const listeners = new Set<Listener>();

/**
 * Module-level store (see useSavedPosts for why) holding every post the
 * current user has reposted, most-recent-first, each optionally carrying
 * the commentary from a "Repost with thoughts" — Feed reads this to render
 * a RepostedPost wrapper at the top of the feed for each one, and every
 * card's Repost control reads/writes the same list without a context
 * provider. Persisted to localStorage so it survives a reload.
 */
let cachedReposts: RepostRecord[] = typeof window !== "undefined" ? readFromStorage() : [];

function readFromStorage(): RepostRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeToStorage(reposts: RepostRecord[]) {
  cachedReposts = reposts;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reposts));
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
  return cachedReposts;
}

// A stable (not freshly-allocated) empty array — useSyncExternalStore warns
// if getServerSnapshot's result isn't referentially cached.
const EMPTY_REPOSTS: RepostRecord[] = [];

function getServerSnapshot(): RepostRecord[] {
  return EMPTY_REPOSTS;
}

export function useReposts() {
  const reposts = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function isReposted(postId: string) {
    return reposts.some((r) => r.postId === postId);
  }

  function getThoughts(postId: string) {
    return reposts.find((r) => r.postId === postId)?.thoughts;
  }

  /** Adds (or replaces, moving to the front) a repost for postId — with
   * `thoughts` for "Repost with thoughts", or without for a plain repost. */
  function repost(postId: string, thoughts?: string) {
    const rest = reposts.filter((r) => r.postId !== postId);
    writeToStorage([{ postId, thoughts }, ...rest]);
  }

  function removeRepost(postId: string) {
    writeToStorage(reposts.filter((r) => r.postId !== postId));
  }

  /** Plain toggle for the "already reposted → click removes it" path. */
  function toggleRepost(postId: string) {
    if (isReposted(postId)) removeRepost(postId);
    else repost(postId);
  }

  return {
    repostedIds: reposts.map((r) => r.postId),
    reposts,
    isReposted,
    getThoughts,
    repost,
    removeRepost,
    toggleRepost,
  };
}
