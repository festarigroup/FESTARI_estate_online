"use client";

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "festari:muted-authors";

type Listener = () => void;
const listeners = new Set<Listener>();

/**
 * Module-level store (see useFollowedAuthors for the pattern) tracking which
 * post authors the current user has muted from a post's own "Mute X" menu
 * item. Deliberately distinct from unfollowing: muting hides that author's
 * posts from the feed without touching the follow relationship or the
 * author ever finding out — the same distinction Instagram/X draw between
 * the two. Persisted to localStorage (unlike useHiddenPosts' per-post
 * hides) since muting is about a *person* you'd expect to stay muted after
 * a reload, not a one-off post.
 *
 * Keyed by author name, same as useFollowedAuthors — PostAuthor doesn't
 * always carry a real `id` (a synthetic/local-only author has none), so
 * name is the only identifier every post's author reliably has.
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

export function useMutedAuthors() {
  const mutedNames = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function isMuted(name: string) {
    return mutedNames.includes(name);
  }

  function toggleMute(name: string) {
    const muted = mutedNames.includes(name);
    writeToStorage(muted ? mutedNames.filter((n) => n !== name) : [name, ...mutedNames]);
  }

  return { mutedNames, isMuted, toggleMute };
}
