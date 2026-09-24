"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { NavIcon } from "@/components/shared/NavIcon";
import { cn } from "@/lib/utils";

export const DURATION_OPTIONS = ["1 day", "3 days", "A week", "A month"];

interface PollDurationDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options?: string[];
}

/** Poll-duration picker (Figma node 480:69019) — a floating menu anchored to
 * its trigger, so it sizes to whatever width the trigger is given and works
 * the same way on both the desktop and mobile composers. */
export function PollDurationDropdown({ value, onChange, options = DURATION_OPTIONS }: PollDurationDropdownProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState<{ top: number; left: number; width: number } | null>(null);

  useEffect(() => {
    if (!open) return;
    function updatePosition() {
      const rect = triggerRef.current?.getBoundingClientRect();
      if (!rect) return;
      setPosition({ top: rect.bottom + 4, left: rect.left, width: rect.width });
    }
    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (triggerRef.current?.contains(target) || panelRef.current?.contains(target)) return;
      setOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="relative flex h-12 w-full items-center justify-between rounded-lg border border-[#cbd5e0] bg-white px-3 text-left text-sm text-[#0f1621]"
      >
        <span>{value}</span>
        <NavIcon
          icon="/icons/poll-chevron-down.svg"
          color="night"
          size={16}
          className={cn("shrink-0 transition-transform duration-150", open && "rotate-180")}
        />
      </button>

      {open &&
        position &&
        createPortal(
          <div
            ref={panelRef}
            style={{ top: position.top, left: position.left, width: position.width }}
            className="fixed z-[120] flex flex-col gap-1 rounded-lg border border-[#cbd5e0] bg-white p-1 shadow-[0px_0px_24px_0px_rgba(0,0,0,0.08)]"
          >
            {options.map((option) => {
              const selected = option === value;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    onChange(option);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center justify-between rounded p-1 text-sm text-[#0f1621]",
                    selected && "bg-[#f8fafc]",
                  )}
                >
                  <span>{option}</span>
                  {selected && <NavIcon icon="/icons/poll-duration-check.svg" color="night" size={12} />}
                </button>
              );
            })}
          </div>,
          document.body,
        )}
    </>
  );
}
