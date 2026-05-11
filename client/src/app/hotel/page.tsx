"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const hotels = [
  {
    id: 1,
    name: "Labadi Seaside Suites",
    price: "GHS 1,150",
    period: "/night",
    location: "Labadi, Accra",
    beds: "1 King Bed",
    guests: "2 Guests",
    bath: "1 Bath",
    rating: 4,
  },
  {
    id: 2,
    name: "East Legon Grand Hotel",
    price: "GHS 1,450",
    period: "/night",
    location: "East Legon, Accra",
    beds: "2 Queen Beds",
    guests: "4 Guests",
    bath: "2 Baths",
    rating: 5,
  },
  {
    id: 3,
    name: "Kumasi City Comfort Inn",
    price: "GHS 890",
    period: "/night",
    location: "Adum, Kumasi",
    beds: "1 Queen Bed",
    guests: "2 Guests",
    bath: "1 Bath",
    rating: 3,
  },
  {
    id: 4,
    name: "Takoradi Palm Residences",
    price: "GHS 1,050",
    period: "/night",
    location: "Takoradi, Western Region",
    beds: "1 King Bed",
    guests: "2 Guests",
    bath: "1 Bath",
    rating: 4,
  },
  {
    id: 5,
    name: "Cantonments Skyline Hotel",
    price: "GHS 1,680",
    period: "/night",
    location: "Cantonments, Accra",
    beds: "1 King Bed",
    guests: "2 Guests",
    bath: "1 Bath",
    rating: 5,
  },
  {
    id: 6,
    name: "Osu Boutique Stay",
    price: "GHS 980",
    period: "/night",
    location: "Osu, Accra",
    beds: "1 Queen Bed",
    guests: "2 Guests",
    bath: "1 Bath",
    rating: 4,
  },
  {
    id: 7,
    name: "Ridge Executive Suites",
    price: "GHS 1,320",
    period: "/night",
    location: "Ridge, Accra",
    beds: "2 Queen Beds",
    guests: "4 Guests",
    bath: "2 Baths",
    rating: 4,
  },
  {
    id: 8,
    name: "Airport City Inn",
    price: "GHS 1,090",
    period: "/night",
    location: "Airport City, Accra",
    beds: "1 King Bed",
    guests: "2 Guests",
    bath: "1 Bath",
    rating: 4,
  },
  {
    id: 9,
    name: "Koforidua Hillview Lodge",
    price: "GHS 760",
    period: "/night",
    location: "Koforidua, Eastern Region",
    beds: "1 Queen Bed",
    guests: "2 Guests",
    bath: "1 Bath",
    rating: 3,
  },
  {
    id: 10,
    name: "Tamale Heritage Hotel",
    price: "GHS 870",
    period: "/night",
    location: "Tamale, Northern Region",
    beds: "1 Queen Bed",
    guests: "2 Guests",
    bath: "1 Bath",
    rating: 3,
  },
  {
    id: 11,
    name: "Cape Coast Ocean Breeze",
    price: "GHS 1,020",
    period: "/night",
    location: "Cape Coast, Central Region",
    beds: "1 King Bed",
    guests: "2 Guests",
    bath: "1 Bath",
    rating: 4,
  },
  {
    id: 12,
    name: "Ho Garden Retreat",
    price: "GHS 700",
    period: "/night",
    location: "Ho, Volta Region",
    beds: "1 Double Bed",
    guests: "2 Guests",
    bath: "1 Bath",
    rating: 3,
  },
];

export default function HotelPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 8;
  const totalPages = Math.ceil(hotels.length / cardsPerPage);
  const startIndex = (currentPage - 1) * cardsPerPage;
  const paginatedHotels = hotels.slice(startIndex, startIndex + cardsPerPage);

  return (
    <section className="w-full px-4 py-6 md:px-4">
      <div className="relative h-[clamp(360px,44vw,720px)] w-full overflow-hidden">
        <img
          src="/HotelHeroSection.jpg"
          alt="Hotel hero section"
          className="h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/35" />

        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4 text-center text-white">
          <h1 className="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
            Discover the perfect place
            <br />
            to call home
          </h1>
          <p className="mt-2 max-w-2xl text-xs text-white/90 sm:text-sm md:text-base">
            Browse and book the best guesthouses and hotels.
            <br />
            Find the perfect stay for any trip with ease.
          </p>
        </div>

        <div className="absolute bottom-4 left-4 z-20 sm:bottom-6 sm:left-6 md:bottom-8 md:left-8">
          <p className="max-w-[125px] text-[9px] leading-tight text-white/90 sm:max-w-[150px] sm:text-[10px] md:max-w-[170px] md:text-xs">
            Start your journey towards home ownership today!
          </p>
          <button
            type="button"
            className="mt-2 bg-[#BE4D00] px-3 py-1.5 text-[10px] font-semibold text-white sm:text-[11px]"
          >
            List property
          </button>
        </div>

        <div className="absolute bottom-4 right-4 z-20 flex flex-col gap-1 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8">
          <span className="inline-flex items-center border border-[#E2AE8A] bg-black/25 px-2 py-1 text-[9px] text-white sm:text-[10px] md:text-[11px]">
            Modern home
          </span>
          <div className="flex gap-1">
            <span className="border border-[#E2AE8A] bg-black/25 px-2 py-1 text-[9px] text-white sm:text-[10px] md:text-[11px]">
              Luxury
            </span>
            <span className="border border-[#E2AE8A] bg-black/25 px-2 py-1 text-[9px] text-white sm:text-[10px] md:text-[11px]">
              Eco-friendly
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col items-center text-center">
        <h2 className="text-3xl font-bold">Guest Favorites</h2>

        <div className="mt-3 inline-flex items-center gap-6 border border-[#BE4D00] px-4 py-2">
          <button className="text-sm text-gray-600">Property</button>
          <button className="text-sm text-gray-600">Location</button>
          <button className="text-sm text-gray-600">Pricing</button>

          <button
            type="button"
            aria-label="Open filters"
            className="ml-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#BE4D00] text-white"
          >
            <svg
              className="h-3 w-3"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 5h18l-7 8v6l-4-2v-4L3 5z"
              />
            </svg>
          </button>
        </div>

        <p className="mt-2 font-bold text-lg text-gray-600">Homes selected just for you</p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {paginatedHotels.map((hotel) => (
          <article
            key={hotel.id}
            role="button"
            tabIndex={0}
            onClick={() => router.push(`/hotel/${hotel.id}`)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                router.push(`/hotel/${hotel.id}`);
              }
            }}
            className="group cursor-pointer overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-xl"
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src="/HotelHeroSection.jpg"
                alt={hotel.name}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />

              <div className="absolute left-3 top-3 flex items-center gap-1 rounded-sm px-2 py-1">
                {Array.from({ length: 5 }).map((_, index) => (
                  <svg
                    key={index}
                    className="h-3 w-3"
                    viewBox="0 0 20 20"
                    fill={index < hotel.rating ? "#000000" : "#F8F8F8"}
                    aria-hidden="true"
                  >
                    <path d="M10 1.5l2.5 5.1 5.6.8-4 3.9.9 5.6L10 14.2 5 16.9l.9-5.6-4-3.9 5.6-.8L10 1.5z" />
                  </svg>
                ))}
              </div>

              <button
                type="button"
                className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/85 text-gray-400 shadow-sm transition-colors hover:bg-white hover:text-red-500"
                aria-label="Add to favorites"
              >
                <svg
                  className="h-4 w-4"
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

            <div className="p-4">
              <p className="text-xl font-bold text-gray-900">
                {hotel.price}
                <span className="text-sm font-normal text-gray-500">{hotel.period}</span>
              </p>

              <p className="mt-1 line-clamp-2 text-sm text-gray-700 transition-colors group-hover:text-gray-900">
                {hotel.name}
              </p>

              <p className="mb-4 mt-1 flex items-center gap-1 text-xs text-gray-500">
                <svg
                  className="h-3 w-3"
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
                {hotel.location}
              </p>

              <div className="flex items-center justify-between border-t border-gray-100 pt-3 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <span>🛏️</span>
                  <span>{hotel.beds}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>👤</span>
                  <span>{hotel.guests}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>🚿</span>
                  <span>{hotel.bath}</span>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-10 flex items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="flex h-9 w-9 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Previous page"
        >
          <svg
            className="h-4 w-4"
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

        {Array.from({ length: totalPages }).map((_, index) => {
          const page = index + 1;

          return (
            <button
              key={page}
              type="button"
              onClick={() => setCurrentPage(page)}
              className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                currentPage === page
                  ? "bg-[#BE4D00] text-white"
                  : "border border-gray-300 text-gray-700 hover:bg-gray-100"
              }`}
            >
              {page}
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="flex h-9 w-9 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Next page"
        >
          <svg
            className="h-4 w-4"
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
    </section>
  );
}
