"use client";

import { useSyncExternalStore } from "react";

interface PostEditsState {
  deletedIds: string[];
  /** postId -> its new body lines, same shape every ContentPost variant's
   * own `body` field already is. */
  edits: Record<string, string[]>;
}

type Listener = () => void;
const listeners = new Set<Listener>();

/**
 * Module-level store (see useHiddenPosts for the pattern) tracking posts
 * the current user has edited or deleted through PostOptionsMenu's own
 * "Edit post"/"Delete post" items. Unlike useHiddenPosts' purely-local
 * "Not interested"/"Report post", both of these are real backend calls
 * (PUT/DELETE /feed/posts/:id) — this just mirrors the result locally so
 * every list already holding this post (Feed, My Activity, Saved) reflects
 * it immediately instead of each one having to re-fetch to notice.
 */
let state: PostEditsState = { deletedIds: [], edits: {} };

function write(next: PostEditsState) {
  state = next;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return state;
}

const EMPTY_STATE: PostEditsState = { deletedIds: [], edits: {} };

function getServerSnapshot(): PostEditsState {
  return EMPTY_STATE;
}

export function usePostEdits() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function isDeleted(id: string) {
    return snapshot.deletedIds.includes(id);
  }

  function getEditedBody(id: string) {
    return snapshot.edits[id];
  }

  function markDeleted(id: string) {
    if (!snapshot.deletedIds.includes(id)) {
      write({ ...snapshot, deletedIds: [id, ...snapshot.deletedIds] });
    }
  }

  function markEdited(id: string, body: string[]) {
    write({ ...snapshot, edits: { ...snapshot.edits, [id]: body } });
  }

  return { isDeleted, getEditedBody, markDeleted, markEdited };
}

/** Applies whatever's in the store above to a freshly-fetched/mapped post
 * list — shared by Feed and the My Activity page so both reflect an edit
 * or delete made via PostOptionsMenu without a full re-fetch. Takes the
 * store's own read functions rather than calling the hook itself, since
 * this runs inside a `.map()`/render body, not as a hook of its own. */
export function applyPostEdits<T extends { id: string; body: string[] }>(
  posts: T[],
  overrides: { isDeleted: (id: string) => boolean; getEditedBody: (id: string) => string[] | undefined },
): T[] {
  return posts
    .filter((post) => !overrides.isDeleted(post.id))
    .map((post) => {
      const editedBody = overrides.getEditedBody(post.id);
      return editedBody ? { ...post, body: editedBody } : post;
    });
}
