"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { montserrat } from "@/app/home/landing-fonts";

type Property = {
  id: number;
  image: string;
  price: number;
  name: string;
  beds: number;
  baths: number;
  area: string;
};

const PROPERTIES: Property[] = [
  { id: 1, image: "/property/azure-cliffside-villa.jpg", price: 42_000_000, name: "Azure Cliffside Villa", beds: 5, baths: 2, area: "285m²" },
  { id: 4, image: "/property/skyloft-penthouse.jpg", price: 51_000_000, name: "Skyloft Penthouse", beds: 4, baths: 3, area: "220m²" },
  { id: 6, image: "/property/alpine-lake-retreat.jpg", price: 39_000_000, name: "Alpine Lake Retreat", beds: 5, baths: 4, area: "310m²" },
  { id: 2, image: "/landing/sandstone-valleys.jpg", price: 65_000_000, name: "The Sandstone Valleys", beds: 8, baths: 12, area: "1,150m²" },
  { id: 5, image: "/landing/chelsea-heights.jpg", price: 48_000_000, name: "Chelsea Heights Penthouse", beds: 3, baths: 2, area: "195m²" },
  { id: 7, image: "/landing/uluwatu-villa.jpg", price: 33_000_000, name: "Uluwatu Cliffside Villa", beds: 4, baths: 5, area: "420m²" },
];

const STATS = [
  { label: "Rent Home", value: "6,675+" },
  { label: "State", value: "25+" },
  { label: "Buy Home", value: "2,050+" },
  { label: "Agents", value: "300+" },
];

const SORTS = ["Featured", "Price: Low to High", "Price: High to Low"] as const;

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

function AreaIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path
        d="M3 3h7v7H3V3ZM14 14h7v7h-7v-7Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function formatGHS(value: number) {
  return `GHS ${value.toLocaleString("en-US")}`;
}

function PropertyCard({ property }: { property: Property }) {
  return (
    <Link
      href={`/property/${property.id}`}
      className="group flex flex-1 flex-col gap-6 rounded-[32px] border border-black/10 bg-white/40 p-4"
    >
      <div className="relative h-[300px] w-full overflow-hidden rounded-2xl md:h-[380px]">
        <Image
          src={property.image}
          alt={property.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute bottom-6 right-6 rounded-full bg-white/90 px-4 py-2 text-sm font-bold text-[#0f1621] backdrop-blur-md">
          {formatGHS(property.price)}
        </span>
      </div>
      <div className="flex flex-col gap-4 px-2">
        <h3 className="text-base font-semibold uppercase text-[#0f1621]">{property.name}</h3>
        <div className="flex items-center gap-6 text-sm text-[#414944]">
          <span className="flex items-center gap-1.5">
            <BedIcon />
            {property.beds}
          </span>
          <span className="flex items-center gap-1.5">
            <BathIcon />
            {property.baths}
          </span>
          <span className="flex items-center gap-1.5">
            <AreaIcon />
            {property.area}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function PropertyListingsGrid() {
  const [sort, setSort] = useState<(typeof SORTS)[number]>("Featured");
  const [sortMenuOpen, setSortMenuOpen] = useState(false);

  const sortedProperties = useMemo(() => {
    if (sort === "Price: Low to High") return [...PROPERTIES].sort((a, b) => a.price - b.price);
    if (sort === "Price: High to Low") return [...PROPERTIES].sort((a, b) => b.price - a.price);
    return PROPERTIES;
  }, [sort]);

  return (
    <section id="listings" className="w-full bg-white px-8 py-16 md:py-24">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-16">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="flex max-w-[672px] flex-col gap-4">
            <h2 className={`${montserrat.className} text-[32px] font-semibold text-[#00261b] md:text-[40px]`}>
              Best Residence From Us For You
            </h2>
            <p className="text-base text-[#414944]">
              Real estate is property consisting of land and the buildings on it, along with its natural resources
              such as crops, minerals, or water.
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
                    onClick={() => {
                      setSort(option);
                      setSortMenuOpen(false);
                    }}
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
          {sortedProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>

        <div className="flex items-center justify-center gap-2" aria-hidden="true">
          <span className="flex size-12 items-center justify-center rounded-full border border-[#c0c8c3] text-[#414944]">
            <svg width="8" height="12" viewBox="0 0 8 12" fill="none">
              <path d="M7 1 1 6l6 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          {[1, 2, 3].map((page) => (
            <span
              key={page}
              className={`flex size-12 items-center justify-center rounded-full text-base font-bold ${
                page === 1 ? "bg-[#00261b] text-white" : "border border-[#c0c8c3] text-[#414944]"
              }`}
            >
              {page}
            </span>
          ))}
          <span className="flex size-12 items-center justify-center rounded-full border border-[#c0c8c3] text-[#414944]">
            <svg width="8" height="12" viewBox="0 0 8 12" fill="none">
              <path d="M1 1l6 5-6 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
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
