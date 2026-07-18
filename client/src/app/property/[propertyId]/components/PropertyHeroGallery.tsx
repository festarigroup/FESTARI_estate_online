"use client";

import Image from "next/image";
import { montserrat } from "@/app/home/landing-fonts";
import type { Property } from "@/lib/properties";

function PinIcon() {
  return (
    <svg width="14" height="17" viewBox="0 0 24 30" fill="none">
      <path
        d="M12 0C5.4 0 0 5.4 0 12c0 9 12 18 12 18s12-9 12-18c0-6.6-5.4-12-12-12Z"
        fill="#fff"
      />
      <circle cx="12" cy="12" r="4.5" fill="#00261b" />
    </svg>
  );
}

function CameraIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="13.5" r="3.5" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export default function PropertyHeroGallery({ property }: { property: Property }) {
  return (
    <div className="grid h-[600px] w-full grid-cols-3 gap-3 overflow-hidden rounded-[24px]">
      <div className="relative col-span-2 h-full overflow-hidden rounded-[24px]">
        <Image src={property.heroImage} alt={property.name} fill priority className="object-cover" sizes="66vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        <div className="absolute bottom-6 left-6 max-w-[520px] rounded-2xl bg-[rgba(0,0,0,0.4)] p-6 backdrop-blur-[6px]">
          <span className="inline-block rounded-full bg-[#fed65b] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.7px] text-[#745c00]">
            {property.tag}
          </span>
          <h1
            className={`${montserrat.className} mt-3 text-[32px] font-semibold leading-tight text-white md:text-[40px]`}
          >
            {property.name}
          </h1>
          <div className="mt-3 flex items-center gap-2 text-sm text-white/90">
            <PinIcon />
            {property.location}
          </div>
        </div>
      </div>

      <div className="flex h-full flex-col gap-3">
        <div className="relative h-full flex-1 overflow-hidden rounded-[24px]">
          <Image src={property.galleryImages[0]} alt={`${property.name} bedroom`} fill className="object-cover" sizes="33vw" />
        </div>

        <div className="group relative h-full flex-1 overflow-hidden rounded-[24px]">
          <Image src={property.galleryImages[1]} alt={`${property.name} bathroom`} fill className="object-cover" sizes="33vw" />
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <button
              type="button"
              className="flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#00261b] shadow-lg"
            >
              <CameraIcon />
              View 42 Photos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
