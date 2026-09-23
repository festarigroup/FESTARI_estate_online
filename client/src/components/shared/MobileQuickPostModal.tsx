"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { showErrorToast, showSuccessToast } from "@/components/shared/AppToast";
import { NavIcon } from "@/components/shared/NavIcon";
import { VisibilityMenu, DEFAULT_VISIBILITY, type PostVisibility } from "@/components/shared/VisibilityMenu";
import { cn } from "@/lib/utils";

const MEDIA_ACCEPT = ["image/png", "image/jpeg", "image/gif", "video/mp4", "video/quicktime", "video/webm"];

const TOOLBAR_ACTIONS = [
  { key: "italic", label: "Italic", glyph: "I", className: "italic" },
  { key: "bold", label: "Bold", glyph: "B", className: "font-bold" },
  { key: "h1", label: "Heading", glyph: "H", className: "font-bold" },
  { key: "link", label: "Link", glyph: null, className: "" },
  { key: "quote", label: "Quote", glyph: "”", className: "font-bold" },
  { key: "bullet", label: "Bullet list", glyph: "•", className: "" },
] as const;

const MAX_POLL_OPTIONS = 6;

export type QuickComposerMode = "post" | "article" | "poll";

interface MobileQuickPostModalProps {
  open: boolean;
  onClose: () => void;
  initialMode?: QuickComposerMode;
}

export function MobileQuickPostModal({ open, onClose, initialMode = "post" }: MobileQuickPostModalProps) {
  const [mode, setMode] = useState<QuickComposerMode>(initialMode);
  const [text, setText] = useState("");
  const [bodyEmpty, setBodyEmpty] = useState(true);
  const bodyRef = useRef<HTMLDivElement | null>(null);
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState<string[]>([]);
  const [addingOption, setAddingOption] = useState(false);
  const [newOption, setNewOption] = useState("");
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [optionOverlayCenter, setOptionOverlayCenter] = useState<{ top: number; left: number } | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const previews = useMemo(
    () => files.map((file) => ({ url: URL.createObjectURL(file), isVideo: file.type.startsWith("video/") })),
    [files],
  );
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [visibilityOpen, setVisibilityOpen] = useState(false);
  const [visibility, setVisibility] = useState<PostVisibility>(DEFAULT_VISIBILITY);
  const visibilityTriggerRef = useRef<HTMLButtonElement | null>(null);

  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) setMode(initialMode);
  }

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (addingOption) {
        setAddingOption(false);
        return;
      }
      handleClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, addingOption]);

  useEffect(() => {
    return () => previews.forEach((preview) => URL.revokeObjectURL(preview.url));
  }, [previews]);

  if (!open) return null;

  const pollReady = pollQuestion.trim().length > 0 && pollOptions.filter((option) => option.trim()).length >= 2;

  function resetState() {
    setText("");
    if (bodyRef.current) bodyRef.current.innerHTML = "";
    setBodyEmpty(true);
    setPollQuestion("");
    setPollOptions([]);
    setAddingOption(false);
    setNewOption("");
    setFiles([]);
    setVisibility(DEFAULT_VISIBILITY);
    setVisibilityOpen(false);
  }

  function openAddOption() {
    const rect = cardRef.current?.getBoundingClientRect();
    if (rect) setOptionOverlayCenter({ top: rect.top + rect.height / 2, left: rect.left + rect.width / 2 });
    setNewOption("");
    setAddingOption(true);
  }

  function confirmAddOption() {
    const value = newOption.trim();
    if (value) setPollOptions((current) => [...current, value]);
    setNewOption("");
    if (pollOptions.length + 1 >= MAX_POLL_OPTIONS) setAddingOption(false);
  }

  function removePollOption(index: number) {
    setPollOptions((current) => current.filter((_, i) => i !== index));
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

  function handleBodyInput() {
    setBodyEmpty((bodyRef.current?.textContent?.trim().length ?? 0) === 0);
  }

  function applyFormat(command: string, value?: string) {
    bodyRef.current?.focus();
    document.execCommand(command, false, value);
    handleBodyInput();
  }

  function handleToolbarAction(key: (typeof TOOLBAR_ACTIONS)[number]["key"]) {
    switch (key) {
      case "italic":
        return applyFormat("italic");
      case "bold":
        return applyFormat("bold");
      case "h1":
        return applyFormat("formatBlock", "h1");
      case "quote":
        return applyFormat("formatBlock", "blockquote");
      case "bullet":
        return applyFormat("insertUnorderedList");
      case "link": {
        const selection = window.getSelection();
        if (!selection || selection.isCollapsed) {
          showErrorToast("Select some text first to turn it into a link");
          return;
        }
        return applyFormat("createLink", "https://");
      }
    }
  }

  function handlePost() {
    if (mode === "poll") {
      const filledOptions = pollOptions.map((option) => option.trim()).filter(Boolean);
      if (!pollQuestion.trim() || filledOptions.length < 2) {
        showErrorToast("Add a question and at least two options before posting");
        return;
      }
      showSuccessToast("Your poll has been shared");
      resetState();
      onClose();
      return;
    }

    const hasContent = mode === "article" ? !bodyEmpty || text.trim() : text.trim() || files.length > 0;
    if (!hasContent) {
      showErrorToast(mode === "article" ? "Add a headline or some content before posting" : "Add a caption or a file before posting");
      return;
    }
    showSuccessToast(mode === "article" ? "Your article has been shared" : "Your post has been shared");
    resetState();
    onClose();
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-label={mode === "article" ? "Create an article" : mode === "poll" ? "Create a poll" : "Create a post"}
    >
      <div
        ref={cardRef}
        onClick={(event) => event.stopPropagation()}
        className={cn(
          "flex w-full max-w-[340px] flex-col gap-3 overflow-y-auto rounded-[36px] bg-white p-4 shadow-[0px_24px_48px_-12px_rgba(0,0,0,0.08),0px_8px_24px_-8px_rgba(0,0,0,0.04)]",
          (mode === "post" || mode === "poll") && "aspect-square",
        )}
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

        {mode === "poll" ? (
          <input
            value={pollQuestion}
            onChange={(event) => setPollQuestion(event.target.value)}
            placeholder="What’s your question?...."
            className="w-full text-sm leading-6 text-night-900 placeholder:text-gray-400 focus:outline-none"
          />
        ) : (
          <textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            rows={mode === "article" ? 2 : 3}
            placeholder="What’s happening twin? Write something down..."
            className="w-full resize-none text-sm leading-6 text-night-900 placeholder:text-gray-400 focus:outline-none"
          />
        )}

        {mode === "poll" && (
          <div className="flex w-full flex-col gap-2">
            {pollOptions.map((option, index) => (
              <button
                key={index}
                type="button"
                aria-label={`Remove option: ${option}`}
                onClick={() => removePollOption(index)}
                className="flex w-full items-center rounded-lg border border-gray-200 px-3 py-1.5 text-left hover:bg-gray-50"
              >
                <p className="w-full truncate text-sm text-night-900">{option}</p>
              </button>
            ))}
            <div className="flex w-full items-center justify-between">
              <p className="text-sm font-bold text-night-900">Options</p>
              <button
                type="button"
                aria-label="Add option"
                onClick={openAddOption}
                disabled={pollOptions.length >= MAX_POLL_OPTIONS}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                  className={cn("text-night-900", pollOptions.length >= MAX_POLL_OPTIONS && "opacity-30")}
                >
                  <path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {mode === "article" && (
          <>
            <div className="flex w-full items-center gap-3.5">
              {TOOLBAR_ACTIONS.map((action) =>
                action.key === "link" ? (
                  <button
                    key={action.key}
                    type="button"
                    aria-label={action.label}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => handleToolbarAction(action.key)}
                  >
                    <NavIcon icon="/icons/article-toolbar-link.svg" color="night" size={12} />
                  </button>
                ) : (
                  <button
                    key={action.key}
                    type="button"
                    aria-label={action.label}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => handleToolbarAction(action.key)}
                    className={cn("text-sm text-[#001f3f]", action.className)}
                  >
                    {action.glyph}
                  </button>
                ),
              )}
            </div>
            <div className="h-px w-full bg-gray-200" />
            <div className="relative w-full">
              {bodyEmpty && (
                <p className="pointer-events-none absolute left-0 top-0 text-sm text-[#cbd5e0]">
                  Start writing your insight, market trends, buyer guides, how-to advice…
                </p>
              )}
              <div
                ref={bodyRef}
                contentEditable
                onInput={handleBodyInput}
                role="textbox"
                aria-multiline="true"
                aria-label="Article body"
                className="min-h-[70px] w-full text-sm text-night-900 focus:outline-none [&_blockquote]:border-l-2 [&_blockquote]:border-gray-300 [&_blockquote]:pl-3 [&_blockquote]:text-gray-600 [&_h1]:text-lg [&_h1]:font-bold [&_ul]:list-disc [&_ul]:pl-5 [&_a]:text-brand-900 [&_a]:underline"
              />
            </div>
          </>
        )}

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

        <div className="mt-auto flex w-full items-center justify-between">
          <div className="flex items-center gap-3">
            <input
              ref={inputRef}
              type="file"
              multiple
              accept={MEDIA_ACCEPT.join(",")}
              className="hidden"
              onChange={(event) => addFiles(event.target.files)}
            />
            <button
              type="button"
              aria-label="Attach files"
              onClick={() => {
                setMode("post");
                inputRef.current?.click();
              }}
            >
              <NavIcon icon="/icons/article-toolbar-link.svg" color="brand" size={16} className="bg-[#337df2]" />
            </button>
            <button type="button" aria-label="Poll" onClick={() => setMode("poll")}>
              <NavIcon
                icon="/icons/chart-02.svg"
                color="brand"
                size={18}
                className={cn("bg-[#337df2]", mode === "poll" && "opacity-30")}
              />
            </button>
            <button
              type="button"
              aria-label="Article"
              onClick={() => setMode("article")}
            >
              <NavIcon
                icon="/icons/book-bookmark-01.svg"
                color="brand"
                size={18}
                className={cn("bg-[#337df2]", mode === "article" && "opacity-30")}
              />
            </button>
            <div className="h-4 w-px shrink-0 bg-gray-200" />
            <button
              ref={visibilityTriggerRef}
              type="button"
              aria-label="Post visibility"
              onClick={() => setVisibilityOpen((v) => !v)}
            >
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
              "flex h-8 items-center justify-center rounded-[13px] px-4 text-sm text-white",
              mode === "poll" && !pollReady ? "bg-[#86b3fb]" : "bg-brand-900 hover:bg-brand-900/90",
            )}
          >
            Post
          </button>
        </div>
      </div>

      {addingOption &&
        optionOverlayCenter &&
        createPortal(
          <div
            className="fixed inset-0 z-[130] bg-black/50"
            onClick={() => setAddingOption(false)}
            role="dialog"
            aria-modal="true"
            aria-label="Add poll option"
          >
            <div
              onClick={(event) => event.stopPropagation()}
              style={{ top: optionOverlayCenter.top, left: optionOverlayCenter.left }}
              className="fixed flex h-12 w-[calc(100%-2rem)] max-w-[276px] -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-2xl border border-gray-200 bg-white px-3 py-1.5 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]"
            >
              <input
                autoFocus
                value={newOption}
                onChange={(event) => setNewOption(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") confirmAddOption();
                }}
                placeholder={`Option ${pollOptions.length + 1}`}
                className="w-full flex-1 text-sm text-night-900 placeholder:text-night-900/70 focus:outline-none"
              />
              <button
                type="button"
                onClick={confirmAddOption}
                disabled={!newOption.trim()}
                className={cn("shrink-0 text-sm", newOption.trim() ? "text-brand-900" : "text-gray-300")}
              >
                Add
              </button>
            </div>
          </div>,
          document.body,
        )}
    </div>,
    document.body,
  );
}
