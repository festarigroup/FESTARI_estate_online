"use client";

import { useEffect, useState } from "react";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { FeedPostCard } from "@/components/home/FeedPostCard";
import { useAuth } from "@/context/AuthContext";
import { applyPostEdits, usePostEdits } from "@/hooks/usePostEdits";
import { mapPost } from "@/lib/adapters";
import * as feedApi from "@/lib/api/feed";
import type { ContentPost } from "@/types/home";

/** Backs the sidebar's "My Activity" nav item — every post the signed-in
 * user has created themselves, newest first, so a post made from either
 * the Home feed's own composer or TopNavBar's global "+ Create Post" shows
 * up here too. Filtered client-side out of a broad recent-posts fetch
 * rather than a dedicated "my posts" endpoint — there isn't one yet
 * (listPosts only takes kind/page/limit, see
 * server/src/app/services/postsService.ts's own list() signature), and
 * this app's scale doesn't call for adding one just yet.
 *
 * Not a Figma frame; laid out to match Saved's own single-column
 * convention rather than the full two-column Home grid, since there's no
 * right-sidebar content specified for this screen either. */
export default function ActivityPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<ContentPost[]>([]);
  const [loading, setLoading] = useState(true);
  const { isDeleted, getEditedBody } = usePostEdits();

  useEffect(() => {
    // DashboardShell already gates every (app) route behind a signed-in
    // user (redirecting to /login otherwise), so `user` is never actually
    // null by the time this renders — this guard just satisfies the type
    // (ApiUser | null) without calling setState synchronously in the
    // no-user branch, which set-state-in-effect flags.
    if (!user) return;
    feedApi
      .listPosts({ limit: 100 })
      .then(({ items }) => setPosts(items.map(mapPost).filter((post) => post.author.id === user.id)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  const myPosts = applyPostEdits(posts, { isDeleted, getEditedBody });

  return (
    // No lg:px -- same reasoning as Saved/Home/Properties/Stay: <main>
    // already provides the sidebar clearance and right margin.
    <div className="mx-auto flex max-w-[900px] flex-col gap-6 px-4 py-6 sm:px-6 lg:px-0">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-xl text-ink">My Activity</h1>
        <p className="text-sm text-muted">Every post you&apos;ve shared, newest first.</p>
      </div>

      {loading ? (
        <p className="py-8 text-center text-sm text-muted">Loading your posts...</p>
      ) : myPosts.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-[39px] border border-dashed border-border-subtle bg-white py-16 text-center">
          <DynamicIcon name="History" className="size-8 text-muted" />
          <p className="text-sm text-muted">You haven&apos;t posted anything yet.</p>
        </div>
      ) : (
        <div className="flex w-full flex-col gap-6">
          {myPosts.map((post) => (
            <FeedPostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
