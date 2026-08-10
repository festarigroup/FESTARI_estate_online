"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { MenuButton } from "@/components/layout/MenuButton";
import { useAuth } from "@/context/AuthContext";
import { usePostComposer } from "@/context/PostComposerContext";
import { getUnreadCount as getUnreadMessages } from "@/lib/api/messaging";
import { getUnreadCount as getUnreadNotifications } from "@/lib/api/notifications";

interface TopNavBarProps {
  onMenuClick: () => void;
}

/**
 * Persistent header ("Top Nav" in Figma, node 3393:18013). Figma only
 * specifies the desktop frame — no mobile breakpoint exists in the file at
 * all — so below `lg` this now reuses the same white/navy/gold palette
 * instead of the inverted navy-bar-with-white-text treatment it used to
 * fall back to. Only the *structural* differences a fixed mobile header
 * genuinely needs stay breakpoint-gated: the taller 73px height (matches
 * every other `pt-[73px] lg:pt-16` pairing across this app), the hidden
 * logo/search-hides-earlier layout economy, and "+ Create Post" staying
 * desktop-only.
 */
export function TopNavBar({ onMenuClick }: TopNavBarProps) {
  const { user, logout } = useAuth();
  const { openCreatePost } = usePostComposer();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  useEffect(() => {
    if (!user) return;
    getUnreadMessages()
      .then((res) => setUnreadMessages(res.count))
      .catch(() => {});
    getUnreadNotifications()
      .then((res) => setUnreadNotifications(res.count))
      .catch(() => {});
  }, [user]);

  const fullName = [user?.firstname, user?.lastname].filter(Boolean).join(" ") || "Account";
  const roleLabel = user?.roles?.[0]?.replace(/_/g, " ") ?? "";

  async function handleLogout() {
    await logout();
    router.push("/login");
  }

  return (
    <header
      // Genuinely full-bleed at every breakpoint now (Figma node
      // 3393:18013 has no margin or border-radius at all — edge to edge,
      // flush at the very top) — the sidebar starts *below* this, not
      // beside it, so this never needs to dodge --sidebar-w. Same
      // bg-white/border-[#e2e8f0] at every breakpoint too now; only the
      // height/padding still change at `lg`.
      className="fixed left-0 right-0 top-0 z-50 flex h-[73px] items-center justify-between gap-4 border-b border-[#e2e8f0] bg-white px-4 sm:px-6 lg:h-16 lg:px-6"
    >
      <div className="flex min-w-0 flex-1 items-center gap-4 lg:gap-6">
        <MenuButton onClick={onMenuClick} />
        {/* Hidden below `lg` — the mobile drawer (SideNavBar) carries its
            own logo instead, since below `lg` this header has no spare
            width for it next to the search field. */}
        <Link href="/" className="hidden shrink-0 items-center gap-2 lg:flex">
          <Image src="/images/logo-festari.png" alt="" width={31} height={40} className="h-10 w-auto" />
          <span className="hidden font-display text-base font-bold tracking-[-0.5px] text-ink sm:inline">
            Festari Estates
          </span>
        </Link>

        <div className="relative hidden max-w-[568px] min-w-0 flex-1 md:block">
          <DynamicIcon
            name="Search"
            className="absolute top-1/2 left-4 size-[18px] -translate-y-1/2 text-brand-gold-dark"
          />
          <input
            type="search"
            placeholder="Search properties, people, services..."
            className="w-full rounded-full bg-surface-muted py-2.5 pr-4 pl-11 text-sm text-ink placeholder:text-muted focus:outline-2 focus:outline-brand-gold"
          />
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3 sm:gap-6">
        {/* "+ Create Post" (Figma node 3393:18030) — desktop-only global
            entry point to the same composer every page's own PostComposer
            already opens; see PostComposerContext for how a newly-created
            post reaches whichever page is actually mounted. */}
        <Button variant="gold-pill" className="hidden lg:flex" onClick={() => openCreatePost()}>
          <DynamicIcon name="Plus" className="size-3.5" />
          Create Post
        </Button>

        <Link
          href="/messages"
          aria-label="Messages"
          className="relative flex size-10 items-center justify-center rounded-full border border-border-subtle text-muted hover:bg-surface-muted hover:text-ink"
        >
          <DynamicIcon name="MessageSquare" className="size-[18px]" />
          {unreadMessages > 0 && (
            <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-brand-rust text-[10px] text-white">
              {unreadMessages > 9 ? "9+" : unreadMessages}
            </span>
          )}
        </Link>
        <Link
          href="/notifications"
          aria-label="Notifications"
          className="relative flex size-10 items-center justify-center rounded-full bg-brand-navy text-white hover:bg-brand-navy-light"
        >
          <DynamicIcon name="Bell" className="size-[18px]" />
          {unreadNotifications > 0 && (
            <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-brand-rust text-[10px] text-white lg:hidden">
              {unreadNotifications > 9 ? "9+" : unreadNotifications}
            </span>
          )}
          {unreadNotifications > 0 && (
            <span className="absolute top-0 right-0 hidden size-2.5 rounded-full border border-white bg-red-600 lg:block" />
          )}
        </Link>

        <div className="relative">
          <button className="flex items-center gap-3" onClick={() => setMenuOpen((v) => !v)}>
            <Avatar src={user?.profile_picture ?? undefined} alt={fullName} size={40} ring="gold" />
            <span className="hidden text-left leading-tight lg:block">
              <span className="block font-heading text-sm text-ink">{fullName}</span>
              <span className="block font-mono text-[10px] text-muted capitalize">{roleLabel}</span>
            </span>
            <DynamicIcon name="ChevronDown" className="hidden size-3 text-muted lg:block" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-2 w-40 rounded-lg border border-border-subtle bg-white py-1 shadow-lg">
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-ink hover:bg-surface-muted"
              >
                <DynamicIcon name="LogOut" className="size-4" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
