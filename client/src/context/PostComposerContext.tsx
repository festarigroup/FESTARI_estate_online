"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { CreatePostModal, type AttachmentType } from "@/components/home/CreatePostModal";
import type { ContentPost } from "@/types/home";

interface PostComposerContextValue {
  openCreatePost: (attachment?: AttachmentType) => void;
  registerHandler: (handler: ((post: ContentPost) => void) | null) => void;
}

const PostComposerContext = createContext<PostComposerContextValue | null>(null);

/**
 * Backs the TopNavBar's global "+ Create Post" button (Figma node
 * 3393:18030) — a page-agnostic entry point to the same CreatePostModal
 * every page's own composer already opens. Since each page (Feed, Stay)
 * owns its own local post list independently, this needs some way to hand
 * a newly-created post to whichever page is actually mounted:
 * `registerHandler` lets that page's composer register its own `addPost`
 * while it's on screen, and this provider just forwards to whatever's
 * currently registered. Visiting a page with no composer of its own (e.g.
 * Properties) means the post still gets created (or, for the local-only
 * venue/poll kinds, still shows the success toast) — it just has nowhere
 * to visually land until you navigate to a page that does.
 */
export function PostComposerProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [initialAttachment, setInitialAttachment] = useState<AttachmentType | undefined>();
  const handlerRef = useRef<((post: ContentPost) => void) | null>(null);

  const openCreatePost = useCallback((attachment?: AttachmentType) => {
    setInitialAttachment(attachment);
    setOpen(true);
  }, []);

  const registerHandler = useCallback((handler: ((post: ContentPost) => void) | null) => {
    handlerRef.current = handler;
  }, []);

  return (
    <PostComposerContext.Provider value={{ openCreatePost, registerHandler }}>
      {children}
      <CreatePostModal
        key={open ? initialAttachment ?? "text" : "closed"}
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={(post) => handlerRef.current?.(post)}
        initialAttachment={initialAttachment}
      />
    </PostComposerContext.Provider>
  );
}

export function usePostComposer() {
  const ctx = useContext(PostComposerContext);
  if (!ctx) throw new Error("usePostComposer must be used within a PostComposerProvider");
  return ctx;
}

/** Registers `onCreatePost` as the destination for posts created via the
 * global composer while this component stays mounted, and clears it again
 * on unmount so a stale handler from a page you've navigated away from
 * never fires. */
export function useRegisterPostComposerHandler(onCreatePost: (post: ContentPost) => void) {
  const { registerHandler } = usePostComposer();

  useEffect(() => {
    registerHandler(onCreatePost);
    return () => registerHandler(null);
  }, [onCreatePost, registerHandler]);
}
