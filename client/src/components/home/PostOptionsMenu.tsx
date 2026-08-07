"use client";

import toast from "react-hot-toast";
import { Dropdown, DropdownItem } from "@/components/ui/Dropdown";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { useSavedPosts } from "@/hooks/useSavedPosts";
import { useHiddenPosts } from "@/hooks/useHiddenPosts";
import { useFollowedAuthors } from "@/hooks/useFollowedAuthors";
import type { ContentPost } from "@/types/home";

/** The post-card "⋮" overflow menu — Save, Copy link, Embed, Unfollow,
 * Not interested, Report. Not a Figma frame (no menu frame was provided);
 * the item set matches a common feed-post convention rather than one
 * specific reference app. */
export function PostOptionsMenu({ post }: { post: ContentPost }) {
  const { isSaved, toggleSave } = useSavedPosts();
  const { hidePost, unhidePost } = useHiddenPosts();
  const { isFollowing, toggleFollow } = useFollowedAuthors();
  const saved = isSaved(post.id);
  const following = isFollowing(post.author.name);

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

  return (
    <Dropdown
      trigger={(bind) => (
        <button {...bind} aria-label="More options" className="pb-1.5 text-muted hover:text-ink">
          <DynamicIcon name="MoreHorizontal" className="size-4 rotate-90" />
        </button>
      )}
    >
      <DropdownItem icon="Bookmark" label={saved ? "Remove from Save" : "Save"} onClick={handleSave} />
      <DropdownItem icon="Link2" label="Copy link to post" onClick={handleCopyLink} />
      <DropdownItem icon="Code2" label="Embed this post" onClick={handleEmbed} />
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
    </Dropdown>
  );
}
