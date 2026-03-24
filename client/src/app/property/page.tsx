"use client";

import { useState } from "react";

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

  const filtered = properties.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "All" || p.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div>
      {/* Property Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map((property) => (
          <div
            key={property.id}
            id={`property-card-${property.id}`}
            className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 bg-white group"
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

              {/* Type badge */}
              <div className="absolute top-3 left-3">
                <span
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                    property.type === "Sale"
                      ? "bg-emerald-500 text-white"
                      : "bg-sky-500 text-white"
                  }`}
                >
                  For {property.type}
                </span>
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
                <p className="text-xl font-bold text-gray-900">
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
          </div>
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
