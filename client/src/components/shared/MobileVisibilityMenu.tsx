"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { createPortal } from "react-dom";
import { MobileSelectSheet, type SelectSheetItem } from "@/components/shared/MobileSelectSheet";
import { NavIcon } from "@/components/shared/NavIcon";
import { type PostVisibility } from "@/components/shared/VisibilityMenu";
import { cn } from "@/lib/utils";

const ORGANIZATION_ITEMS: SelectSheetItem[] = [
  { name: "Organization 1", role: "Lead Product Designer", avatar: "/icons/organization-logo.svg", avatarIsIcon: true },
  { name: "Organization 2", role: "Product Designer", avatar: "/icons/organization-logo.svg", avatarIsIcon: true, disabled: true },
  { name: "Organization 3", role: "Head of Design", avatar: "/icons/organization-logo.svg", avatarIsIcon: true },
  { name: "Organization 4", role: "Product Designer", avatar: "/icons/organization-logo.svg", avatarIsIcon: true },
  { name: "Organization 5", role: "Chief Strategy Officer", avatar: "/icons/organization-logo.svg", avatarIsIcon: true },
];
const COMMUNITY_ITEMS: SelectSheetItem[] = [
  { name: "Community 1", role: "Lead Product Designer", avatar: "/icons/avatar-sample.jpg" },
  { name: "Community 2", role: "Product Designer", avatar: "/icons/avatar-andy.png", disabled: true },
  { name: "Community 3", role: "Head of Design", avatar: "/icons/avatar-sample.jpg" },
  { name: "Community 4", role: "Product Designer", avatar: "/icons/avatar-andy.png" },
  { name: "Community 5", role: "Chief Strategy Officer", avatar: "/icons/avatar-sample.jpg" },
];

const MENU_WIDTH = 190;

function Row({
  label,
  icon,
  active,
  hasChevron,
  onClick,
  buttonRef,
  ariaExpanded,
}: {
  label: string;
  icon: string;
  active: boolean;
  hasChevron?: boolean;
  onClick: () => void;
  buttonRef?: RefObject<HTMLButtonElement | null>;
  ariaExpanded?: boolean;
}) {
  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={onClick}
      aria-expanded={ariaExpanded}
      className={cn(
        "flex w-full items-center gap-3 rounded-[15px] px-3 py-1.5",
        active && "bg-[rgba(239,239,239,0.85)]",
      )}
    >
      <NavIcon icon={icon} color="night" size={14} />
      <span className={cn("flex-1 text-left text-xs font-semibold tracking-[-0.36px]", active ? "text-[#171717]" : "text-[#262626]")}>
        {label}
      </span>
      {hasChevron && (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="shrink-0 text-[#94a3b7]">
          <path d="M5 3L9 7L5 11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  );
}

interface MobileVisibilityMenuProps {
  open: boolean;
  onClose: () => void;
  value: PostVisibility;
  onChange: (value: PostVisibility) => void;
  anchorRef: RefObject<HTMLElement | null>;
}

/** The compact floating "Everyone/Following/Community/Organization" menu
 * used by the mobile quick-post composer (Figma node 400:14042) — distinct
 * from the desktop VisibilityMenu's larger "Who can view?" panel. */
export function MobileVisibilityMenu({ open, onClose, value, onChange, anchorRef }: MobileVisibilityMenuProps) {
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState<{ bottom: number; left: number } | null>(null);
  const [communitySheetOpen, setCommunitySheetOpen] = useState(false);
  const [organizationSheetOpen, setOrganizationSheetOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    function updatePosition() {
      const rect = anchorRef.current?.getBoundingClientRect();
      if (!rect) return;
      const left = Math.min(Math.max(rect.left - 12, 8), window.innerWidth - MENU_WIDTH - 8);
      setPosition({ bottom: window.innerHeight - rect.top + 8, left });
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
      if ((event.target as HTMLElement).closest?.("[data-mobile-select-sheet]")) return;
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
      style={{ bottom: position.bottom, left: position.left, width: MENU_WIDTH }}
      className="fixed z-[110] flex flex-col gap-0.5 rounded-[24px] border border-gray-200 bg-[rgba(255,255,255,0.96)] p-[9px] shadow-[0px_8px_24px_-8px_rgba(0,0,0,0.15)] backdrop-blur-[14px]"
    >
      <Row
        label="Everyone"
        icon="/icons/create-menu-globe-visibility.svg"
        active={value.kind === "everyone"}
        onClick={() => onChange({ kind: "everyone" })}
      />
      <Row
        label="Following"
        icon="/icons/user-add-01.svg"
        active={value.kind === "followings"}
        onClick={() => onChange({ kind: "followings" })}
      />
      <Row
        label="Community"
        icon="/icons/user-group.svg"
        active={value.kind === "community"}
        hasChevron
        ariaExpanded={communitySheetOpen}
        onClick={() => setCommunitySheetOpen(true)}
      />
      <Row
        label="Organization"
        icon="/icons/visibility-user-check.svg"
        active={value.kind === "organization"}
        hasChevron
        ariaExpanded={organizationSheetOpen}
        onClick={() => setOrganizationSheetOpen(true)}
      />

      <MobileSelectSheet
        open={communitySheetOpen}
        onClose={() => setCommunitySheetOpen(false)}
        title="Select Community"
        items={COMMUNITY_ITEMS}
        selected={value.kind === "community" ? value.names : []}
        onChangeSelected={(names) => {
          onChange(names.length > 0 ? { kind: "community", names } : { kind: "everyone" });
        }}
      />
      <MobileSelectSheet
        open={organizationSheetOpen}
        onClose={() => setOrganizationSheetOpen(false)}
        title="Select Organization"
        items={ORGANIZATION_ITEMS}
        selected={value.kind === "organization" ? value.names : []}
        onChangeSelected={(names) => {
          onChange(names.length > 0 ? { kind: "organization", names } : { kind: "everyone" });
        }}
      />

      <div className="mt-0.5 flex h-[29px] w-full items-center gap-1 rounded-2xl border-[0.6px] border-gray-300 bg-[#f6f6f9] px-2 py-1.5">
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="shrink-0 text-gray-400">
          <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.4" />
          <path d="M11 11L14 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
        <span className="truncate text-[10px] font-medium text-gray-400">Search Profile</span>
      </div>
    </div>,
    document.body,
  );
}
