"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type RefObject } from "react";
import { createPortal } from "react-dom";
import { showSuccessToast } from "@/components/shared/AppToast";
import { NavIcon } from "@/components/shared/NavIcon";
import { SideListMenu } from "@/components/shared/SideListMenu";
import { cn } from "@/lib/utils";

export type PostVisibility =
  | { kind: "everyone" }
  | { kind: "followings" }
  | { kind: "community"; name: string }
  | { kind: "organization"; name: string };

export const DEFAULT_VISIBILITY: PostVisibility = { kind: "everyone" };

export function getVisibilityLabel(value: PostVisibility): string {
  switch (value.kind) {
    case "everyone":
      return "Everyone can view";
    case "followings":
      return "Followings";
    case "community":
    case "organization":
      return value.name;
  }
}

export function getVisibilityIcon(value: PostVisibility): string {
  switch (value.kind) {
    case "everyone":
      return "/icons/create-menu-globe-visibility.svg";
    case "followings":
      return "/icons/user-add-01.svg";
    case "community":
      return "/icons/user-group.svg";
    case "organization":
      return "/icons/visibility-user-check.svg";
  }
}

interface SearchProfile {
  name: string;
  role: string;
  avatar: string;
}

const SEARCH_PROFILES: SearchProfile[] = [
  { name: "Andy Ansong", role: "Real Estate Consultant", avatar: "/icons/avatar-andy.png" },
  { name: "Edwin Adu", role: "Sales Agent", avatar: "/icons/avatar-sample.jpg" },
  { name: "Madeline Price", role: "Researcher", avatar: "/icons/avatar-sample.jpg" },
];

const COMMUNITY_ITEMS = ["Community 5", "Community 9", "Community 4", "Community 8", "Community 5", "Community 3", "Community 2"];
const ORGANIZATION_ITEMS = COMMUNITY_ITEMS.map((item) => item.replace("Community", "Organization"));

interface VisibilityMenuProps {
  open: boolean;
  onClose: () => void;
  value: PostVisibility;
  onChange: (value: PostVisibility) => void;
  anchorRef: RefObject<HTMLElement | null>;
}

export function VisibilityMenu({ open, onClose, value, onChange, anchorRef }: VisibilityMenuProps) {
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState<{ bottom: number; left: number } | null>(null);
  const communityRef = useRef<HTMLButtonElement | null>(null);
  const organizationRef = useRef<HTMLButtonElement | null>(null);
  const [communityOpen, setCommunityOpen] = useState(false);
  const [organizationOpen, setOrganizationOpen] = useState(false);
  const [profileQuery, setProfileQuery] = useState("");
  const [addedProfiles, setAddedProfiles] = useState<string[]>([]);

  const matchingProfiles =
    profileQuery.trim().length > 0
      ? SEARCH_PROFILES.filter((profile) => profile.name.toLowerCase().includes(profileQuery.trim().toLowerCase()))
      : [];

  function toggleProfile(name: string) {
    setAddedProfiles((current) => {
      if (current.includes(name)) {
        showSuccessToast(`${name} removed from this post's audience`);
        return current.filter((added) => added !== name);
      }
      showSuccessToast(`${name} added to this post's audience`);
      return [...current, name];
    });
  }

  useEffect(() => {
    if (!open) return;

    function updatePosition() {
      const rect = anchorRef.current?.getBoundingClientRect();
      if (!rect) return;
      setPosition({ bottom: window.innerHeight - rect.top + 4, left: rect.left + 16 });
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
      if ((event.target as HTMLElement).closest?.("[data-side-list-menu]")) return;
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
      style={{ bottom: position.bottom, left: position.left }}
      className="fixed z-[110] flex w-[280px] flex-col gap-3 rounded-xl bg-white px-2.5 py-3 drop-shadow-[0px_4px_2px_rgba(0,0,0,0.28)]"
    >
      <div className="flex flex-col gap-0.5 px-1">
        <p className="text-sm font-semibold text-[#001f3f]">Who can view?</p>
        <p className="text-xs font-semibold text-[#64748a]">Choose who can view this post</p>
      </div>

      <div className="flex flex-col gap-1">
        <button
          type="button"
          onClick={() => onChange({ kind: "everyone" })}
          className="flex w-full items-center gap-2 rounded-lg px-1 py-1"
        >
          <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-[#86b3fb]">
            <NavIcon icon="/icons/create-menu-globe-visibility.svg" color="white" size={16} />
          </span>
          <span className="flex-1 text-left text-sm font-medium text-[#2d264b]">Everyone can view</span>
          {value.kind === "everyone" && (
            <NavIcon icon="/icons/visibility-tick-check.svg" color="brand" size={16} className="bg-[#1465e6]" />
          )}
        </button>

        <button
          type="button"
          onClick={() => onChange({ kind: "followings" })}
          className={cn(
            "flex w-full items-center gap-2 rounded-full px-1 py-1",
            value.kind === "followings" && "bg-[#f1f6ff]",
          )}
        >
          <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-[#86b3fb]">
            <NavIcon icon="/icons/user-add-01.svg" color="white" size={14} />
          </span>
          <span className="flex-1 text-left text-sm font-medium text-[#2d264b]">Followings</span>
          {value.kind === "followings" && (
            <NavIcon icon="/icons/visibility-tick-check.svg" color="brand" size={16} className="bg-[#1465e6]" />
          )}
        </button>

        <button
          ref={communityRef}
          type="button"
          onClick={() => {
            setCommunityOpen((v) => !v);
            setOrganizationOpen(false);
          }}
          aria-expanded={communityOpen}
          className="flex w-full items-center gap-2 rounded-lg px-1 py-1"
        >
          <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-[#86b3fb]">
            <NavIcon icon="/icons/user-group.svg" color="white" size={16} />
          </span>
          <span className="flex-1 text-left text-sm font-medium text-[#2d264b]">
            {value.kind === "community" ? value.name : "Community"}
          </span>
          {value.kind === "community" ? (
            <NavIcon icon="/icons/visibility-tick-check.svg" color="brand" size={16} className="bg-[#1465e6]" />
          ) : (
            <NavIcon icon="/icons/visibility-chevron-outline-right.svg" color="night" size={10} />
          )}
        </button>

        <button
          ref={organizationRef}
          type="button"
          onClick={() => {
            setOrganizationOpen((v) => !v);
            setCommunityOpen(false);
          }}
          aria-expanded={organizationOpen}
          className="flex w-full items-center gap-2 rounded-lg px-1 py-1"
        >
          <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-[#86b3fb]">
            <NavIcon icon="/icons/visibility-user-check.svg" color="white" size={14} />
          </span>
          <span className="flex-1 text-left text-sm font-medium text-[#2d264b]">
            {value.kind === "organization" ? value.name : "Organization"}
          </span>
          {value.kind === "organization" ? (
            <NavIcon icon="/icons/visibility-tick-check.svg" color="brand" size={16} className="bg-[#1465e6]" />
          ) : (
            <NavIcon icon="/icons/visibility-chevron-outline-right.svg" color="night" size={10} />
          )}
        </button>
      </div>

      <SideListMenu
        open={communityOpen}
        onClose={() => setCommunityOpen(false)}
        anchorRef={communityRef}
        items={COMMUNITY_ITEMS}
        onSelect={(item) => {
          setCommunityOpen(false);
          onChange({ kind: "community", name: item });
          onClose();
        }}
      />
      <SideListMenu
        open={organizationOpen}
        onClose={() => setOrganizationOpen(false)}
        anchorRef={organizationRef}
        items={ORGANIZATION_ITEMS}
        onSelect={(item) => {
          setOrganizationOpen(false);
          onChange({ kind: "organization", name: item });
          onClose();
        }}
      />

      <div className="flex w-full items-center gap-2 rounded-xl bg-[#f6f6f9] px-1.5 py-1.5">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-[#86b3fb]">
          <NavIcon icon="/icons/visibility-search.svg" color="white" size={14} />
        </span>
        <input
          value={profileQuery}
          onChange={(event) => setProfileQuery(event.target.value)}
          placeholder="Search Profile"
          className="w-full flex-1 bg-transparent text-sm text-[#94a3b7] placeholder:text-[#94a3b7] focus:outline-none"
        />
      </div>

      {matchingProfiles.length > 0 && (
        <ul className="flex max-h-[160px] w-full flex-col gap-1 overflow-y-auto">
          {matchingProfiles.map((profile) => {
            const added = addedProfiles.includes(profile.name);
            return (
              <li key={profile.name} className="flex w-full items-center gap-2 rounded-lg px-1 py-1">
                <span className="relative block size-7 shrink-0 overflow-hidden rounded-full bg-[#eef2ff]">
                  <Image src={profile.avatar} alt="" fill className="object-cover" sizes="28px" />
                </span>
                <div className="flex min-w-0 flex-1 flex-col">
                  <p className="truncate text-sm font-medium text-[#2d264b]">{profile.name}</p>
                  <p className="truncate text-xs text-[#94a3b7]">{profile.role}</p>
                </div>
                <button
                  type="button"
                  aria-label={added ? `Remove ${profile.name}` : `Add ${profile.name}`}
                  onClick={() => toggleProfile(profile.name)}
                  className={cn(
                    "flex size-6 shrink-0 items-center justify-center rounded-full",
                    added ? "bg-[#fee2e2] text-red-600" : "bg-[#f1f6ff] text-brand-900",
                  )}
                >
                  {added ? (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                      <path d="M1 1L11 11M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  ) : (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                      <path d="M6 1V11M1 6H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>,
    document.body,
  );
}
