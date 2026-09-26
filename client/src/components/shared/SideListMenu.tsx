"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { createPortal } from "react-dom";
import { NavIcon } from "@/components/shared/NavIcon";

interface SideListMenuProps {
  open: boolean;
  onClose: () => void;
  anchorRef: RefObject<HTMLElement | null>;
  items: string[];
  /** Single-select: fires once and the caller closes the menu. */
  onSelect?: (item: string) => void;
  /** Multi-select: header with a title, a search toggle, and checkmarks for each selected item. */
  multiple?: boolean;
  searchable?: boolean;
  title?: string;
  selected?: string[];
  onToggle?: (item: string) => void;
  /** Leading icon shown before every row (e.g. the organization logo glyph). */
  icon?: string;
}

export function SideListMenu({
  open,
  onClose,
  anchorRef,
  items,
  onSelect,
  multiple = false,
  searchable = false,
  title,
  selected = [],
  onToggle,
  icon,
}: SideListMenuProps) {
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

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

  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (!open) {
      setSearchOpen(false);
      setQuery("");
    }
  }

  if (!open || !position) return null;

  const filteredItems = query.trim()
    ? items.filter((item) => item.toLowerCase().includes(query.trim().toLowerCase()))
    : items;

  return createPortal(
    <div
      ref={menuRef}
      data-side-list-menu
      style={{ top: position.top, left: position.left }}
      className="fixed z-[120] flex w-[200px] flex-col gap-3 rounded-xl bg-white/95 p-3 shadow-[0px_24px_60px_-15px_rgba(0,0,0,0.15)] backdrop-blur-[8px]"
    >
      {title && (
        <div className="flex flex-col gap-1.5 border-b border-[#cbd5e0] pb-1.5">
          <div className="flex items-center gap-3">
            <p className="flex-1 truncate text-sm font-bold text-black">{title}</p>
            {searchable && (
              <button
                type="button"
                aria-label="Search"
                onClick={() => setSearchOpen((v) => !v)}
                className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#a8c9fd]"
              >
                <svg width="11" height="11" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <circle cx="6.5" cy="6.5" r="5" stroke="white" strokeWidth="1.5" />
                  <path d="M10.5 10.5L14 14" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            )}
          </div>
          {searchOpen && (
            <input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search..."
              className="w-full rounded-lg border border-gray-200 px-2 py-1 text-xs text-night-900 placeholder:text-gray-400 focus:outline-none"
            />
          )}
        </div>
      )}

      <div className="flex max-h-[184px] w-full flex-col gap-2 overflow-y-auto">
        {filteredItems.length === 0 ? (
          <p className="text-xs text-gray-400">No matches</p>
        ) : (
          filteredItems.map((item, index) => {
            const isSelected = multiple && selected.includes(item);
            return (
              <button
                key={`${item}-${index}`}
                type="button"
                onClick={() => (multiple ? onToggle?.(item) : onSelect?.(item))}
                className="flex h-6 w-full items-center gap-2 text-left text-sm font-medium text-[#334154] hover:text-brand-900"
              >
                {icon && <NavIcon icon={icon} color="night" size={14} className="shrink-0" />}
                <span className="flex-1 truncate">{item}</span>
                {isSelected && (
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 16 16"
                    fill="none"
                    aria-hidden="true"
                    className="shrink-0 text-brand-900"
                  >
                    <path
                      d="M3 8.5L6.5 12L13 4"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>
            );
          })
        )}
      </div>
    </div>,
    document.body,
  );
}
