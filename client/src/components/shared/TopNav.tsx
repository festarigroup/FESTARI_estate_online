"use client";

import Image from "next/image";

export function TopNav() {
  return (
    <header className="flex h-[67px] shrink-0 items-center justify-between gap-2 border-b border-gray-200 bg-white px-[15px] py-2 sm:px-[23px]">
      <div className="flex min-w-0 flex-1 items-center gap-[15px] md:gap-[38px] lg:gap-[57px] 3xl:gap-[109px] 3xl:flex-initial">
        <div className="relative h-[36px] w-[72px] shrink-0">
          <Image src="/icons/logo-biltlinx.png" alt="Biltlinx" fill className="object-contain" sizes="72px" priority />
        </div>

        <div className="hidden h-[46px] min-w-0 flex-1 items-center gap-2 rounded-lg border border-gray-200 bg-white px-[11px] py-[13px] sm:flex sm:max-w-[350px]">
          <span className="relative block size-[15px] shrink-0">
            <Image src="/icons/search.svg" alt="" fill sizes="15px" />
          </span>
          <span className="truncate text-[13px] text-gray-500">Search anything</span>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1 py-1 sm:gap-2 sm:px-2">
        <button
          type="button"
          aria-label="Search"
          className="relative flex size-[38px] items-center justify-center rounded-full hover:bg-gray-50 sm:hidden"
        >
          <span className="relative block size-[19px] shrink-0">
            <Image src="/icons/search.svg" alt="" fill sizes="19px" />
          </span>
        </button>

        <button
          type="button"
          className="flex h-[38px] items-center justify-center gap-2 rounded-lg bg-brand-600 px-[11px] text-[13px] text-white hover:bg-brand-600/90 sm:w-[93px] sm:p-[15px]"
        >
          <span className="relative block size-[19px] shrink-0">
            <Image src="/icons/add-alt.svg" alt="" fill sizes="19px" />
          </span>
          <span className="hidden sm:inline">Create</span>
        </button>

        <button
          type="button"
          aria-label="Messages"
          className="relative flex size-[38px] shrink-0 items-center justify-center rounded-full hover:bg-gray-50"
        >
          <span className="relative block size-[19px] shrink-0">
            <Image src="/icons/message-programming.svg" alt="" fill sizes="19px" />
          </span>
          <span className="absolute right-[7px] top-[8px] size-1.5 rounded-full border border-[#f5f0f9] bg-red-500" />
        </button>

        <button
          type="button"
          aria-label="Notifications"
          className="relative flex size-[38px] shrink-0 items-center justify-center rounded-full hover:bg-gray-50"
        >
          <span className="relative block size-[19px] shrink-0">
            <Image src="/icons/notification.svg" alt="" fill sizes="19px" />
          </span>
          <span className="absolute right-[7px] top-[8px] size-1.5 rounded-full border border-[#f5f0f9] bg-red-500" />
        </button>

        <div className="flex items-center gap-2">
          <span className="relative block size-[30px] shrink-0 overflow-hidden rounded-full">
            <Image src="/icons/avatar-sample.jpg" alt="Madeline Price" fill className="object-cover" sizes="30px" />
          </span>
          <div className="hidden flex-col items-start md:flex">
            <p className="text-[11px] font-semibold text-night-900">Madeline Price</p>
            <span className="rounded-full bg-gray-200 px-2 py-0.5 text-[9.5px] text-brand-900">Researcher</span>
          </div>
        </div>
      </div>
    </header>
  );
}
