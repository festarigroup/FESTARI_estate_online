"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { showErrorToast, showSuccessToast } from "@/components/shared/AppToast";
import { NavIcon } from "@/components/shared/NavIcon";
import {
  DEFAULT_VISIBILITY,
  VisibilityMenu,
  getVisibilityLabel,
  type PostVisibility,
} from "@/components/shared/VisibilityMenu";
import { comingSoonHref } from "@/lib/coming-soon";
import { cn } from "@/lib/utils";

type SwitchablePostType = "image" | "video" | "poll" | "article";

const POST_TYPE_ROW: { key: SwitchablePostType; label: string; icon: string }[] = [
  { key: "image", label: "Image Post", icon: "/icons/image-01.svg" },
  { key: "video", label: "Video Post", icon: "/icons/video-01.svg" },
  { key: "poll", label: "Poll", icon: "/icons/chart-02.svg" },
  { key: "article", label: "Article", icon: "/icons/book-bookmark-01.svg" },
];

const TOOLBAR_ACTIONS = [
  { key: "italic", label: "Italic", glyph: "I", className: "italic" },
  { key: "bold", label: "Bold", glyph: "B", className: "font-bold" },
  { key: "h1", label: "Heading 1", glyph: "H", className: "font-bold" },
  { key: "link", label: "Link", glyph: null, className: "" },
  { key: "quote", label: "Quote", glyph: "”", className: "font-bold" },
  { key: "bullet", label: "Bullet list", glyph: "•", className: "" },
] as const;

interface CreateArticleModalProps {
  open: boolean;
  onClose: () => void;
  onSwitchType?: (type: "image" | "video" | "poll") => void;
}

export function CreateArticleModal({ open, onClose, onSwitchType }: CreateArticleModalProps) {
  const router = useRouter();
  const [headline, setHeadline] = useState("");
  const [bodyEmpty, setBodyEmpty] = useState(true);
  const bodyRef = useRef<HTMLDivElement | null>(null);
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

  if (!open) return null;

  function resetState() {
    setHeadline("");
    if (bodyRef.current) bodyRef.current.innerHTML = "";
    setBodyEmpty(true);
    setVisibility(DEFAULT_VISIBILITY);
    setVisibilityOpen(false);
  }

  function handleBodyInput() {
    setBodyEmpty((bodyRef.current?.textContent?.trim().length ?? 0) === 0);
  }

  function handleClose() {
    resetState();
    onClose();
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
    if (!headline.trim() && bodyEmpty) {
      showErrorToast("Add a headline or some content before posting");
      return;
    }
    showSuccessToast("Your article has been shared");
    resetState();
    onClose();
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-label="Create an article"
    >
      <div onClick={(event) => event.stopPropagation()} className="relative w-full max-w-[720px]">
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
          <p className="text-lg font-semibold leading-6 tracking-[-0.36px] text-[#111826]">Create an Article</p>

          <div className="flex w-full items-start gap-3">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#eef2ff] text-[13px] font-extrabold text-[#4f46e5]">
              SL
            </span>
            <textarea
              value={headline}
              onChange={(event) => setHeadline(event.target.value)}
              rows={2}
              placeholder="Start writing your insight — market trends, buyer guides, how-to advice…"
              className="min-h-[60px] w-full flex-1 resize-none rounded-lg px-3 py-3.5 text-base leading-6 text-night-900 placeholder:text-[#475568] focus:outline-none"
            />
          </div>

          <div className="flex w-full flex-col overflow-hidden rounded-lg border border-[#e2e8f0] bg-[#f1f5f9]">
            <div className="flex w-full items-center gap-3.5 px-4 py-2.5">
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
            <div className="relative w-full flex-1 border-t border-[#e2e8f0] bg-white">
              {bodyEmpty && (
                <p className="pointer-events-none absolute left-3 top-2 text-sm text-[#cbd5e0]">
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
                className="min-h-[110px] w-full px-3 py-2 text-sm text-night-900 focus:outline-none [&_blockquote]:border-l-2 [&_blockquote]:border-gray-300 [&_blockquote]:pl-3 [&_blockquote]:text-gray-600 [&_h1]:text-xl [&_h1]:font-bold [&_h2]:text-lg [&_h2]:font-bold [&_ul]:list-disc [&_ul]:pl-5 [&_a]:text-brand-900 [&_a]:underline"
              />
            </div>
          </div>

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

            <div className="h-px w-full bg-gray-200" />

            <div className="flex w-full items-center justify-between">
              <div className="flex items-center gap-3">
                {POST_TYPE_ROW.map((item) => {
                  const active = item.key === "article";
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
                      onClick={() =>
                        item.key === "image" || item.key === "video" || item.key === "poll"
                          ? onSwitchType?.(item.key)
                          : router.push(comingSoonHref(item.label))
                      }
                    >
                      <NavIcon icon={item.icon} color="brand" size={18} className="bg-[#337df2]" />
                    </button>
                  );
                })}
              </div>
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
    </div>,
    document.body,
  );
}
