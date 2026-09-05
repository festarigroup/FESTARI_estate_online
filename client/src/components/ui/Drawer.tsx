"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { cn } from "@/lib/cn";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Slide-over panel from the right edge, full height — this app's Modal is
 * a centered dialog, which reads as "a small decision" (confirm/cancel a
 * single action); a transaction's full detail (status timeline, linked
 * entity, receipt) is closer to "a record you're inspecting", which a
 * side panel communicates better and is the shape the spec itself names
 * ("Transaction card + detail drawer"). Same escape/backdrop/portal
 * mechanics as Modal, for the same reasons (see that component's own doc
 * comment on why it portals to `document.body`).
 */
export function Drawer({ open, onClose, title, children, className }: DrawerProps) {
  useEffect(() => {
    if (!open) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[60] flex justify-end">
      <button aria-label="Close dialog" onClick={onClose} className="fixed inset-0 bg-black/50" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          "relative flex h-full w-full max-w-md flex-col gap-4 overflow-y-auto bg-white p-6 shadow-xl",
          className,
        )}
      >
        <div className="flex items-center justify-between border-b border-border-subtle pb-4">
          <h2 className="font-heading text-base text-ink">{title}</h2>
          <button aria-label="Close" onClick={onClose} className="text-muted hover:text-ink">
            <DynamicIcon name="X" className="size-5" />
          </button>
        </div>
        <div className="flex-1">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
