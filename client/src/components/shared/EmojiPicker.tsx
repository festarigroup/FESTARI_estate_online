"use client";

import { useEffect, useRef, useState } from "react";
import { Tooltip } from "@/components/shared/Tooltip";
import { cn } from "@/lib/utils";

const EMOJI_GROUPS: { label: string; emojis: string[] }[] = [
  {
    label: "Smileys",
    emojis: [
      "😀", "😁", "😂", "🤣", "😊", "😇", "🙂", "😉", "😍", "🥰",
      "😘", "😎", "🤩", "🥳", "🤔", "🙄", "😴", "😢", "😭", "😡",
    ],
  },
  {
    label: "Gestures",
    emojis: [
      "👍", "👎", "👏", "🙌", "🙏", "🤝", "👋", "💪", "✌️", "🤞",
    ],
  },
  {
    label: "Hearts",
    emojis: [
      "❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "💯", "🔥",
    ],
  },
  {
    label: "Objects",
    emojis: [
      "🏠", "🏢", "🔑", "📸", "📍", "✅", "⭐", "🎉", "💰", "📈",
    ],
  },
];

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
  className?: string;
  align?: "start" | "center" | "end";
}

/** A trigger button that opens a small emoji grid, appending the picked
 * emoji into whatever text field it's paired with (callers own the actual
 * insertion via onSelect). Self-contained, no external emoji dependency. */
export function EmojiPicker({ onSelect, className, align = "end" }: EmojiPickerProps) {
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
            "no-scrollbar absolute bottom-[calc(100%+8px)] z-50 flex max-h-[220px] w-[240px] flex-col gap-2 overflow-y-auto rounded-xl border border-gray-200 bg-white p-3 shadow-lg",
            align === "start" ? "left-0" : align === "end" ? "right-0" : "left-1/2 -translate-x-1/2",
          )}
        >
          {EMOJI_GROUPS.map((group) => (
            <div key={group.label} className="flex flex-col gap-1">
              <p className="text-[10px] font-semibold uppercase text-gray-400">{group.label}</p>
              <div className="flex flex-wrap gap-1">
                {group.emojis.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    aria-label={emoji}
                    onClick={() => {
                      onSelect(emoji);
                      setOpen(false);
                    }}
                    className="flex size-7 items-center justify-center rounded-md text-lg hover:bg-gray-100"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
