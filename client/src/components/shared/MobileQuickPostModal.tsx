"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { showErrorToast, showSuccessToast } from "@/components/shared/AppToast";
import { NavIcon } from "@/components/shared/NavIcon";
import { VisibilityMenu, DEFAULT_VISIBILITY, type PostVisibility } from "@/components/shared/VisibilityMenu";
import { cn } from "@/lib/utils";

const MEDIA_ACCEPT = ["image/png", "image/jpeg", "image/gif", "video/mp4", "video/quicktime", "video/webm"];

interface MobileQuickPostModalProps {
  open: boolean;
  onClose: () => void;
  onSwitchType?: (type: "poll" | "article") => void;
}

export function MobileQuickPostModal({ open, onClose, onSwitchType }: MobileQuickPostModalProps) {
  const [text, setText] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const previews = useMemo(
    () => files.map((file) => ({ url: URL.createObjectURL(file), isVideo: file.type.startsWith("video/") })),
    [files],
  );
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [visibilityOpen, setVisibilityOpen] = useState(false);
  const [visibility, setVisibility] = useState<PostVisibility>(DEFAULT_VISIBILITY);
  const visibilityTriggerRef = useRef<HTMLButtonElement | null>(null);

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

  useEffect(() => {
    return () => previews.forEach((preview) => URL.revokeObjectURL(preview.url));
  }, [previews]);

  if (!open) return null;

  function resetState() {
    setText("");
    setFiles([]);
    setVisibility(DEFAULT_VISIBILITY);
    setVisibilityOpen(false);
  }

  function handleClose() {
    resetState();
    onClose();
  }

  function addFiles(list: FileList | null) {
    if (!list) return;
    const next = Array.from(list).filter((file) => MEDIA_ACCEPT.includes(file.type));
    if (next.length === 0 && list.length > 0) {
      showErrorToast("Only PNG, JPEG, GIF, MP4, MOV or WEBM files are supported");
      return;
    }
    setFiles((current) => [...current, ...next]);
  }

  function removeFile(index: number) {
    setFiles((current) => current.filter((_, i) => i !== index));
  }

  function handlePost() {
    if (!text.trim() && files.length === 0) {
      showErrorToast("Add a caption or a file before posting");
      return;
    }
    showSuccessToast("Your post has been shared");
    resetState();
    onClose();
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center bg-black/50 p-4 pt-20"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-label="Create a post"
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="flex w-full max-w-[340px] flex-col gap-3 rounded-[36px] bg-white p-4 shadow-[0px_24px_48px_-12px_rgba(0,0,0,0.08),0px_8px_24px_-8px_rgba(0,0,0,0.04)]"
      >
        <div className="flex w-full items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <span className="relative block size-12 shrink-0">
              <span className="relative block size-full overflow-hidden rounded-full bg-[#eef2ff]">
                <Image src="/icons/avatar-sample.jpg" alt="" fill className="object-cover" sizes="48px" />
              </span>
              <span className="absolute -bottom-0.5 -right-0.5 block size-[17px]">
                <Image src="/icons/avatar-verified-badge-green.svg" alt="" fill sizes="17px" />
              </span>
            </span>
            <div className="flex flex-col">
              <p className="text-[15px] font-bold text-night-900">Madeline Price</p>
              <p className="text-xs text-gray-500">Researcher</p>
            </div>
          </div>
          <button type="button" aria-label="Close" onClick={handleClose} className="mt-1 shrink-0 text-gray-400">
            <svg width="14" height="14" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M1 1L11 11M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          rows={3}
          placeholder="What’s happening twin? Write something down..."
          className="w-full resize-none text-sm leading-6 text-night-900 placeholder:text-gray-400 focus:outline-none"
        />

        {previews.length > 0 && (
          <div className="flex w-full flex-wrap gap-2">
            {previews.map((preview, index) => (
              <div key={preview.url} className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                {preview.isVideo ? (
                  <video src={preview.url} className="size-full object-cover" muted />
                ) : (
                  <Image src={preview.url} alt="" fill className="object-cover" sizes="64px" />
                )}
                <button
                  type="button"
                  aria-label="Remove file"
                  onClick={() => removeFile(index)}
                  className="absolute left-1 top-1 flex size-4 items-center justify-center rounded-full bg-white text-[10px] leading-none text-night-900"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-3">
            <input
              ref={inputRef}
              type="file"
              multiple
              accept={MEDIA_ACCEPT.join(",")}
              className="hidden"
              onChange={(event) => addFiles(event.target.files)}
            />
            <button type="button" aria-label="Attach files" onClick={() => inputRef.current?.click()}>
              <NavIcon icon="/icons/article-toolbar-link.svg" color="brand" size={16} className="bg-[#337df2]" />
            </button>
            <button type="button" aria-label="Poll" onClick={() => onSwitchType?.("poll")}>
              <NavIcon icon="/icons/chart-02.svg" color="brand" size={18} className="bg-[#337df2]" />
            </button>
            <button type="button" aria-label="Article" onClick={() => onSwitchType?.("article")}>
              <NavIcon icon="/icons/book-bookmark-01.svg" color="brand" size={18} className="bg-[#337df2]" />
            </button>
            <div className="h-4 w-px shrink-0 bg-gray-200" />
            <button ref={visibilityTriggerRef} type="button" aria-label="Post visibility" onClick={() => setVisibilityOpen((v) => !v)}>
              <NavIcon icon="/icons/create-menu-globe-visibility.svg" color="brand" size={20} className="bg-[#337df2]" />
            </button>
            <VisibilityMenu
              open={visibilityOpen}
              onClose={() => setVisibilityOpen(false)}
              value={visibility}
              onChange={(next) => {
                setVisibility(next);
                setVisibilityOpen(false);
              }}
              anchorRef={visibilityTriggerRef}
            />
          </div>
          <button
            type="button"
            onClick={handlePost}
            className={cn(
              "flex h-8 items-center justify-center rounded-lg bg-brand-900 px-4 text-sm text-white hover:bg-brand-900/90",
            )}
          >
            Post
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
