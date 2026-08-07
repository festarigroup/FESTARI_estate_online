"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { useReposts } from "@/hooks/useReposts";

interface QuoteRepostModalProps {
  open: boolean;
  onClose: () => void;
  postId: string;
}

/** "Repost with thoughts" — add your own commentary above the original
 * post before it goes to the top of your feed. Not a Figma frame (no
 * repost frame was provided); modeled on the quote-repost convention from
 * the platforms RepostedPostCard already draws on. */
export function QuoteRepostModal({ open, onClose, postId }: QuoteRepostModalProps) {
  const [thoughts, setThoughts] = useState("");
  const { repost } = useReposts();

  function resetAndClose() {
    setThoughts("");
    onClose();
  }

  function handleSubmit() {
    repost(postId, thoughts.trim() || undefined);
    toast.success("Reposted with your thoughts to the top of your feed.");
    resetAndClose();
  }

  return (
    <Modal open={open} onClose={resetAndClose} title="Repost with thoughts">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <Avatar src="/images/avatar-kwame-composer.png" alt="Kwame" size={40} />
          <span className="font-heading text-sm text-ink">Kwame</span>
        </div>

        <textarea
          autoFocus
          value={thoughts}
          onChange={(e) => setThoughts(e.target.value)}
          placeholder="Add your thoughts..."
          rows={4}
          className="w-full resize-none rounded-lg border border-border-subtle p-3 text-base text-ink placeholder:text-muted focus:outline-2 focus:outline-brand-gold"
        />

        <p className="rounded-lg bg-surface-muted px-3 py-2 text-xs text-muted">
          The original post will be shown right below your thoughts, exactly as it appears in the feed.
        </p>

        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={resetAndClose}>
            Cancel
          </Button>
          <Button variant="navy" onClick={handleSubmit} className="px-6">
            Repost
          </Button>
        </div>
      </div>
    </Modal>
  );
}
