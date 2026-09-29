"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState, type DragEvent } from "react";
import { createPortal } from "react-dom";
import { showErrorToast, showSuccessToast } from "@/components/shared/AppToast";
import { NavIcon } from "@/components/shared/NavIcon";
import { useAnimatedSheet } from "@/hooks/useAnimatedSheet";
import { cn } from "@/lib/utils";

const MEDIA_ACCEPT = ["image/png", "image/jpeg", "image/gif", "video/mp4", "video/quicktime", "video/webm"];

export interface PostedStory {
  url: string;
  isVideo: boolean;
  caption?: string;
}

interface PostStoryModalProps {
  open: boolean;
  onClose: () => void;
  onPost: (story: PostedStory) => void;
}

/** Single-image/video "add to your story" composer — a lighter-weight
 * sibling of CreatePostModal, since a story is just one piece of media plus
 * an optional caption rather than a full post. */
export function PostStoryModal({ open, onClose, onPost }: PostStoryModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  // Set right before handing a preview URL off to onPost, so the cleanup
  // below doesn't revoke a URL the parent is now displaying elsewhere.
  const handedOffUrlRef = useRef<string | null>(null);

  const preview = useMemo(
    () => (file ? { url: URL.createObjectURL(file), isVideo: file.type.startsWith("video/") } : null),
    [file],
  );

  useEffect(() => {
    if (!preview) return;
    const { url } = preview;
    return () => {
      if (url !== handedOffUrlRef.current) URL.revokeObjectURL(url);
    };
  }, [preview]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const { mounted, closing } = useAnimatedSheet(open);
  if (!mounted) return null;

  function pickFile(list: FileList | null) {
    const picked = list?.[0];
    if (!picked) return;
    if (!MEDIA_ACCEPT.includes(picked.type)) {
      showErrorToast("Only PNG, JPEG, GIF, MP4, MOV or WEBM files are supported");
      return;
    }
    setFile(picked);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragActive(false);
    pickFile(event.dataTransfer.files);
  }

  function resetState() {
    setFile(null);
    setCaption("");
  }

  function handleClose() {
    resetState();
    onClose();
  }

  function handlePost() {
    if (!preview) {
      showErrorToast("Add a photo or video for your story");
      return;
    }
    handedOffUrlRef.current = preview.url;
    onPost({ url: preview.url, isVideo: preview.isVideo, caption: caption.trim() || undefined });
    showSuccessToast("Your story has been posted");
    resetState();
    onClose();
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 sm:items-center sm:p-4"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-label="Add to your story"
    >
      <div onClick={(event) => event.stopPropagation()} className="relative w-full sm:max-w-[420px]">
        <button
          type="button"
          aria-label="Close"
          onClick={handleClose}
          className="absolute -right-3 -top-3 z-10 hidden size-7 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-md hover:bg-gray-50 sm:flex"
        >
          <svg width="9" height="9" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M1 1L11 11M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        <div
          className={cn(
            "flex max-h-[90vh] w-full flex-col gap-4 overflow-y-auto rounded-t-3xl bg-white/95 p-6 shadow-[0px_24px_60px_-15px_rgba(0,0,0,0.15)] backdrop-blur-[8px] sm:rounded-2xl",
            closing ? "max-sm:animate-sheet-slide-down" : "max-sm:animate-sheet-slide-up",
          )}
        >
          <div className="h-[3px] w-[152px] shrink-0 self-center rounded-[20px] bg-[#334154] sm:hidden" />
          <p className="text-lg font-semibold leading-6 tracking-[-0.36px] text-[#111826]">Add to your story</p>

          <input
            ref={inputRef}
            type="file"
            accept={MEDIA_ACCEPT.join(",")}
            className="hidden"
            onChange={(event) => pickFile(event.target.files)}
          />

          {preview ? (
            <div className="relative aspect-[9/16] w-full max-h-[420px] shrink-0 overflow-hidden rounded-xl bg-gray-100">
              {preview.isVideo ? (
                <video src={preview.url} className="size-full object-cover" muted autoPlay loop playsInline />
              ) : (
                <Image src={preview.url} alt="" fill className="object-cover" sizes="420px" />
              )}
              <button
                type="button"
                aria-label="Choose a different file"
                onClick={() => inputRef.current?.click()}
                className="absolute right-2 top-2 flex size-8 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70"
              >
                <NavIcon icon="/icons/create-menu-upload-arrow.svg" color="white" size={16} />
              </button>
            </div>
          ) : (
            <div
              onDragOver={(event) => {
                event.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
              role="button"
              tabIndex={0}
              className={cn(
                "flex min-h-[220px] w-full cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed px-6 py-6 text-center",
                dragActive ? "border-brand-900 bg-brand-900/5" : "border-[#cbd5e0] bg-[#cbd5e0]/30",
              )}
            >
              <p className="text-xs text-[#19161d]">Drag and drop a photo or video here</p>
              <p className="text-xs text-[#86888a]">or</p>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  inputRef.current?.click();
                }}
                className="flex h-11 items-center justify-center gap-2 rounded-[40px] bg-[#e2e5f0] px-4 text-sm font-medium text-[#19161d]"
              >
                Choose a file
                <NavIcon icon="/icons/create-menu-upload-arrow.svg" color="night" className="bg-[#19161d]" size={16} />
              </button>
            </div>
          )}

          <input
            type="text"
            value={caption}
            onChange={(event) => setCaption(event.target.value)}
            placeholder="Add a caption (optional)"
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-night-900 placeholder:text-gray-400 focus:border-brand-900 focus:outline-none"
          />

          <button
            type="button"
            onClick={handlePost}
            className="flex h-11 w-full items-center justify-center rounded-lg bg-brand-900 text-sm font-medium text-white hover:bg-brand-900/90"
          >
            Share to Story
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
