"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { showErrorToast, showSuccessToast } from "@/components/shared/AppToast";
import { NavIcon } from "@/components/shared/NavIcon";
import {
  DEFAULT_VISIBILITY,
  VisibilityMenu,
  getVisibilityLabel,
  type PostVisibility,
} from "@/components/shared/VisibilityMenu";
import { usePostsFeed } from "@/context/PostsContext";
import { cn } from "@/lib/utils";

const DURATION_OPTIONS = ["1 day", "3 days", "1 week", "2 weeks", "1 month"];
const MIN_OPTIONS = 2;
const MAX_OPTIONS = 6;
const MEDIA_ACCEPT = ["image/png", "image/jpeg", "image/gif", "video/mp4", "video/quicktime", "video/webm"];

interface CreatePollModalProps {
  open: boolean;
  onClose: () => void;
  onSwitchType?: (type: "image" | "video" | "poll" | "article") => void;
}

export function CreatePollModal({ open, onClose, onSwitchType }: CreatePollModalProps) {
  const { addPost } = usePostsFeed();
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<string[]>(["", ""]);
  const [duration, setDuration] = useState(DURATION_OPTIONS[0]);
  const [files, setFiles] = useState<File[]>([]);
  const previews = useMemo(
    () => files.map((file) => ({ url: URL.createObjectURL(file), isVideo: file.type.startsWith("video/") })),
    [files],
  );
  const inputRef = useRef<HTMLInputElement | null>(null);
  const wordCount = useMemo(() => (question.trim() ? question.trim().split(/\s+/).length : 0), [question]);
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
    setQuestion("");
    setOptions(["", ""]);
    setDuration(DURATION_OPTIONS[0]);
    setFiles([]);
    setVisibility(DEFAULT_VISIBILITY);
    setVisibilityOpen(false);
  }

  function handleClose() {
    resetState();
    onClose();
  }

  function withTrailingSlot(list: string[]) {
    const allFilled = list.every((option) => option.trim().length > 0);
    return allFilled && list.length < MAX_OPTIONS ? [...list, ""] : list;
  }

  function updateOption(index: number, value: string) {
    setOptions((current) => withTrailingSlot(current.map((option, i) => (i === index ? value : option))));
  }

  function removeOption(index: number) {
    setOptions((current) => {
      const next = current.filter((_, i) => i !== index);
      const padded =
        next.length < MIN_OPTIONS ? [...next, ...Array(MIN_OPTIONS - next.length).fill("")] : next;
      return withTrailingSlot(padded);
    });
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
    const filledOptions = options.map((option) => option.trim()).filter(Boolean);
    if (!question.trim() || filledOptions.length < MIN_OPTIONS) {
      showErrorToast("Add a question and at least two options before posting");
      return;
    }
    addPost({ kind: "poll", question, options });
    showSuccessToast("Your poll has been shared");
    resetState();
    onClose();
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-label="Create a poll"
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

        <div className="flex w-full flex-col gap-2.5 rounded-2xl border border-gray-200 p-4">
          <div className="flex w-full items-start gap-3">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#eef2ff] text-[13px] font-extrabold text-[#4f46e5]">
              SL
            </span>
            <textarea
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              rows={1}
              placeholder="What’s your question?"
              className="w-full flex-1 resize-none self-center rounded-lg px-3 py-3.5 text-base leading-6 text-night-900 placeholder:text-[#475568] focus:outline-none"
            />
            <button
              type="button"
              aria-label="Close poll"
              onClick={handleClose}
              className="mt-3 shrink-0 text-gray-400 hover:text-gray-600"
            >
              <NavIcon icon="/icons/poll-close-outline.svg" color="night" size={16} />
            </button>
          </div>

          <div className="flex w-full flex-col gap-2.5 px-6">
            {options.map((option, index) => {
              const filled = option.trim().length > 0;
              const required = index < MIN_OPTIONS;
              const active = required || filled;
              return (
              <div
                key={index}
                className={cn(
                  "flex h-12 w-full items-center gap-2 rounded-lg border px-3",
                  active ? "border-gray-200 bg-white" : "border-dashed border-gray-200 bg-gray-50/60",
                )}
              >
                <input
                  value={option}
                  onChange={(event) => updateOption(index, event.target.value)}
                  placeholder={`Option ${index + 1}`}
                  className={cn(
                    "w-full flex-1 text-sm focus:outline-none",
                    active ? "text-night-900 placeholder:text-night-900/70" : "text-gray-400 placeholder:text-gray-400",
                  )}
                />
                {!required && filled && (
                  <button
                    type="button"
                    aria-label={`Remove option ${index + 1}`}
                    onClick={() => removeOption(index)}
                    className="shrink-0"
                  >
                    <NavIcon icon="/icons/poll-trash-delete.svg" color="night" size={16} className="bg-red-500" />
                  </button>
                )}
              </div>
              );
            })}
          </div>

          <div className="flex w-full flex-col gap-1">
            <p className="text-sm text-[#111826]">
              Poll Duration<span className="text-red-500">*</span>
            </p>
            <div className="relative flex h-12 w-full items-center rounded-lg border border-[#cbd5e0] bg-white px-3">
              <select
                value={duration}
                onChange={(event) => setDuration(event.target.value)}
                className="w-full flex-1 appearance-none bg-transparent text-sm text-[#0f1621] focus:outline-none"
              >
                {DURATION_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <NavIcon icon="/icons/poll-chevron-down.svg" color="night" size={16} className="pointer-events-none shrink-0" />
            </div>
          </div>
        </div>

        {previews.length > 0 && (
          <div className="flex w-full flex-wrap gap-2 px-2">
            {previews.map((preview, index) => (
              <div key={preview.url} className="relative h-[61px] w-[97px] shrink-0 overflow-hidden rounded-md bg-gray-100">
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
            <span className="text-[14.6px] font-semibold text-[#337df2]">{getVisibilityLabel(visibility)}</span>
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
              <input
                ref={inputRef}
                type="file"
                multiple
                accept={MEDIA_ACCEPT.join(",")}
                className="hidden"
                onChange={(event) => addFiles(event.target.files)}
              />
              <button type="button" aria-label="Image Post" onClick={() => onSwitchType?.("image")}>
                <NavIcon icon="/icons/image-01.svg" color="brand" size={18} className="bg-[#337df2]" />
              </button>
              <button type="button" aria-label="Video Post" onClick={() => onSwitchType?.("video")}>
                <NavIcon icon="/icons/video-01.svg" color="brand" size={18} className="bg-[#337df2]" />
              </button>
              <NavIcon icon="/icons/chart-02.svg" color="brand" size={18} className="bg-[#337df2] opacity-30" />
              <button type="button" aria-label="Article" onClick={() => onSwitchType?.("article")}>
                <NavIcon icon="/icons/book-bookmark-01.svg" color="brand" size={18} className="bg-[#337df2]" />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                <NavIcon icon="/icons/poll-in-progress.svg" color="brand" size={16} className="bg-[#1465e6]" />
                <span className="whitespace-nowrap text-sm text-[#1465e6]">{wordCount} words</span>
              </div>
              <div className="h-[22px] w-px shrink-0 bg-gray-200" />
              <button type="button" aria-label="Attach image or video" onClick={() => inputRef.current?.click()}>
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
        </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
