"use client";

import { useState } from "react";
import Link from "next/link";
import PropertyTypeSearchBar from "@/components/property/PropertyTypeSearchBar";
import LocationSearchBar from "@/components/property/LocationSearchBar";
import PricingSearchBar from "@/components/property/PricingSearchBar";
const properties = [
  {
    id: 1,
    price: "GHS 2,400",
    period: "/month",
    title: "Large 4-room apartment with a beautiful terrace",
    location: "Airport Residential, Accra",
    beds: "King Size Bed",
    persons: "1-2 Persons",
    bath: "Bath1",
    type: "Rent",
  },
  {
    id: 2,
    price: "GHS 850,000",
    period: "",
    title: "Modern 3-bedroom detached house with garden",
    location: "East Legon, Accra",
    beds: "3 Beds",
    persons: "4-6 Persons",
    bath: "2 Baths",
    type: "Sale",
  },
  {
    id: 3,
    price: "GHS 1,800",
    period: "/month",
    title: "Cozy studio apartment near the city center",
    location: "Osu, Accra",
    beds: "Single Bed",
    persons: "1 Person",
    bath: "1 Bath",
    type: "Rent",
  },
  {
    id: 4,
    price: "GHS 3,200",
    period: "/month",
    title: "Spacious penthouse with panoramic city views",
    location: "Ridge, Accra",
    beds: "2 Beds",
    persons: "2-4 Persons",
    bath: "2 Baths",
    type: "Rent",
  },
  {
    id: 5,
    price: "GHS 450,000",
    period: "",
    title: "Newly built 2-bedroom semi-detached house",
    location: "Tarkwa, Western Region",
    beds: "2 Beds",
    persons: "2-4 Persons",
    bath: "2 Baths",
    type: "Sale",
  },
  {
    id: 6,
    price: "GHS 5,500",
    period: "/month",
    title: "Executive 5-bedroom villa with swimming pool",
    location: "Cantonments, Accra",
    beds: "5 Beds",
    persons: "6+ Persons",
    bath: "4 Baths",
    type: "Rent",
  },
  {
    id: 7,
    price: "GHS 1,200,000",
    period: "",
    title: "Commercial property ideal for office space",
    location: "Kumasi City Centre",
    beds: "Open Plan",
    persons: "Corporate",
    bath: "3 Baths",
    type: "Sale",
  },
  {
    id: 8,
    price: "GHS 2,000",
    period: "/month",
    title: "Furnished 2-bed apartment with 24hr security",
    location: "Takoradi, Western Region",
    beds: "2 Beds",
    persons: "2-3 Persons",
    bath: "1 Bath",
    type: "Rent",
  },
];

const mapPins = [
  { id: 1, label: "GHS 2,400", top: "30%", left: "25%" },
  { id: 2, label: "GHS 850K", top: "22%", left: "60%" },
  { id: 3, label: "GHS 1,800", top: "50%", left: "40%" },
  { id: 4, label: "GHS 3,200", top: "40%", left: "72%" },
  { id: 5, label: "GHS 450K", top: "65%", left: "30%" },
  { id: 6, label: "GHS 5,500", top: "55%", left: "65%" },
];

export default function PropertyPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [activeFilterTab, setActiveFilterTab] = useState<string | null>(null);

  const filtered = properties.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "All" || p.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="flex flex-col p-4">
      {/* Hero Banner */}
      <div className="relative -mt-2 pt-3 md:-mt-3">
        <div className="relative h-[clamp(320px,46vw,700px)]">
          <p className="absolute left-1/2 top-[clamp(1.2rem,3.2vw,2.8rem)] z-20 -translate-x-1/2 text-[11px] leading-none sm:text-xs md:text-sm">
            Transforming the future of home living
          </p>
          <h2 className="absolute inset-x-0 top-[clamp(1.75rem,4.1vw,3.75rem)] z-0 w-full text-center text-[clamp(4.2rem,14vw,11.3rem)] font-black uppercase text-[#BE4D00]">
            Property
          </h2>
          <div className="absolute inset-x-0 bottom-[-2.5rem] z-10 flex justify-center">
            <img
              src="/PropertyHeroSection.png"
              alt="Modern property building"
              className="pointer-events-none h-[clamp(240px,46vw,735px)] w-auto"
            />
          </div>
          <div className="absolute left-4 top-[225px] z-20 sm:left-8 sm:top-[245px] md:left-20 md:top-[305px] lg:left-24 lg:top-[370px] xl:left-32 xl:top-[445px] 2xl:left-44 2xl:top-[520px]">
            <p className="max-w-[120px] text-[10px] leading-tight text-gray-500 sm:max-w-[135px] sm:text-[11px] md:max-w-[148px] md:text-[12px]">
              Start your journey towards home ownership today!
            </p>
            <button
              type="button"
              className="mt-2 bg-[#BE4D00] px-3 py-1.5 text-[10px] font-semibold text-white sm:px-3.5 sm:py-1.5 sm:text-[11px] md:text-[12px]"
            >
              List property
            </button>
          </div>
          <div className="absolute right-3 top-[225px] z-20 flex flex-col gap-1 sm:right-8 sm:top-[245px] md:right-20 md:top-[305px] lg:right-24 lg:top-[370px] xl:right-32 xl:top-[445px] 2xl:right-44 2xl:top-[520px]">
            <span className="inline-flex items-center border border-[#E2AE8A] bg-white/90 px-3 py-1.5 text-[10px] text-gray-500 sm:text-[11px] md:text-[12px]">
              Modern home
            </span>
            <div className="flex gap-1">
              <span className="border border-[#E2AE8A] bg-white/90 px-3 py-1.5 text-[10px] text-gray-500 sm:text-[11px] md:text-[12px]">Luxury</span>
              <span className="border border-[#E2AE8A] bg-white/90 px-3 py-1.5 text-[10px] text-gray-500 sm:text-[11px] md:text-[12px]">Eco-friendly</span>
            </div>
          </div>
        </div>
      </div>

      {/* Intro Text */}
      <h1 className="text-center text-5xl font-bold text-gray-800">Featured Properties</h1>

      {/* Filter Strip */}
      <div className="mt-6 flex justify-center">
        <div className="inline-flex items-center gap-8 border border-[#D06A2C] px-5 py-2.5">
          <button 
            onClick={() => setActiveFilterTab(activeFilterTab === "Property" ? null : "Property")}
            className={`text-sm transition-colors ${activeFilterTab === "Property" ? "text-[#BE4D00] font-medium" : "text-gray-600 hover:text-[#BE4D00]"}`}
          >
            Property
          </button>
          <button 
            onClick={() => setActiveFilterTab(activeFilterTab === "Location" ? null : "Location")}
            className={`text-sm transition-colors ${activeFilterTab === "Location" ? "text-[#BE4D00] font-medium" : "text-gray-600 hover:text-[#BE4D00]"}`}
          >
            Location
          </button>
          <button 
            onClick={() => setActiveFilterTab(activeFilterTab === "Pricing" ? null : "Pricing")}
            className={`text-sm transition-colors ${activeFilterTab === "Pricing" ? "text-[#BE4D00] font-medium" : "text-gray-600 hover:text-[#BE4D00]"}`}
          >
            Pricing
          </button>
          <button
            type="button"
            aria-label="Open filters"
            className="ml-1 h-8 w-8 rounded-full bg-[#BE4D00] text-white flex items-center justify-center"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h18l-7 8v6l-4-2v-4L3 5z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Search Bars */}
      {activeFilterTab === "Property" && <PropertyTypeSearchBar />}
      {activeFilterTab === "Location" && <LocationSearchBar />}
      {activeFilterTab === "Pricing" && <PricingSearchBar />}

      <h3 className="text-3xl text-center mt-10">Homes selected just for you</h3>

      {/* Property Cards Grid */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        {filtered.map((property) => (
          <Link
            key={property.id}
            href={`/property/${property.id}`}
            id={`property-card-${property.id}`}
            className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 bg-white group block"
          >
            {/* Image Placeholder */}
            <div className="h-48 bg-gray-200 flex items-center justify-center relative overflow-hidden">
              <div className="text-gray-400 flex flex-col items-center gap-1">
                <svg
                  className="w-10 h-10"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-xs">No image</span>
              </div>

              {/* Rating badge */}
              <div className="absolute top-3 left-3 flex items-center gap-1  px-2 py-1 rounded-sm">
                {Array.from({ length: 5 }).map((_, index) => (
                  <svg
                    key={index}
                    className="w-3 h-3"
                    viewBox="0 0 20 20"
                    fill={index < 3 ? "#163958" : "#F8F8F8"}
                    aria-hidden="true"
                  >
                    <path d="M10 1.5l2.5 5.1 5.6.8-4 3.9.9 5.6L10 14.2 5 16.9l.9-5.6-4-3.9 5.6-.8L10 1.5z" />
                  </svg>
                ))}
              </div>

              {/* Favorite button */}
              <button
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center hover:bg-white text-gray-400 hover:text-red-500 transition-colors shadow-sm"
                aria-label="Add to favorites"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </button>
            </div>

            {/* Card Content */}
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <p className="text-base font-bold text-gray-900">
                  {property.price}
                  {property.period && (
                    <span className="text-sm font-normal text-gray-500">
                      {property.period}
                    </span>
                  )}
                </p>
              </div>

              <p className="text-gray-700 text-sm mb-1 line-clamp-2 group-hover:text-gray-900 transition-colors">
                {property.title}
              </p>
              <p className="text-gray-500 text-xs mb-4 flex items-center gap-1">
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {property.location}
              </p>

              <div className="flex justify-between items-center text-gray-500 text-xs pt-3 border-t border-gray-100">
                <div className="flex items-center gap-1">
                  <span>🛏️</span>
                  <span>{property.beds}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>👤</span>
                  <span>{property.persons}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>🚿</span>
                  <span>{property.bath}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* No Results */}
      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">
            No properties match your search.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setFilterType("All");
            }}
            className="mt-4 text-[#BE4D00] font-medium hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-12">
        <button className="w-9 h-9 flex items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 transition-colors rounded-l-md">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        {[1, 2, 3, 4, 5].map((page) => (
          <button
            key={page}
            className={`w-9 h-9 flex items-center justify-center rounded-full text-sm font-medium transition-colors  ${
              page === 1
                ? "bg-[#BE4D00] text-white"
                : "border border-gray-300 text-gray-700 hover:bg-gray-100"
            }`}
          >
            {page}
          </button>
        ))}
        <button className="w-9 h-9 flex items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 transition-colors rounded-l-md">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
