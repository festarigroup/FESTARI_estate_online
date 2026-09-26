"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { showErrorToast, showSuccessToast } from "@/components/shared/AppToast";
import { NavIcon } from "@/components/shared/NavIcon";
import { Tooltip } from "@/components/shared/Tooltip";
import { useAnimatedSheet } from "@/hooks/useAnimatedSheet";
import { DUMMY_LISTINGS, type PropertyListing } from "@/lib/dummy-listings";
import { cn } from "@/lib/utils";
import { usePostsFeed } from "@/context/PostsContext";

interface PostPropertyModalProps {
  open: boolean;
  onClose: () => void;
}

export function PostPropertyModal({ open, onClose }: PostPropertyModalProps) {
  const { addPost } = usePostsFeed();
  const [note, setNote] = useState("");
  const [listingId, setListingId] = useState<string>(DUMMY_LISTINGS[0].id);
  const listing = DUMMY_LISTINGS.find((item) => item.id === listingId) ?? null;

  const { mounted, closing } = useAnimatedSheet(open);

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

  if (!mounted) return null;

  function resetState() {
    setNote("");
    setListingId(DUMMY_LISTINGS[0].id);
  }

  function handleClose() {
    resetState();
    onClose();
  }

  function handlePost() {
    if (!listing) {
      showErrorToast("Choose a listing to post");
      return;
    }
    addPost({ kind: "property", note, listing });
    showSuccessToast("Your property has been posted");
    resetState();
    onClose();
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 sm:items-center sm:p-4"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-label="Post a property"
    >
      <div onClick={(event) => event.stopPropagation()} className="relative w-full sm:max-w-[680px]">
        <button
          type="button"
          aria-label="Close"
          onClick={handleClose}
          className="absolute -right-3 -top-3 z-10 hidden size-7 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-md hover:bg-gray-50 sm:flex"
        >
          <svg width="9" height="9" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M1 1L11 11M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        <div
          className={cn(
            "flex max-h-[90vh] w-full flex-col gap-6 overflow-y-auto overflow-x-hidden rounded-t-3xl bg-white/95 p-6 shadow-[0px_24px_60px_-15px_rgba(0,0,0,0.15)] backdrop-blur-[8px] sm:rounded-2xl",
            closing ? "max-sm:animate-sheet-slide-down" : "max-sm:animate-sheet-slide-up",
          )}
        >
          <div className="h-[3px] w-[152px] shrink-0 self-center rounded-[20px] bg-[#334154] sm:hidden" />

          <div className="flex w-full items-center gap-2.5">
            <button
              type="button"
              aria-label="Close"
              onClick={handleClose}
              className="flex size-6 shrink-0 items-center justify-center text-night-900 sm:hidden"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M10 4V16M10 16L4 10M10 16L16 10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <p className="flex-1 text-center text-xl font-semibold tracking-[-0.02em] text-[#111826] sm:text-left">
              Post a Property
            </p>
            <span className="size-6 shrink-0 sm:hidden" aria-hidden />
          </div>

          <div className="flex w-full items-start gap-3">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#eef2ff] text-[13px] font-extrabold text-[#4f46e5]">
              SL
            </span>
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              rows={2}
              placeholder="Add a note about this property ..."
              className="w-full flex-1 resize-none rounded-lg px-3 py-3.5 text-base leading-6 text-night-900 placeholder:text-[#475568] focus:outline-none"
            />
            <Tooltip label="Clear note" side="bottom">
              <button
                type="button"
                aria-label="Clear note"
                onClick={() => setNote("")}
                className="flex size-6 shrink-0 items-center justify-center"
              >
                <NavIcon icon="/icons/poll-close-outline.svg" color="night" size={16} />
              </button>
            </Tooltip>
          </div>

          <div className="flex w-full flex-col gap-2.5 rounded-2xl border border-[#e2e8f0] p-4">
            <p className="text-sm text-[#111826]">Choose from My Listings</p>
            <div className="flex w-full items-center gap-4">
              <ListingDropdown value={listingId} onChange={setListingId} />
              <Tooltip label="Remove listing">
                <button
                  type="button"
                  aria-label="Remove listing"
                  onClick={() => setListingId("")}
                  className="flex size-8 shrink-0 items-center justify-center"
                >
                  <NavIcon icon="/icons/poll-trash-delete.svg" color="night" size={16} className="bg-[#ef4444]" />
                </button>
              </Tooltip>
            </div>
          </div>

          {listing && (
            <div className="flex w-full items-stretch overflow-hidden rounded-2xl border border-[#e2e8f0]">
              <span className="relative h-[120px] w-[35%] shrink-0 sm:w-[203px]">
                <Image src={listing.images[0]} alt="" fill className="object-cover" sizes="(max-width: 640px) 35vw, 203px" />
              </span>
              <div className="flex flex-1 flex-col justify-end gap-1 bg-[#f8fafc] px-4 py-3">
                <p className="text-lg font-semibold text-[#334154] sm:text-xl">{listing.priceLine}</p>
                <p className="text-xs font-bold text-[#334154]">{listing.subLine}</p>
                <p className="text-[9px] font-light text-[#334154]">
                  {listing.location} - {listing.beds} Bed | {listing.baths} Bath
                </p>
              </div>
            </div>
          )}

          <div className="flex w-full items-center justify-end gap-2">
            <button
              type="button"
              onClick={handleClose}
              className="flex h-8 items-center justify-center rounded-lg border border-[#e2e8f0] bg-[#f8fafc] px-4 text-sm text-red-500"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handlePost}
              disabled={!listing}
              className="flex h-8 flex-1 items-center justify-center rounded-lg bg-brand-900 px-3 text-sm text-white hover:bg-brand-900/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Post All
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

function ListingDropdown({ value, onChange }: { value: string; onChange: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const selected = DUMMY_LISTINGS.find((item) => item.id === value);

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
    <div ref={rootRef} className="relative min-w-0 flex-1">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex h-12 w-full items-center justify-between gap-2 rounded-lg border border-[#cbd5e0] bg-white px-3 text-left"
      >
        <span className="min-w-0 flex-1 truncate text-sm text-[#334154]">
          {selected ? selected.title : "Select a listing"}
        </span>
        <NavIcon
          icon="/icons/poll-chevron-down.svg"
          color="night"
          size={16}
          className={cn("shrink-0 transition-transform duration-150", open && "rotate-180")}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-[calc(100%+4px)] z-20 flex max-h-[220px] w-full flex-col gap-0.5 overflow-y-auto rounded-lg border border-[#cbd5e0] bg-white p-1 shadow-[0px_0px_24px_0px_rgba(0,0,0,0.08)]">
          {DUMMY_LISTINGS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onChange(item.id);
                setOpen(false);
              }}
              className={cn(
                "flex w-full items-center gap-2 rounded p-2 text-left text-sm text-[#0f1621]",
                item.id === value && "bg-[#f8fafc]",
              )}
            >
              <span className="relative size-9 shrink-0 overflow-hidden rounded-md">
                <Image src={item.images[0]} alt="" fill className="object-cover" sizes="36px" />
              </span>
              <span className="min-w-0 flex-1 truncate">{item.title}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export type { PropertyListing };
