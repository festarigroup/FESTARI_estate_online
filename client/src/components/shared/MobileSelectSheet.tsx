"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { comingSoonHref } from "@/lib/coming-soon";
import { cn } from "@/lib/utils";
import { useAnimatedSheet } from "@/hooks/useAnimatedSheet";

export interface SelectSheetItem {
  name: string;
  role: string;
  avatar: string;
  /** True for a generic icon (e.g. an organization logo glyph) instead of a photo, so it's contained rather than cropped. */
  avatarIsIcon?: boolean;
  disabled?: boolean;
}

interface SelectSheetBodyProps {
  title: string;
  items: SelectSheetItem[];
  selected: string[];
  onChangeSelected: (next: string[]) => void;
  onClose: () => void;
  /** "sheet": drag handle + X, meant for a full bottom sheet. "inline": back
   * arrow, no drag handle, meant to swap in place inside another surface. */
  variant?: "sheet" | "inline";
}

/** The searchable, multi-select list shared by the nested-bottom-sheet picker
 * (MobileSelectSheet) and the in-place "swap the composer's own content"
 * alternative — same list, different chrome around it. */
export function SelectSheetBody({ title, items, selected, onChangeSelected, onClose, variant = "sheet" }: SelectSheetBodyProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const noun = title.replace("Select ", "");

  const filteredItems = query.trim()
    ? items.filter((item) => item.name.toLowerCase().includes(query.trim().toLowerCase()))
    : items;
  const selectableItems = filteredItems.filter((item) => !item.disabled);
  const allSelected = selectableItems.length > 0 && selectableItems.every((item) => selected.includes(item.name));

  function toggleItem(name: string) {
    onChangeSelected(selected.includes(name) ? selected.filter((n) => n !== name) : [...selected, name]);
  }

  function toggleAll() {
    if (allSelected) {
      const selectableNames = new Set(selectableItems.map((item) => item.name));
      onChangeSelected(selected.filter((name) => !selectableNames.has(name)));
    } else {
      const namesToAdd = selectableItems.map((item) => item.name);
      onChangeSelected(Array.from(new Set([...selected, ...namesToAdd])));
    }
  }

  return (
    <div className="flex w-full flex-col gap-4">
      {variant === "sheet" && <div className="h-[3px] w-[152px] shrink-0 self-center rounded-[20px] bg-[#334154]" />}

      <div className={cn("flex w-full shrink-0 items-center gap-2.5", variant === "sheet" && "px-6")}>
        <button
          type="button"
          aria-label={variant === "inline" ? "Back" : "Close"}
          onClick={onClose}
          className="flex size-6 shrink-0 items-center justify-center"
        >
          {variant === "inline" ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M19 12H5M5 12L12 5M5 12L12 19" stroke="#141b34" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M20 12H4M4 12L11 5M4 12L11 19" stroke="#141b34" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>
        {searchOpen ? (
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={`Search ${title.replace("Select ", "").toLowerCase()}`}
            className="flex-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-night-900 placeholder:text-gray-400 focus:outline-none"
          />
        ) : (
          <p className="flex-1 text-center text-lg font-bold tracking-[-0.54px] text-black">{title}</p>
        )}
        <button
          type="button"
          aria-label={searchOpen ? "Close search" : "Search"}
          onClick={() => {
            setSearchOpen((v) => !v);
            setQuery("");
          }}
          className="flex size-[26px] shrink-0 items-center justify-center rounded-full bg-brand-900"
        >
          {searchOpen ? (
            <svg width="13" height="13" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M1 1L11 11M11 1L1 11" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <circle cx="7" cy="7" r="5" stroke="white" strokeWidth="2.2" />
              <path d="M11 11L14.5 14.5" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </div>

      <div className={cn("flex w-full flex-col overflow-hidden rounded-lg border border-[#f1f5f9]", variant === "sheet" && "px-6")}>
        <button
          type="button"
          onClick={toggleAll}
          className="flex w-full shrink-0 items-center gap-3 bg-[#f8fafc] px-3 py-2.5"
        >
          <Checkbox checked={allSelected} />
          <span className="text-xs font-medium text-[#111826]">Select all</span>
        </button>

        <div className="max-h-[336px] w-full overflow-y-auto">
          {filteredItems.length === 0 ? (
            <p className="px-3 py-4 text-sm text-gray-400">No matches</p>
          ) : (
            filteredItems.map((item) => {
              const isSelected = selected.includes(item.name);
              return (
                <button
                  key={item.name}
                  type="button"
                  disabled={item.disabled}
                  onClick={() => toggleItem(item.name)}
                  className={cn(
                    "flex w-full items-center gap-3 border-b border-[#f1f5f9] p-3 last:border-b-0",
                    item.disabled && "opacity-50",
                  )}
                >
                  <Checkbox checked={isSelected} />
                  <span
                    className={cn(
                      "relative block size-8 shrink-0 overflow-hidden rounded-full border-[0.4px] border-[#ebebeb] bg-white",
                      item.avatarIsIcon && "p-1.5",
                    )}
                  >
                    <Image
                      src={item.avatar}
                      alt=""
                      fill
                      className={item.avatarIsIcon ? "object-contain" : "object-cover"}
                      sizes="32px"
                    />
                  </span>
                  <div className="flex min-w-0 flex-1 flex-col items-start text-left">
                    <p className="truncate text-sm font-semibold text-[#111826]">{item.name}</p>
                    <p className="truncate text-[10px] text-[#64748a]">{item.role}</p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      <Link
        href={comingSoonHref(`Add ${noun}`)}
        className={cn(
          "flex w-full shrink-0 items-center justify-center rounded-2xl bg-brand-900 px-4 py-2.5 text-sm text-white",
          variant === "sheet" && "mx-6 w-auto",
        )}
      >
        Add {noun}
      </Link>
    </div>
  );
}

interface MobileSelectSheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  items: SelectSheetItem[];
  selected: string[];
  onChangeSelected: (next: string[]) => void;
}

/** The bottom-sheet picker used on mobile when choosing communities/organizations
 * (Figma node 404:15742) — replaces the desktop side popover on small screens. */
export function MobileSelectSheet({ open, onClose, title, items, selected, onChangeSelected }: MobileSelectSheetProps) {
  const { mounted, closing } = useAnimatedSheet(open);

  useEffect(() => {
    if (!mounted) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mounted]);

  if (!mounted) return null;

  return createPortal(
    <div
      data-mobile-select-sheet
      className="fixed inset-0 z-[130] flex items-end bg-transparent"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className={cn(
          "flex max-h-[85vh] w-full flex-col gap-4 rounded-t-[32px] bg-white pb-4 pt-4 shadow-[0px_-4px_8px_0px_rgba(69,71,69,0.15)]",
          closing ? "animate-sheet-slide-down" : "animate-sheet-slide-up",
        )}
      >
        <SelectSheetBody
          title={title}
          items={items}
          selected={selected}
          onChangeSelected={onChangeSelected}
          onClose={onClose}
          variant="sheet"
        />
      </div>
    </div>,
    document.body,
  );
}

function Checkbox({ checked }: { checked: boolean }) {
  return (
    <span
      className={cn(
        "flex size-[18px] shrink-0 items-center justify-center rounded-[4px] border",
        checked ? "border-[#337df2] bg-[#337df2]" : "border-[#cbd5e0] bg-white",
      )}
    >
      {checked && (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </span>
  );
}
