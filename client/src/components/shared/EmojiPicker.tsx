"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import ReactEmojiPicker, { EmojiStyle, Theme } from "emoji-picker-react";
import { Tooltip } from "@/components/shared/Tooltip";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
  className?: string;
  align?: "start" | "center" | "end";
  side?: "top" | "bottom";
  /** Custom trigger content (e.g. an icon); defaults to a 🙂 emoji. */
  children?: ReactNode;
}

/** A trigger button that opens emoji-picker-react's picker panel, appending
 * the picked emoji into whatever text field it's paired with (callers own
 * the actual insertion via onSelect). Uses Apple-style emoji images so they
 * look modern and consistent everywhere, instead of relying on the OS's own
 * (often dated-looking) emoji font.
 *
 * On desktop the panel floats next to its trigger; on mobile it's portaled
 * to the body and pinned to the bottom of the screen (above any bottom
 * sheet), since a trigger-anchored popover overflows narrow viewports. */
export function EmojiPicker({ onSelect, className, align = "end", side = "top", children }: EmojiPickerProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const isMobile = useMediaQuery("(max-width: 639px)");

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (rootRef.current?.contains(target) || panelRef.current?.contains(target)) return;
      setOpen(false);
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  const picker = (
    <ReactEmojiPicker
      onEmojiClick={(data) => {
        onSelect(data.emoji);
        setOpen(false);
      }}
      emojiStyle={EmojiStyle.APPLE}
      theme={Theme.LIGHT}
      autoFocusSearch={false}
      skinTonesDisabled
      previewConfig={{ showPreview: false }}
      width="100%"
      height={isMobile ? 320 : 350}
    />
  );

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <Tooltip label="Emoji" align={align === "center" ? "center" : align}>
        <button
          type="button"
          aria-label="Add emoji"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className={cn("flex shrink-0 items-center justify-center text-base leading-none", !children && "size-[23px]")}
        >
          {children ?? "🙂"}
        </button>
      </Tooltip>

      {open &&
        (isMobile ? (
          createPortal(
            <div
              ref={panelRef}
              className="fixed inset-x-3 bottom-3 z-[140] overflow-hidden rounded-2xl shadow-[0px_12px_32px_-8px_rgba(0,0,0,0.3)]"
            >
              {picker}
            </div>,
            document.body,
          )
        ) : (
          <div
            ref={panelRef}
            className={cn(
              "absolute z-50 w-80",
              side === "top" ? "bottom-[calc(100%+8px)]" : "top-[calc(100%+8px)]",
              align === "start" ? "left-0" : align === "end" ? "right-0" : "left-1/2 -translate-x-1/2",
            )}
          >
            {picker}
          </div>
        ))}
    </div>
  );
}
