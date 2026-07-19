"use client";

import Image from "next/image";
import Link from "next/link";
import { StaggerContainer, StaggerItem } from "@/components/motion/Stagger";
import { ARTISAN_PROFILES, type ArtisanProfile } from "@/lib/artisanShowcase";

function ArrowIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M7 17 17 7M9 7h8v8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArtisanCard({ artisan }: { artisan: ArtisanProfile }) {
  return (
    <StaggerItem className="flex flex-1">
      <div className="group relative flex flex-1 flex-col overflow-hidden rounded-xl bg-[#1a1a1a] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)]">
        <div className="relative h-[460px] w-full">
          <Image
            src={artisan.cardImage}
            alt={artisan.craft}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 via-50% to-transparent opacity-80" />
        </div>

        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-4 p-8">
          <div className="flex items-center gap-4">
            <div className="relative size-16 shrink-0 overflow-hidden rounded-full border-2 border-[#be4d00]">
              <Image src={artisan.avatar} alt={artisan.name} fill className="object-cover" />
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-white">{artisan.name}</h3>
              <p className="text-sm font-semibold tracking-[0.7px] text-[#be4d00]">{artisan.craft}</p>
            </div>
          </div>

          <p className="line-clamp-2 text-base text-white/60">{artisan.bio}</p>

          <Link
            href={`/services/${artisan.id}`}
            className="flex items-center justify-center gap-2 rounded-lg border border-white/20 py-3.5 text-sm font-semibold tracking-[0.7px] text-white transition-colors hover:bg-white/10"
          >
            View Portfolio
            <ArrowIcon />
          </Link>
        </div>
      </div>
    </StaggerItem>
  );
}

export default function ArtisanPortfolioGrid() {
  return (
    <section id="portfolio" className="w-full bg-white px-5 py-16 md:px-16 md:py-24">
      <StaggerContainer className="mx-auto grid max-w-[1152px] grid-cols-1 gap-6 md:grid-cols-3">
        {ARTISAN_PROFILES.map((artisan) => (
          <ArtisanCard key={artisan.id} artisan={artisan} />
        ))}
      </StaggerContainer>
    </section>
  );
}
