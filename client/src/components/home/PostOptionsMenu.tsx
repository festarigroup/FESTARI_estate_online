"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Dropdown, DropdownItem } from "@/components/ui/Dropdown";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { EditPostModal } from "@/components/home/EditPostModal";
import { useAuth } from "@/context/AuthContext";
import { useSavedPosts } from "@/hooks/useSavedPosts";
import { usePostShare } from "@/hooks/usePostShare";
import { usePostEdits } from "@/hooks/usePostEdits";
import { useHiddenPosts } from "@/hooks/useHiddenPosts";
import { useFollowedAuthors } from "@/hooks/useFollowedAuthors";
import { deletePost } from "@/lib/api/feed";
import { ApiError } from "@/lib/api/client";
import type { ContentPost } from "@/types/home";

interface PostOptionsMenuProps {
  post: ContentPost;
  /** Forwarded straight to usePostShare — see PostEngagementBar's own prop
   * of the same name for why (PropertyPostCard's own share counter). */
  onShare?: () => void;
}

/** The post-card "⋮" overflow menu. Two different item sets:
 *
 * - Someone else's post: Share, Save, Copy link, Embed, Unfollow, Not
 *   interested, Report — the original set. Not a Figma frame (no menu
 *   frame was provided); the item set matches a common feed-post
 *   convention rather than one specific reference app.
 * - Your own post (post.author.id === the signed-in user's id): Share,
 *   Save, Copy link, Embed, Edit post, Delete post — Unfollow/Not
 *   interested/Report all drop out, since none of them make sense
 *   against something you posted yourself.
 *
 * Share and Save duplicate PostEngagementBar's own Share/Save buttons —
 * intentionally: PostEngagementBar hides both below `sm:` (five icons plus
 * a CTA left no room for two more on a phone-width card), so this menu is
 * where a mobile visitor actually reaches them; both still show at `sm:`
 * and up on the engagement bar itself, this menu is just always available
 * as a second path to the same actions, at every width. */
export function PostOptionsMenu({ post, onShare }: PostOptionsMenuProps) {
  const { user } = useAuth();
  const { isSaved, toggleSave } = useSavedPosts();
  const { handleShare } = usePostShare(post, onShare);
  const { hidePost, unhidePost } = useHiddenPosts();
  const { markDeleted, markEdited } = usePostEdits();
  const { isFollowing, toggleFollow } = useFollowedAuthors();
  const [editOpen, setEditOpen] = useState(false);
  const saved = isSaved(post.id);
  const following = isFollowing(post.author.name);
  // post.author.id is unset for a synthetic/local-only author (a repost
  // wrapper's own attribution line, e.g.) — never "mine" in that case.
  const isOwnPost = !!user && !!post.author.id && user.id === post.author.id;

  function handleSave() {
    const wasSaved = saved;
    toggleSave(post);
    toast.success(wasSaved ? "Removed from saved." : "Saved. Find it under Saved in the sidebar.");
  }

  async function handleCopyLink() {
    const url = `${window.location.origin}${window.location.pathname}#post-${post.id}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard.");
    } catch {
      toast.error("Couldn't copy the link.");
    }
  }

  async function handleEmbed() {
    const snippet = `<iframe src="${window.location.origin}/embed/post/${post.id}" width="500" height="600" frameborder="0"></iframe>`;
    try {
      await navigator.clipboard.writeText(snippet);
      toast.success("Embed code copied to clipboard.");
    } catch {
      toast.error("Couldn't copy the embed code.");
    }
  }

  function handleToggleFollow() {
    const wasFollowing = following;
    toggleFollow(post.author.name);
    toast.success(
      wasFollowing ? `You won't see updates from ${post.author.name}.` : `You'll see updates from ${post.author.name} again.`,
    );
  }

  // Shared by "Not interested" and "Report post" — both remove the post
  // from view, each with its own message, and both stay undoable in case
  // of a misclick.
  function hideWithUndo(message: string) {
    hidePost(post.id);
    toast((t) => (
      <div className="flex items-center gap-4">
        <span className="text-sm text-ink">{message}</span>
        <button
          onClick={() => {
            unhidePost(post.id);
            toast.dismiss(t.id);
          }}
          className="text-sm font-semibold text-brand-gold hover:underline"
        >
          Undo
        </button>
      </div>
    ));
  }

  // Real backend call, not a hideWithUndo -- there's no restoring a
  // deleted post the way "Not interested" can be undone, so this confirms
  // first rather than offering an undo toast afterward.
  async function handleDelete() {
    if (!window.confirm("Delete this post? This can't be undone.")) return;
    try {
      await deletePost(post.id);
      markDeleted(post.id);
      toast.success("Post deleted.");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Couldn't delete this post.");
    }
  }

  return (
    <>
      <Dropdown
        trigger={(bind) => (
          <button {...bind} aria-label="More options" className="pb-1.5 text-muted hover:text-ink">
            <DynamicIcon name="MoreHorizontal" className="size-4 rotate-90" />
          </button>
        )}
      >
        <DropdownItem icon="Share2" label="Share" onClick={handleShare} />
        <DropdownItem icon="Bookmark" label={saved ? "Remove from Save" : "Save"} onClick={handleSave} />
        <DropdownItem icon="Link2" label="Copy link to post" onClick={handleCopyLink} />
        <DropdownItem icon="Code2" label="Embed this post" onClick={handleEmbed} />
        {isOwnPost ? (
          <>
            <DropdownItem icon="PencilLine" label="Edit post" onClick={() => setEditOpen(true)} />
            <DropdownItem icon="Trash2" label="Delete post" onClick={handleDelete} className="text-brand-rust" />
          </>
        ) : (
          <>
            <DropdownItem
              icon="CircleX"
              label={following ? `Unfollow ${post.author.name}` : `Follow ${post.author.name}`}
              onClick={handleToggleFollow}
            />
            <DropdownItem
              icon="ThumbsDown"
              label="Not interested"
              onClick={() => hideWithUndo("You'll see fewer posts like this.")}
            />
            <DropdownItem
              icon="Flag"
              label="Report post"
              onClick={() => hideWithUndo("Post reported. We'll take a look.")}
            />
          </>
        )}
      </Dropdown>

      {isOwnPost && (
        <EditPostModal
          open={editOpen}
          onClose={() => setEditOpen(false)}
          postId={post.id}
          initialBody={post.body.join("\n")}
          onSaved={(body) => markEdited(post.id, body)}
        />
      )}
    </>
  );
}
