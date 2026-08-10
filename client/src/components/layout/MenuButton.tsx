"use client";

import { DynamicIcon } from "@/components/ui/DynamicIcon";

/** Hamburger toggle shown only below `lg`, where the sidebar becomes a drawer. */
export function MenuButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label="Toggle navigation menu"
      className="text-muted hover:text-ink lg:hidden"
    >
      <DynamicIcon name="Menu" className="size-6" />
    </button>
  );
}
