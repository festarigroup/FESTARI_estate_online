"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Avatar } from "@/components/ui/Avatar";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { MenuButton } from "@/components/layout/MenuButton";
import { useAuth } from "@/context/AuthContext";
import { getUnreadCount as getUnreadMessages } from "@/lib/api/messaging";
import { getUnreadCount as getUnreadNotifications } from "@/lib/api/notifications";

interface TopNavBarProps {
  onMenuClick: () => void;
}

/** Persistent header ("Header - TopNavBar" in Figma): logo, search, and user actions. */
export function TopNavBar({ onMenuClick }: TopNavBarProps) {
  const { user, logout } = useAuth();
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
    <header className="fixed inset-x-0 top-0 z-50 flex h-[73px] items-center justify-between gap-4 border-b border-brand-navy-light bg-brand-navy px-4 shadow-lg sm:px-6 lg:px-10">
      <div className="flex min-w-0 flex-1 items-center gap-4 lg:gap-[68px]">
        <MenuButton onClick={onMenuClick} />
        {/* Hidden below lg — that's where the hamburger takes over and the
            brand lives in the SideNavBar drawer instead, so it isn't shown
            in two places (or nowhere, mid-transition) at once. */}
        <Link href="/" className="hidden shrink-0 items-center gap-2 lg:flex">
          <Image src="/images/logo-festari.png" alt="" width={31} height={40} className="h-10 w-auto" />
          <span className="hidden font-display text-base font-bold tracking-[-0.5px] text-white sm:inline">
            Festari Estates
          </span>
        </Link>

        <div className="relative hidden max-w-[568px] min-w-0 flex-1 md:block">
          <DynamicIcon
            name="Search"
            className="absolute top-1/2 left-4 size-[18px] -translate-y-1/2 text-white/60"
          />
          <input
            type="search"
            placeholder="Search properties, people, services..."
            className="w-full rounded-full bg-white/10 py-2.5 pr-4 pl-11 text-sm text-white placeholder:text-white/50 focus:outline-2 focus:outline-brand-gold"
          />
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3 sm:gap-6">
        <Link
          href="/messages"
          aria-label="Messages"
          className="relative text-white/80 hover:text-white"
        >
          <DynamicIcon name="MessageSquare" className="size-5" />
          {unreadMessages > 0 && (
            <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-brand-rust text-[10px] text-white">
              {unreadMessages > 9 ? "9+" : unreadMessages}
            </span>
          )}
        </Link>
        <Link
          href="/notifications"
          aria-label="Notifications"
          className="relative text-white/80 hover:text-white"
        >
          <DynamicIcon name="Bell" className="size-5" />
          {unreadNotifications > 0 && (
            <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-brand-rust text-[10px] text-white">
              {unreadNotifications > 9 ? "9+" : unreadNotifications}
            </span>
          )}
        </Link>

        <div className="relative">
          <button className="flex items-center gap-3" onClick={() => setMenuOpen((v) => !v)}>
            <Avatar src={user?.profile_picture ?? undefined} alt={fullName} size={40} ring="gold" />
            <span className="hidden text-left leading-tight lg:block">
              <span className="block font-heading text-sm text-white">{fullName}</span>
              <span className="block font-mono text-[10px] text-white/60 capitalize">{roleLabel}</span>
            </span>
            <DynamicIcon name="ChevronDown" className="hidden size-3 text-white/60 lg:block" />
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
