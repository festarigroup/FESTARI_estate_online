"use client";

import { useSyncExternalStore } from "react";
import type { FeedPost } from "@/types/home";

const STORAGE_KEY = "festari:saved-posts";

type Listener = () => void;
const listeners = new Set<Listener>();

/**
 * Module-level store (not React state) so every card's Save button reads and
 * writes the same list without needing a context provider — persisted to
 * localStorage so it survives a reload. `useSyncExternalStore` keeps the
 * server/first-client-render snapshot at `[]` (no `window` during SSR) and
 * then reconciles to the real localStorage contents post-hydration, which is
 * exactly the case it's designed for — no manual "mounted" effect needed.
 */
let cachedPosts: FeedPost[] = typeof window !== "undefined" ? readFromStorage() : [];

function readFromStorage(): FeedPost[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeToStorage(posts: FeedPost[]) {
  cachedPosts = posts;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
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
  return cachedPosts;
}

// A stable (not freshly-allocated) empty array — useSyncExternalStore warns
// if getServerSnapshot's result isn't referentially cached, since a new []
// on every call looks like an infinite-loop bug from the inside.
const EMPTY_POSTS: FeedPost[] = [];

function getServerSnapshot(): FeedPost[] {
  return EMPTY_POSTS;
}

export function useSavedPosts() {
  const savedPosts = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function isSaved(id: string) {
    return savedPosts.some((p) => p.id === id);
  }

  function toggleSave(post: FeedPost) {
    const already = savedPosts.some((p) => p.id === post.id);
    writeToStorage(already ? savedPosts.filter((p) => p.id !== post.id) : [post, ...savedPosts]);
  }

  return { savedPosts, isSaved, toggleSave };
}
