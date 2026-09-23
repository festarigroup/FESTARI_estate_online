"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { showSuccessToast } from "@/components/shared/AppToast";
import { CreateMenu } from "@/components/shared/CreateMenu";
import { CreatePollModal } from "@/components/shared/CreatePollModal";
import { CreatePostModal } from "@/components/shared/CreatePostModal";
import { NavIcon } from "@/components/shared/NavIcon";
import { comingSoonHref } from "@/lib/coming-soon";

export function TopNav() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [createMenuOpen, setCreateMenuOpen] = useState(false);
  const createMenuRef = useRef<HTMLDivElement | null>(null);
  const [postModalOpen, setPostModalOpen] = useState(false);
  const [postModalType, setPostModalType] = useState<"image" | "video" | "poll">("image");

  function handleLogout() {
    setMenuOpen(false);
    showSuccessToast("You've been logged out");
    router.push("/auth");
  }

  function goComingSoon(feature: string) {
    setMenuOpen(false);
    router.push(comingSoonHref(feature));
  }

  function handleCreateClick() {
    setCreateMenuOpen((v) => !v);
  }

  function openPostModal(type: "image" | "video" | "poll") {
    setPostModalType(type);
    setPostModalOpen(true);
  }

  useEffect(() => {
    if (!menuOpen) return;
    const handlePointerDown = (event: PointerEvent) => {
      if (menuRef.current?.contains(event.target as Node)) return;
      setMenuOpen(false);
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [menuOpen]);

  useEffect(() => {
    if (!createMenuOpen) return;
    const handlePointerDown = (event: PointerEvent) => {
      if (createMenuRef.current?.contains(event.target as Node)) return;
      setCreateMenuOpen(false);
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [createMenuOpen]);

  return (
    <header className="flex h-[67px] shrink-0 items-center border-b border-gray-200 bg-white px-[15px] py-2 sm:px-[23px]">
      <div className="flex w-full items-center justify-between gap-2">
        <div className="flex min-w-0 flex-1 items-center gap-[15px] md:gap-[38px] lg:gap-[57px] 3xl:gap-[109px] 3xl:flex-initial">
          <div className="relative size-[34px] shrink-0 sm:hidden">
            <Image src="/brand/mobile%20logo.png" alt="Biltlinx" fill className="object-contain" sizes="34px" priority />
          </div>
          <div className="relative hidden h-[36px] w-[72px] shrink-0 sm:block">
            <Image src="/icons/logo-biltlinx.png" alt="Biltlinx" fill className="object-contain" sizes="72px" priority />
          </div>

          <button
            type="button"
            onClick={() => goComingSoon("Search")}
            className="hidden h-[46px] min-w-0 flex-1 items-center gap-2 rounded-lg border border-gray-200 bg-white px-[11px] py-[13px] text-left sm:flex sm:max-w-[350px]"
          >
            <span className="relative block size-[15px] shrink-0">
              <Image src="/icons/search.svg" alt="" fill sizes="15px" />
            </span>
            <span className="truncate text-[13px] text-gray-500">Search anything</span>
          </button>
        </div>

        <div className="flex shrink-0 items-center gap-1 py-1 sm:gap-2 sm:px-2">
          <button
            type="button"
            aria-label="Search"
            onClick={() => goComingSoon("Search")}
            className="relative flex size-[38px] items-center justify-center rounded-full hover:bg-gray-50 sm:hidden"
          >
            <span className="relative block size-[19px] shrink-0">
              <Image src="/icons/search.svg" alt="" fill sizes="19px" />
            </span>
          </button>

          <div ref={createMenuRef} className="relative">
            <button
              type="button"
              aria-label="Create"
              aria-expanded={createMenuOpen}
              onClick={handleCreateClick}
              className="flex h-[34px] items-center justify-center gap-2 rounded-[20px] bg-[#0072ff] px-4 hover:opacity-90 sm:h-[38px] sm:w-[93px] sm:rounded-lg sm:bg-brand-900 sm:px-[15px] sm:hover:bg-brand-900/90 sm:hover:opacity-100"
            >
              <NavIcon icon="/icons/add-circle-01.svg" color="white" size={19} className="hidden sm:block" />
              <span className="text-[11px] text-white sm:text-[13px]">Create</span>
            </button>

            {createMenuOpen && (
              <div className="absolute right-0 top-[calc(100%+8px)] z-50">
                <CreateMenu onNavigate={() => setCreateMenuOpen(false)} onOpenPostModal={openPostModal} />
              </div>
            )}
          </div>

          <button
            type="button"
            aria-label="Messages"
            onClick={() => goComingSoon("Messages")}
            className="relative hidden size-[38px] shrink-0 items-center justify-center rounded-full hover:bg-gray-50 sm:flex"
          >
            <span className="relative block size-[19px] shrink-0">
              <Image src="/icons/message-programming.svg" alt="" fill sizes="19px" />
            </span>
            <span className="absolute right-[7px] top-[8px] size-1.5 rounded-full border border-[#f5f0f9] bg-red-500" />
          </button>

          <button
            type="button"
            aria-label="Notifications"
            onClick={() => goComingSoon("Notifications")}
            className="relative hidden size-[38px] shrink-0 items-center justify-center rounded-full hover:bg-gray-50 sm:flex"
          >
            <span className="relative block size-[19px] shrink-0">
              <Image src="/icons/notification.svg" alt="" fill sizes="19px" />
            </span>
            <span className="absolute right-[7px] top-[8px] size-1.5 rounded-full border border-[#f5f0f9] bg-red-500" />
          </button>

          <div ref={menuRef} className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-label="Account menu"
              className="flex items-center gap-2 rounded-full hover:bg-gray-50"
            >
              <span className="block shrink-0 rounded-full bg-gradient-to-r from-[#ff8008] to-[#ffc837] p-px">
                <span className="relative block size-12 overflow-hidden rounded-full">
                  <Image src="/icons/avatar-sample.jpg" alt="Madeline Price" fill className="object-cover" sizes="48px" />
                </span>
              </span>
              <div className="hidden flex-col items-start md:flex">
                <p className="text-[11px] font-semibold text-night-900">Madeline Price</p>
                <span className="rounded-full bg-gray-200 px-2 py-0.5 text-[9.5px] text-brand-900">Researcher</span>
              </div>
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-[calc(100%+8px)] z-50 flex w-48 flex-col gap-1 rounded-[11px] border border-gray-200 bg-white p-2 shadow-lg">
                <button
                  type="button"
                  onClick={() => goComingSoon("Messages")}
                  className="flex h-10 w-full items-center gap-3 rounded-[10px] px-3 text-[13px] text-night-700 hover:bg-gray-50 sm:hidden"
                >
                  <NavIcon icon="/icons/message-programming.svg" color="night" size={18} />
                  Messages
                </button>
                <button
                  type="button"
                  onClick={() => goComingSoon("Notifications")}
                  className="flex h-10 w-full items-center gap-3 rounded-[10px] px-3 text-[13px] text-night-700 hover:bg-gray-50 sm:hidden"
                >
                  <NavIcon icon="/icons/notification.svg" color="night" size={18} />
                  Notifications
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex h-10 w-full items-center gap-3 rounded-[10px] px-3 text-[13px] text-red-600 hover:bg-gray-50"
                >
                  <NavIcon icon="/icons/logout-01.svg" color="night" size={18} className="bg-red-600" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <CreatePostModal
        open={postModalOpen && postModalType !== "poll"}
        initialType={postModalType === "video" ? "video" : "image"}
        onClose={() => setPostModalOpen(false)}
        onSwitchType={openPostModal}
      />
      <CreatePollModal
        open={postModalOpen && postModalType === "poll"}
        onClose={() => setPostModalOpen(false)}
        onSwitchType={openPostModal}
      />
    </header>
  );
}
