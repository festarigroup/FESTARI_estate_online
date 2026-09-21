"use client";

import Image from "next/image";

export function TopNav() {
  return (
    <header className="flex h-[70px] shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6 py-2">
      <div className="flex w-[757.5px] items-center gap-[115px]">
        <div className="relative h-[38px] w-[76px] shrink-0">
          <Image src="/icons/logo-biltlinx.png" alt="Biltlinx" fill className="object-contain" sizes="76px" priority />
        </div>

        <div className="flex h-12 w-[368px] items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-3.5">
          <span className="relative block size-4 shrink-0">
            <Image src="/icons/search.svg" alt="" fill sizes="16px" />
          </span>
          <span className="text-sm text-gray-500">Search anything</span>
        </div>
      </div>

      <div className="flex items-center gap-2 px-2 py-1">
        <button
          type="button"
          className="flex h-10 w-[98px] items-center justify-center gap-2 rounded-lg bg-brand-600 p-4 text-sm text-white hover:bg-brand-600/90"
        >
          <span className="relative block size-5 shrink-0">
            <Image src="/icons/add-alt.svg" alt="" fill sizes="20px" />
          </span>
          Create
        </button>

        <button
          type="button"
          aria-label="Messages"
          className="relative flex size-10 items-center justify-center rounded-full hover:bg-gray-50"
        >
          <span className="relative block size-5 shrink-0">
            <Image src="/icons/message-programming.svg" alt="" fill sizes="20px" />
          </span>
          <span className="absolute right-[7px] top-[8px] size-1.5 rounded-full border border-[#f5f0f9] bg-red-500" />
        </button>

        <button
          type="button"
          aria-label="Notifications"
          className="relative flex size-10 items-center justify-center rounded-full hover:bg-gray-50"
        >
          <span className="relative block size-5 shrink-0">
            <Image src="/icons/notification.svg" alt="" fill sizes="20px" />
          </span>
          <span className="absolute right-[7px] top-[8px] size-1.5 rounded-full border border-[#f5f0f9] bg-red-500" />
        </button>

        <div className="flex items-center gap-2">
          <span className="relative block size-8 shrink-0 overflow-hidden rounded-full">
            <Image src="/icons/avatar-sample.jpg" alt="Madeline Price" fill className="object-cover" sizes="32px" />
          </span>
          <div className="flex flex-col items-start">
            <p className="text-xs font-semibold text-night-900">Madeline Price</p>
            <span className="rounded-full bg-gray-200 px-2 py-0.5 text-[10px] text-brand-900">Researcher</span>
          </div>
        </div>
      </div>
    </header>
  );
}
