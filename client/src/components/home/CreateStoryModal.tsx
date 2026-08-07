"use client";

import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { DynamicIcon } from "@/components/ui/DynamicIcon";

interface CreateStoryModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (item: { image: string; caption?: string }) => void;
}

/** "Create Story" flow — pick an image, add a caption, share it to the rail. */
export function CreateStoryModal({ open, onClose, onCreate }: CreateStoryModalProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    // Revoke whatever was picked before, if anything — it's being replaced
    // and nothing downstream ever saw it, so this is the one safe place to
    // free it.
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(file));
  }

  // Cancel / backdrop click / Escape: nothing downstream is using this blob
  // URL, so discard it here.
  function handleCancel() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setCaption("");
    onClose();
  }

  function handleShare() {
    if (!previewUrl) return;
    onCreate({
      image: previewUrl,
      caption: caption.trim() || undefined,
    });
    toast.success("Your story is live for 24 hours.");
    // Deliberately NOT revoking previewUrl — the story we just created now
    // owns this blob URL for as long as it's shown in the rail/viewer.
    // (A previous version revoked it right here, which killed the preview
    // the instant the story was created — the bug this comment is guarding
    // against regressing.)
    setPreviewUrl(null);
    setCaption("");
    onClose();
  }

  return (
    <Modal open={open} onClose={handleCancel} title="Add to your story">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <Avatar src="/images/avatar-kwame-composer.png" alt="Kwame" size={40} />
          <span className="font-heading text-sm text-ink">Kwame</span>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {previewUrl ? (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="relative mx-auto h-80 w-56 overflow-hidden rounded-xl"
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- local blob: preview, next/image can't optimize it */}
            <img src={previewUrl} alt="Story preview" className="size-full object-cover" />
          </button>
        ) : (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="mx-auto flex h-80 w-56 flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-muted text-muted hover:border-brand-gold hover:text-brand-gold"
          >
            <DynamicIcon name="ImageIcon" className="size-8" />
            <span className="text-sm font-medium">Choose a photo</span>
          </button>
        )}

        <input
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Add a caption (optional)"
          className="w-full rounded-full bg-surface-muted px-4 py-2 text-sm text-ink placeholder:text-muted focus:outline-2 focus:outline-brand-gold"
        />

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="ghost" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="gold" onClick={handleShare} disabled={!previewUrl} className="px-6">
            Share to Story
          </Button>
        </div>
      </div>
    </Modal>
  );
}
