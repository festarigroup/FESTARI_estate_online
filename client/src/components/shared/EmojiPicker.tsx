"use client";

import { useEffect, useRef, useState } from "react";
import ReactEmojiPicker, { EmojiStyle, Theme } from "emoji-picker-react";
import { Tooltip } from "@/components/shared/Tooltip";
import { cn } from "@/lib/utils";

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
  className?: string;
  align?: "start" | "center" | "end";
  side?: "top" | "bottom";
}

/** A trigger button that opens emoji-picker-react's picker panel, appending
 * the picked emoji into whatever text field it's paired with (callers own
 * the actual insertion via onSelect). Uses Apple-style emoji images so they
 * look modern and consistent everywhere, instead of relying on the OS's own
 * (often dated-looking) emoji font. */
export function EmojiPicker({ onSelect, className, align = "end", side = "top" }: EmojiPickerProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (event: PointerEvent) => {
      if (rootRef.current?.contains(event.target as Node)) return;
      setOpen(false);
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <Tooltip label="Emoji" align={align === "center" ? "center" : align}>
        <button
          type="button"
          aria-label="Add emoji"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex size-[23px] shrink-0 items-center justify-center text-base leading-none"
        >
          🙂
        </button>
      </Tooltip>

      {open && (
        <div
          className={cn(
            "absolute z-50 w-[min(320px,calc(100vw-2.5rem))]",
            side === "top" ? "bottom-[calc(100%+8px)]" : "top-[calc(100%+8px)]",
            align === "start" ? "left-0" : align === "end" ? "right-0" : "left-1/2 -translate-x-1/2",
          )}
        >
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
            height={350}
          />
        </div>
      )}
    </div>
  );
}
