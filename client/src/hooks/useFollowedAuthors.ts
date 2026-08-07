"use client";

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "festari:unfollowed-authors";

type Listener = () => void;
const listeners = new Set<Listener>();

/**
 * Module-level store (see useSavedPosts for why) tracking which post
 * authors the current user has unfollowed from a post's own "Unfollow X"
 * menu item. Inverted on purpose: anyone whose post already shows up in
 * the main feed is narratively someone you already follow, so the default
 * (absent from this list) is "following" — only explicit unfollows get
 * recorded. Keyed by author name since that's the only stable identifier
 * PostAuthor carries.
 *
 * Deliberately separate from WhoToFollow's own follow state: that widget
 * tracks *suggested, not-yet-followed* people, a different default and a
 * different list of people, not a duplicate of this one.
 */
let cachedNames: string[] = typeof window !== "undefined" ? readFromStorage() : [];

function readFromStorage(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeToStorage(names: string[]) {
  cachedNames = names;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(names));
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
  return cachedNames;
}

const EMPTY_NAMES: string[] = [];

function getServerSnapshot(): string[] {
  return EMPTY_NAMES;
}

export function useFollowedAuthors() {
  const unfollowedNames = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function isFollowing(name: string) {
    return !unfollowedNames.includes(name);
  }

  function toggleFollow(name: string) {
    const following = !unfollowedNames.includes(name);
    writeToStorage(following ? [name, ...unfollowedNames] : unfollowedNames.filter((n) => n !== name));
  }

  return { isFollowing, toggleFollow };
}
