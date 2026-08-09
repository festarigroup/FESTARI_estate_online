"use client";

import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { FeedPostCard } from "@/components/home/FeedPostCard";
import { useSavedPosts } from "@/hooks/useSavedPosts";

/** Backs the sidebar's "Saved" nav item — whatever Save was clicked on across
 * the feed, persisted client-side (see useSavedPosts) since there's no
 * backend endpoint for this yet. Not a Figma frame; laid out to match the
 * feed column's width/spacing rather than the full two-column Home grid,
 * since there's no right-sidebar content specified for this screen. */
export default function SavedPage() {
  const { savedPosts } = useSavedPosts();

  return (
    // No lg:px -- same reasoning as Home/Properties/Stay: <main> already
    // provides the sidebar clearance and right margin, so this doesn't
    // need to stack another lg:px-10 on top.
    <div className="mx-auto flex max-w-[900px] flex-col gap-6 px-4 py-6 sm:px-6 lg:px-0">
      <h1 className="font-heading text-xl text-ink">Saved</h1>

      {savedPosts.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border-subtle bg-white py-16 text-center">
          <DynamicIcon name="Bookmark" className="size-8 text-muted" />
          <p className="text-sm text-muted">
            Nothing saved yet. Tap Save on any post in your feed to find it here.
          </p>
        </div>
      ) : (
        <div className="flex w-full flex-col gap-6">
          {savedPosts.map((post) => (
            <FeedPostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
