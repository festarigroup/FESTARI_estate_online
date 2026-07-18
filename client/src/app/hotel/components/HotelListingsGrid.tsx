"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { montserrat } from "@/app/home/landing-fonts";
import { HOTELS, formatNightlyRate, type Hotel } from "@/lib/hotels";

const STATS = [
  { label: "Hotels", value: "12+" },
  { label: "Regions", value: "10+" },
  { label: "Guests Hosted", value: "8,400+" },
  { label: "Avg. Rating", value: "4.2★" },
];

const SORTS = ["Featured", "Price: Low to High", "Price: High to Low"] as const;
const HOTELS_PER_PAGE = 8;

function BedIcon() {
  return (
    <svg width="16" height="12" viewBox="0 0 24 18" fill="none">
      <path
        d="M2 16V4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12M2 16h20M2 16v1M22 16v1M6 8h4a1 1 0 0 1 1 1v2H5V9a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GuestIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12Zm0 2.4c-3.5 0-9.9 1.9-9.9 5.6v1.8h19.8v-1.8c0-3.7-6.4-5.6-9.9-5.6Z"
        fill="currentColor"
      />
    </svg>
  );
}

function BathIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 12h16v3a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-3ZM7 12V6a2 2 0 0 1 3.6-1.2M4 19v1M18 19v1"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg width="12" height="14" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2C7.6 2 4 5.6 4 10c0 5.6 6.6 11.3 7 11.6.3.3.7.3 1 0 .4-.3 7-6 7-11.6 0-4.4-3.6-8-8-8Zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z"
        fill="currentColor"
      />
    </svg>
  );
}

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="12" height="12" viewBox="0 0 20 20" fill={filled ? "#fed65b" : "rgba(255,255,255,0.3)"}>
      <path d="M10 1.5l2.5 5.1 5.6.8-4 3.9.9 5.6L10 14.2l-5 2.7.9-5.6-4-3.9 5.6-.8L10 1.5z" />
    </svg>
  );
}

function HotelCard({ hotel }: { hotel: Hotel }) {
  return (
    <Link
      href={`/hotel/${hotel.id}`}
      className="group flex flex-1 flex-col gap-6 rounded-[32px] border border-black/10 bg-white/40 p-4"
    >
      <div className="relative h-[300px] w-full overflow-hidden rounded-2xl md:h-[380px]">
        <Image
          src={hotel.heroImage}
          alt={hotel.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute left-4 top-4 flex items-center gap-0.5 rounded-full bg-black/30 px-3 py-1.5 backdrop-blur-md">
          {Array.from({ length: 5 }).map((_, index) => (
            <StarIcon key={index} filled={index < hotel.rating} />
          ))}
        </span>
        <span className="absolute bottom-6 right-6 rounded-full bg-white/90 px-4 py-2 text-sm font-bold text-[#0f1621] backdrop-blur-md">
          {formatNightlyRate(hotel.pricePerNight)}
          <span className="font-normal text-[#717974]">/night</span>
        </span>
      </div>
      <div className="flex flex-col gap-4 px-2">
        <h3 className="text-base font-semibold uppercase text-[#0f1621]">{hotel.name}</h3>
        <p className="flex items-center gap-1.5 text-sm text-[#717974]">
          <PinIcon />
          {hotel.location}
        </p>
        <div className="flex items-center gap-6 text-sm text-[#414944]">
          <span className="flex items-center gap-1.5">
            <BedIcon />
            {hotel.beds}
          </span>
          <span className="flex items-center gap-1.5">
            <GuestIcon />
            {hotel.guests}
          </span>
          <span className="flex items-center gap-1.5">
            <BathIcon />
            {hotel.baths}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function HotelListingsGrid() {
  const [sort, setSort] = useState<(typeof SORTS)[number]>("Featured");
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const sortedHotels = useMemo(() => {
    if (sort === "Price: Low to High") return [...HOTELS].sort((a, b) => a.pricePerNight - b.pricePerNight);
    if (sort === "Price: High to Low") return [...HOTELS].sort((a, b) => b.pricePerNight - a.pricePerNight);
    return HOTELS;
  }, [sort]);

  const totalPages = Math.ceil(sortedHotels.length / HOTELS_PER_PAGE);
  const startIndex = (currentPage - 1) * HOTELS_PER_PAGE;
  const paginatedHotels = sortedHotels.slice(startIndex, startIndex + HOTELS_PER_PAGE);

  const changeSort = (option: (typeof SORTS)[number]) => {
    setSort(option);
    setSortMenuOpen(false);
    setCurrentPage(1);
  };

  return (
    <section id="listings" className="w-full bg-white px-8 py-16 md:py-24">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-16">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="flex max-w-[672px] flex-col gap-4">
            <h2 className={`${montserrat.className} text-[32px] font-semibold text-[#00261b] md:text-[40px]`}>
              Best Stays From Us For You
            </h2>
            <p className="text-base text-[#414944]">
              From beachfront suites to city-grand hotels, discover curated stays vetted for comfort, service, and
              quiet luxury.
            </p>
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setSortMenuOpen((v) => !v)}
              className="flex items-center gap-2 rounded-full border border-[#c0c8c3] px-7 py-3 text-lg font-medium tracking-[0.7px] text-[#1c1b1b]"
            >
              Sort by: {sort}
              <svg width="10" height="7" viewBox="0 0 10 7" fill="none">
                <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {sortMenuOpen && (
              <div className="absolute right-0 top-[calc(100%+8px)] z-10 min-w-[220px] overflow-hidden rounded-2xl border border-[#e5e2e1] bg-white py-2 shadow-xl">
                {SORTS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => changeSort(option)}
                    className={`block w-full px-4 py-2.5 text-left text-sm ${
                      option === sort ? "bg-[#be4d00]/10 text-[#be4d00]" : "text-[#414944] hover:bg-[#f6f3f2]"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {paginatedHotels.map((hotel) => (
            <HotelCard key={hotel.id} hotel={hotel} />
          ))}
        </div>

        <div className="flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            aria-label="Previous page"
            className="flex size-12 items-center justify-center rounded-full border border-[#c0c8c3] text-[#414944] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <svg width="8" height="12" viewBox="0 0 8 12" fill="none">
              <path d="M7 1 1 6l6 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => setCurrentPage(page)}
              className={`flex size-12 items-center justify-center rounded-full text-base font-bold transition-colors ${
                page === currentPage ? "bg-[#00261b] text-white" : "border border-[#c0c8c3] text-[#414944] hover:bg-[#f6f3f2]"
              }`}
            >
              {page}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            aria-label="Next page"
            className="flex size-12 items-center justify-center rounded-full border border-[#c0c8c3] text-[#414944] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <svg width="8" height="12" viewBox="0 0 8 12" fill="none">
              <path d="M1 1l6 5-6 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-8 border-t border-[#c0c8c3]/30 pt-8 sm:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="flex flex-col gap-2">
              <p className="text-sm font-medium text-[#414944]">{stat.label}</p>
              <p className={`${montserrat.className} text-[28px] font-bold text-[#00261b] md:text-[36px]`}>{stat.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
