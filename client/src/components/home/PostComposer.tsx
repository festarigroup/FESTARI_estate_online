"use client";

import { useState } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { CreatePostModal, ATTACHMENT_TYPES, type AttachmentType } from "@/components/home/CreatePostModal";
import type { FeedPost } from "@/types/home";

/** "Post Composer" card: avatar + prompt input, plus quick-attach actions —
 * both open the same create-post modal, pre-selecting an attachment type
 * when opened from one of the four buttons below the input. */
export function PostComposer({ onCreatePost }: { onCreatePost: (post: FeedPost) => void }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [initialAttachment, setInitialAttachment] = useState<AttachmentType | undefined>();

  function openModal(attachment?: AttachmentType) {
    setInitialAttachment(attachment);
    setModalOpen(true);
  }

  return (
    <div className="flex w-full shrink-0 flex-col gap-6 rounded-xl bg-white p-6 drop-shadow-[0px_4px_6px_rgba(0,31,63,0.08)]">
      <div className="flex w-full items-center gap-4">
        <Avatar src="/images/avatar-kwame-composer.png" alt="Kwame" size={48} />
        <button
          onClick={() => openModal()}
          className="flex-1 rounded-full bg-surface-muted px-6 py-3 text-left text-base text-muted hover:bg-border-subtle"
        >
          What&apos;s on your mind, Kwame?
        </button>
      </div>

      <div className="flex w-full flex-wrap items-center gap-8 border-t border-border-subtle pt-4">
        {ATTACHMENT_TYPES.map((item) => (
          <button
            key={item.type}
            onClick={() => openModal(item.type)}
            className="flex items-center gap-2 text-brand-navy/70 hover:text-brand-navy"
          >
            <DynamicIcon name={item.icon} className="size-5" />
            <span className="text-sm font-medium">{item.label}</span>
          </button>
        ))}
      </div>

      <CreatePostModal
        key={modalOpen ? initialAttachment ?? "text" : "closed"}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={onCreatePost}
        initialAttachment={initialAttachment}
      />
    </div>
  );
}
