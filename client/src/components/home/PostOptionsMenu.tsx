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
import { useMutedAuthors } from "@/hooks/useMutedAuthors";
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
 * - Someone else's post: Share, Save, Copy link, Embed, Unfollow, Mute,
 *   Report — the original set. Not a Figma frame (no menu frame was
 *   provided); the item set matches a common feed-post convention rather
 *   than one specific reference app.
 * - Your own post (post.author.id === the signed-in user's id): Share,
 *   Save, Copy link, Embed, Edit post, Delete post — Unfollow/Mute/Report
 *   all drop out, since none of them make sense against something you
 *   posted yourself.
 *
 * Share and Save live here only — PostEngagementBar used to render its own
 * copies of both (hidden below `sm:`), but that just meant the same two
 * actions had two competing homes depending on screen width. This dropdown
 * is now the one place for them, at every width. */
export function PostOptionsMenu({ post, onShare }: PostOptionsMenuProps) {
  const { user } = useAuth();
  const { isSaved, toggleSave } = useSavedPosts();
  const { handleShare } = usePostShare(post, onShare);
  const { hidePost, unhidePost } = useHiddenPosts();
  const { markDeleted, markEdited } = usePostEdits();
  const { isFollowing, toggleFollow } = useFollowedAuthors();
  const { isMuted, toggleMute } = useMutedAuthors();
  const [editOpen, setEditOpen] = useState(false);
  const saved = isSaved(post.id);
  const following = isFollowing(post.author.name);
  const muted = isMuted(post.author.name);
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

  // Unlike Unfollow, muting leaves the follow relationship alone — it just
  // drops every post from this author out of the feed (see Feed.tsx's own
  // isMuted filter) until unmuted, the same "quietly stop seeing them
  // without unfollowing" distinction Instagram/X draw.
  function handleToggleMute() {
    const wasMuted = muted;
    toggleMute(post.author.name);
    toast.success(
      wasMuted ? `You'll see posts from ${post.author.name} again.` : `You won't see posts from ${post.author.name} anymore.`,
    );
  }

  // Used by "Report post" — removes the post from view, stays undoable in
  // case of a misclick.
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
              icon={muted ? "Volume2" : "VolumeX"}
              label={muted ? `Unmute ${post.author.name}` : `Mute ${post.author.name}`}
              onClick={handleToggleMute}
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
