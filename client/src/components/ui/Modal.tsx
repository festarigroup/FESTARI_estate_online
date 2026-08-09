"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { cn } from "@/lib/cn";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Centered dialog shell — backdrop click and Escape both close it. Not part
 * of the Figma file (no modal frames were provided); styled to match the
 * feed's existing cards (white, rounded-[39px], navy/gold accents) since
 * this is new surface built to make the composer/story buttons actually do
 * something. The radius follows the cards' own bump to rounded-[39px] (node
 * 3371:3033) to keep matching them.
 *
 * Portals to `document.body` rather than rendering in place: several cards
 * that open a modal (e.g. PostComposer) use Tailwind's `drop-shadow-[...]`,
 * which compiles to a CSS `filter` — and per spec, a `filter`/`transform` on
 * an ancestor becomes the containing block for `position: fixed`
 * descendants. Without the portal, this modal's "fixed inset-0" backdrop
 * would be sized to that ancestor's box instead of the viewport, so most of
 * what looked like "outside the dialog" never actually reached the backdrop
 * button's click handler.
 */
export function Modal({ open, onClose, title, children, className }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  // No `document` during SSR, and every caller in this app initializes
  // `open` to false, so this is only ever reached client-side post-mount —
  // no separate mount-detection state needed (and setState-in-effect for
  // that would trip the react-hooks/set-state-in-effect lint rule anyway).
  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <button
        aria-label="Close dialog"
        onClick={onClose}
        className="fixed inset-0 bg-black/50"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          "relative flex max-h-[85vh] w-full max-w-lg flex-col gap-4 rounded-[39px] bg-white p-6 shadow-xl",
          className,
        )}
      >
        <div className="flex items-center justify-between border-b border-border-subtle pb-4">
          <h2 className="font-heading text-base text-ink">{title}</h2>
          <button aria-label="Close" onClick={onClose} className="text-muted hover:text-ink">
            <DynamicIcon name="X" className="size-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
