"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { updatePost } from "@/lib/api/feed";
import { ApiError } from "@/lib/api/client";

interface EditPostModalProps {
  open: boolean;
  onClose: () => void;
  postId: string;
  initialBody: string;
  /** Called with the saved body's lines (already split on "\n", matching
   * every ContentPost variant's own `body: string[]` shape) once the
   * update actually succeeds — usePostEdits.markEdited, from the caller. */
  onSaved: (body: string[]) => void;
}

/** Edit surface for a post's own text, opened from PostOptionsMenu's
 * "Edit post" item (own posts only). Text-only rather than a full re-run
 * of CreatePostModal's attachment picker: PUT /feed/posts/:id only accepts
 * body/hashtags server-side (no changing a post's images or linked
 * property/artisan/hotel after the fact — see
 * server/src/app/validators/postValidators.ts's updatePostSchema), so
 * there's nothing else here to actually let someone change. */
export function EditPostModal({ open, onClose, postId, initialBody, onSaved }: EditPostModalProps) {
  const [body, setBody] = useState(initialBody);
  const [submitting, setSubmitting] = useState(false);

  function resetAndClose() {
    setBody(initialBody);
    onClose();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = body.trim();
    if (!trimmed) return;
    setSubmitting(true);
    try {
      await updatePost(postId, { body: trimmed });
      onSaved(trimmed.split("\n").filter(Boolean));
      toast.success("Post updated.");
      onClose();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Couldn't update this post.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal open={open} onClose={resetAndClose} title="Edit post">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <textarea
          autoFocus
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={5}
          className="w-full resize-none rounded-lg border border-border-subtle p-3 text-base text-ink placeholder:text-muted focus:outline-2 focus:outline-brand-gold"
        />

        <div className="flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={resetAndClose}>
            Cancel
          </Button>
          <Button type="submit" variant="navy" className="px-6" disabled={submitting || !body.trim()}>
            {submitting ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
