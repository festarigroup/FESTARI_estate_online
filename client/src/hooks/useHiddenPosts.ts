"use client";

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "festari:hidden-post-ids";

type Listener = () => void;
const listeners = new Set<Listener>();

/**
 * Module-level store (see useSavedPosts for why) holding the ids of posts
 * the current user has dismissed via "Not interested" or "Report post" —
 * Feed filters these out of what renders. Persisted to localStorage so a
 * dismissal survives a reload, same as every other post-level preference
 * in this app.
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
    if (!hiddenIds.includes(id)) writeToStorage([id, ...hiddenIds]);
  }

  function unhidePost(id: string) {
    writeToStorage(hiddenIds.filter((i) => i !== id));
  }

  return { hiddenIds, isHidden, hidePost, unhidePost };
}
