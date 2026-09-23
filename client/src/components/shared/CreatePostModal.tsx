"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState, type DragEvent } from "react";
import { createPortal } from "react-dom";
import { showErrorToast, showSuccessToast } from "@/components/shared/AppToast";
import { NavIcon } from "@/components/shared/NavIcon";
import { VISIBILITY_LABEL, VisibilityMenu, type PostVisibility } from "@/components/shared/VisibilityMenu";
import { cn } from "@/lib/utils";

type PostType = "image" | "video";

const TYPE_META: Record<PostType, { accept: string[]; helper: string; errorMessage: string }> = {
  image: {
    accept: ["image/png", "image/jpeg", "image/gif"],
    helper: "PNG, JPEG, GIF",
    errorMessage: "Only PNG, JPEG or GIF files are supported",
  },
  video: {
    accept: ["video/mp4", "video/quicktime", "video/webm"],
    helper: "MP4, MOV, WEBM",
    errorMessage: "Only MP4, MOV or WEBM files are supported",
  },
};

const MEDIA_ACCEPT = [...TYPE_META.image.accept, ...TYPE_META.video.accept];

const POST_TYPE_ROW: { key: PostType | "poll" | "article"; label: string; icon: string }[] = [
  { key: "image", label: "Image Post", icon: "/icons/image-01.svg" },
  { key: "video", label: "Video Post", icon: "/icons/video-01.svg" },
  { key: "poll", label: "Poll", icon: "/icons/chart-02.svg" },
  { key: "article", label: "Article", icon: "/icons/book-bookmark-01.svg" },
];

interface CreatePostModalProps {
  open: boolean;
  onClose: () => void;
  initialType?: PostType;
  onSwitchType?: (type: "image" | "video" | "poll" | "article") => void;
}

export function CreatePostModal({ open, onClose, initialType = "image", onSwitchType }: CreatePostModalProps) {
  const [postType, setPostType] = useState<PostType>(initialType);
  const [text, setText] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const previews = useMemo(
    () => files.map((file) => ({ url: URL.createObjectURL(file), isVideo: file.type.startsWith("video/") })),
    [files],
  );
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const wordCount = useMemo(() => (text.trim() ? text.trim().split(/\s+/).length : 0), [text]);
  const [visibilityOpen, setVisibilityOpen] = useState(false);
  const [visibility, setVisibility] = useState<PostVisibility>("everyone");
  const visibilityTriggerRef = useRef<HTMLButtonElement | null>(null);

  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open && postType !== initialType) setPostType(initialType);
  }

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

  const typeMeta = TYPE_META[postType];

  function addFiles(list: FileList | null) {
    if (!list) return;
    const next = Array.from(list).filter((file) => MEDIA_ACCEPT.includes(file.type));
    if (next.length === 0 && list.length > 0) {
      showErrorToast("Only PNG, JPEG, GIF, MP4, MOV or WEBM files are supported");
      return;
    }
    setFiles((current) => [...current, ...next]);
  }

  function switchType(next: PostType) {
    setPostType(next);
    setFiles([]);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragActive(false);
    addFiles(event.dataTransfer.files);
  }

  function removeFile(index: number) {
    setFiles((current) => current.filter((_, i) => i !== index));
  }

  function resetState() {
    setText("");
    setFiles([]);
    setVisibility("everyone");
    setVisibilityOpen(false);
  }

  function handleClose() {
    resetState();
    onClose();
  }

  function handlePost() {
    if (!text.trim() && files.length === 0) {
      showErrorToast(`Add a caption or a ${postType} before posting`);
      return;
    }
    showSuccessToast("Your post has been shared");
    resetState();
    onClose();
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-label="Create a post"
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="relative w-full max-w-[720px]"
      >
        <button
          type="button"
          aria-label="Close"
          onClick={handleClose}
          className="absolute -right-3 -top-3 z-10 flex size-7 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-md hover:bg-gray-50"
        >
          <svg width="9" height="9" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M1 1L11 11M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        <div className="flex max-h-[90vh] w-full flex-col gap-6 overflow-y-auto rounded-2xl bg-white/95 p-6 shadow-[0px_24px_60px_-15px_rgba(0,0,0,0.15)] backdrop-blur-[8px]">
        <p className="text-lg font-semibold leading-6 tracking-[-0.36px] text-[#111826]">Create a Post</p>

        <div className="flex w-full items-start gap-3">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#eef2ff] text-[13px] font-extrabold text-[#4f46e5]">
            SL
          </span>
          <textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            rows={2}
            placeholder="What’s happening twin? Write something down..."
            className="min-h-[80px] w-full flex-1 resize-none rounded-lg px-3 py-3.5 text-base leading-6 text-night-900 placeholder:text-[#475568] focus:outline-none"
          />
        </div>

        <input
          ref={inputRef}
          type="file"
          multiple
          accept={MEDIA_ACCEPT.join(",")}
          className="hidden"
          onChange={(event) => addFiles(event.target.files)}
        />

        {previews.length === 0 ? (
          <div className="flex w-full flex-col gap-1">
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
                "flex min-h-[120px] w-full cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed px-6 py-6 text-center",
                dragActive ? "border-brand-900 bg-brand-900/5" : "border-[#cbd5e0] bg-[#cbd5e0]/30",
              )}
            >
              <p className="text-xs text-[#19161d]">Drag and drop files here</p>
              <p className="text-xs text-[#86888a]">or</p>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  inputRef.current?.click();
                }}
                className="flex h-6 items-center justify-center gap-1.5 rounded-[40px] bg-[#19161d] px-2 text-xs text-white"
              >
                Choose files
                <NavIcon icon="/icons/create-menu-upload-arrow.svg" color="white" size={14} />
              </button>
            </div>
            <p className="w-full text-xs text-[#53575a]">{typeMeta.helper}</p>
          </div>
        ) : (
          <div className="flex w-full flex-wrap gap-2.5 px-2">
            {previews.map((preview, index) => (
              <div
                key={preview.url}
                className="relative h-[61px] w-[97px] shrink-0 overflow-hidden rounded-md bg-gray-100"
              >
                {preview.isVideo ? (
                  <video src={preview.url} className="size-full object-cover" muted />
                ) : (
                  <Image src={preview.url} alt="" fill className="object-cover" sizes="97px" />
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

        <div className="flex w-full flex-col gap-4">
          <button
            ref={visibilityTriggerRef}
            type="button"
            onClick={() => setVisibilityOpen((v) => !v)}
            aria-expanded={visibilityOpen}
            className="flex w-full items-center gap-2.5 px-2"
          >
            <NavIcon icon="/icons/create-menu-globe-visibility.svg" color="brand" size={24} className="bg-[#337df2]" />
            <span className="text-[14.6px] font-semibold text-[#337df2]">{VISIBILITY_LABEL[visibility]}</span>
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

          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-3">
              {POST_TYPE_ROW.map((item) => {
                const active = item.key === postType;
                if (active) {
                  return (
                    <NavIcon
                      key={item.key}
                      icon={item.icon}
                      color="brand"
                      size={18}
                      className="bg-[#337df2] opacity-30"
                    />
                  );
                }
                return (
                  <button
                    key={item.key}
                    type="button"
                    aria-label={item.label}
                    onClick={() => {
                      if (item.key === "image" || item.key === "video") {
                        switchType(item.key);
                      } else {
                        onSwitchType?.(item.key);
                      }
                    }}
                  >
                    <NavIcon icon={item.icon} color="brand" size={18} className="bg-[#337df2]" />
                  </button>
                );
              })}
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                <NavIcon icon="/icons/poll-in-progress.svg" color="brand" size={16} className="bg-[#1465e6]" />
                <span className="whitespace-nowrap text-sm text-[#1465e6]">{wordCount} words</span>
              </div>
              <div className="h-[22px] w-px shrink-0 bg-gray-200" />
              <button type="button" aria-label="Add more files" onClick={() => inputRef.current?.click()}>
                <NavIcon icon="/icons/poll-add-alt.svg" color="brand" size={16} className="bg-[#1465e6]" />
              </button>
              <button
                type="button"
                onClick={handlePost}
                className="flex h-8 items-center justify-center rounded-lg bg-brand-900 px-3 text-sm text-white hover:bg-brand-900/90"
              >
                Post
              </button>
            </div>
          </div>

          <div className="h-px w-full bg-gray-200" />
        </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
