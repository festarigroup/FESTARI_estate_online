"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { createPortal } from "react-dom";

interface SideListMenuProps {
  open: boolean;
  onClose: () => void;
  anchorRef: RefObject<HTMLElement | null>;
  items: string[];
  onSelect: (item: string) => void;
}

export function SideListMenu({ open, onClose, anchorRef, items, onSelect }: SideListMenuProps) {
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);

  useEffect(() => {
    if (!open) return;

    function updatePosition() {
      const rect = anchorRef.current?.getBoundingClientRect();
      if (!rect) return;
      setPosition({ top: rect.top, left: rect.right + 8 });
    }

    updatePosition();
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [open, anchorRef]);

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (event: PointerEvent) => {
      if (menuRef.current?.contains(event.target as Node)) return;
      if (anchorRef.current?.contains(event.target as Node)) return;
      onClose();
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose, anchorRef]);

  if (!open || !position) return null;

  return createPortal(
    <div
      ref={menuRef}
      data-side-list-menu
      style={{ top: position.top, left: position.left }}
      className="fixed z-[120] flex w-[180px] flex-col gap-3 rounded-xl bg-white p-3 drop-shadow-[0px_4px_2px_rgba(0,0,0,0.28)]"
    >
      {items.map((item, index) => (
        <button
          key={`${item}-${index}`}
          type="button"
          onClick={() => onSelect(item)}
          className="flex h-6 w-full items-center text-left text-sm font-medium text-[#334154] hover:text-brand-900"
        >
          {item}
        </button>
      ))}
    </div>,
    document.body,
  );
}
