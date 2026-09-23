"use client";

import { useState } from "react";
import { CreateArticleModal } from "@/components/shared/CreateArticleModal";
import { CreatePollModal } from "@/components/shared/CreatePollModal";
import { CreatePostModal } from "@/components/shared/CreatePostModal";

export type PostModalType = "image" | "video" | "poll" | "article";

/** Shared state + JSX for the Image/Video/Poll/Article create-post modals, so any
 * trigger (TopNav's Create button, the feed composer's icons, etc.) can open them. */
export function usePostModals() {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<PostModalType>("image");

  function openPostModal(nextType: PostModalType) {
    setType(nextType);
    setOpen(true);
  }

  function close() {
    setOpen(false);
  }

  const modals = (
    <>
      <CreatePostModal
        open={open && (type === "image" || type === "video")}
        initialType={type === "video" ? "video" : "image"}
        onClose={close}
        onSwitchType={openPostModal}
      />
      <CreatePollModal open={open && type === "poll"} onClose={close} onSwitchType={openPostModal} />
      <CreateArticleModal open={open && type === "article"} onClose={close} onSwitchType={openPostModal} />
    </>
  );

  return { openPostModal, modals };
}
