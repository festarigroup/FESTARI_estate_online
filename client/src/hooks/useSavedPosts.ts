"use client";

import { useCallback, useEffect, useState } from "react";
import * as feedApi from "@/lib/api/feed";
import { mapPost } from "@/lib/adapters";
import { useAuth } from "@/context/AuthContext";
import type { FeedPost } from "@/types/home";

/** Saved-posts state, backed by the real /feed/saved endpoint. Loaded once
 * per signed-in session and kept in sync optimistically as posts are
 * saved/unsaved from anywhere in the app. */
export function useSavedPosts() {
  const { user } = useAuth();
  const [savedPosts, setSavedPosts] = useState<FeedPost[]>([]);
  const [loaded, setLoaded] = useState(false);

  const load = useCallback(async () => {
    if (!user) return;
    try {
      const posts = await feedApi.listSavedPosts();
      setSavedPosts(posts.map(mapPost));
    } catch {
      // leave whatever was already loaded
    } finally {
      setLoaded(true);
    }
  }, [user]);

  useEffect(() => {
    if (user && !loaded) load();
  }, [user, loaded, load]);

  function isSaved(id: string) {
    return savedPosts.some((p) => p.id === id);
  }

  function toggleSave(post: FeedPost) {
    const already = isSaved(post.id);
    setSavedPosts((prev) => (already ? prev.filter((p) => p.id !== post.id) : [post, ...prev]));

    const request = already ? feedApi.unsavePost(post.id) : feedApi.savePost(post.id);
    request.catch(() => {
      // roll back on failure
      setSavedPosts((prev) => (already ? [post, ...prev] : prev.filter((p) => p.id !== post.id)));
    });
  }

  return { savedPosts, isSaved, toggleSave };
}
