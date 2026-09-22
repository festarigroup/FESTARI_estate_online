"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type DragEvent } from "react";
import { createPortal } from "react-dom";
import { showErrorToast, showSuccessToast } from "@/components/shared/AppToast";
import { NavIcon } from "@/components/shared/NavIcon";
import { comingSoonHref } from "@/lib/coming-soon";
import { cn } from "@/lib/utils";

const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/gif"];

const OTHER_POST_TYPES = [
  { key: "video", label: "Video Post", icon: "/icons/video-01.svg" },
  { key: "poll", label: "Poll", icon: "/icons/chart-02.svg" },
  { key: "article", label: "Article", icon: "/icons/book-bookmark-01.svg" },
];

interface CreatePostModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreatePostModal({ open, onClose }: CreatePostModalProps) {
  const router = useRouter();
  const [text, setText] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const previews = useMemo(() => files.map((file) => URL.createObjectURL(file)), [files]);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

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
    return () => previews.forEach((url) => URL.revokeObjectURL(url));
  }, [previews]);

  if (!open) return null;

  function addFiles(list: FileList | null) {
    if (!list) return;
    const next = Array.from(list).filter((file) => ACCEPTED_TYPES.includes(file.type));
    if (next.length === 0 && list.length > 0) {
      showErrorToast("Only PNG, JPEG or GIF files are supported");
      return;
    }
    setFiles((current) => [...current, ...next]);
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
  }

  function handleClose() {
    resetState();
    onClose();
  }

  function handlePost() {
    if (!text.trim() && files.length === 0) {
      showErrorToast("Add a caption or an image before posting");
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
        className="flex max-h-[90vh] w-full max-w-[560px] flex-col gap-6 overflow-y-auto rounded-2xl bg-white/95 p-6 shadow-[0px_24px_60px_-15px_rgba(0,0,0,0.15)] backdrop-blur-[8px]"
      >
        <div className="flex w-full items-center justify-between">
          <p className="text-2xl font-semibold leading-8 tracking-[-0.72px] text-[#111826]">Create a Post</p>
          <button
            type="button"
            aria-label="Close"
            onClick={handleClose}
            className="flex size-8 shrink-0 items-center justify-center rounded-full text-xl leading-none text-gray-500 hover:bg-gray-100"
          >
            &times;
          </button>
        </div>

        <div className="flex w-full items-start gap-3">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#eef2ff] text-[13px] font-extrabold text-[#4f46e5]">
            SL
          </span>
          <textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            rows={2}
            placeholder="What’s happening twin? Write somn down..."
            className="min-h-[80px] w-full flex-1 resize-none rounded-lg px-3 py-3.5 text-base leading-6 text-night-900 placeholder:text-[#475568] focus:outline-none"
          />
        </div>

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
              dragActive ? "border-brand-900 bg-brand-900/5" : "border-[#cbd5e0] bg-[#f8fafc]",
            )}
          >
            <input
              ref={inputRef}
              type="file"
              multiple
              accept={ACCEPTED_TYPES.join(",")}
              className="hidden"
              onChange={(event) => addFiles(event.target.files)}
            />
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
          <p className="w-full text-xs text-[#53575a]">PNG, JPEG, GIF</p>
        </div>

        {previews.length > 0 && (
          <div className="flex w-full flex-wrap gap-2">
            {previews.map((src, index) => (
              <div key={src} className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                <Image src={src} alt="" fill className="object-cover" sizes="64px" />
                <button
                  type="button"
                  aria-label="Remove file"
                  onClick={() => removeFile(index)}
                  className="absolute right-1 top-1 flex size-4 items-center justify-center rounded-full bg-black/60 text-[10px] leading-none text-white"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex w-full flex-col gap-4">
          <button
            type="button"
            onClick={() => router.push(comingSoonHref("Post visibility"))}
            className="flex w-full items-center gap-2.5 px-2"
          >
            <NavIcon icon="/icons/create-menu-globe-visibility.svg" color="brand" size={24} className="bg-[#337df2]" />
            <span className="text-[14.6px] font-semibold text-[#337df2]">Everyone can view</span>
          </button>

          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-3">
              <NavIcon icon="/icons/image-01.svg" color="brand" size={24} className="bg-[#337df2] opacity-30" />
              {OTHER_POST_TYPES.map((type) => (
                <button
                  key={type.key}
                  type="button"
                  aria-label={type.label}
                  onClick={() => router.push(comingSoonHref(type.label))}
                >
                  <NavIcon icon={type.icon} color="night" size={24} />
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={handlePost}
              className="flex h-8 items-center justify-center rounded-lg bg-brand-900 px-3 text-sm text-white hover:bg-brand-900/90"
            >
              Post
            </button>
          </div>

          <div className="h-px w-full bg-gray-200" />
        </div>
      </div>
    </div>,
    document.body,
  );
}
