"use client";

import { useEffect, useRef, useState } from "react";

export default function PricingSearchBar() {
  const [isRatingOpen, setIsRatingOpen] = useState(false);
  const [selectedRating, setSelectedRating] = useState("");

  const controlsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (!controlsRef.current) return;
      if (!controlsRef.current.contains(event.target as Node)) {
        setIsRatingOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <div className="mt-5 flex justify-center">
      <div className="w-full">
        <div className="mx-auto flex w-fit items-center justify-center flex-wrap gap-4 md:gap-8">
          <div ref={controlsRef} className="flex items-center gap-4 md:gap-8">
            
            {/* Min Price */}
            <div className="py-3">
              <input
                type="text"
                placeholder="Min Price GHS"
                className="w-28 bg-transparent text-sm text-gray-500 placeholder-gray-500 outline-none hover:text-gray-700 focus:text-gray-700"
              />
            </div>

            {/* Max Price */}
            <div className="py-3">
              <input
                type="text"
                placeholder="Max Price GHS"
                className="w-32 bg-transparent text-sm text-gray-500 placeholder-gray-500 outline-none hover:text-gray-700 focus:text-gray-700"
              />
            </div>

            {/* Ratings Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsRatingOpen(!isRatingOpen)}
                className={`flex items-center gap-2 border px-3 py-2 text-sm whitespace-nowrap transition-colors ${
                  isRatingOpen
                    ? "border-[#BE4D00] text-[#BE4D00]"
                    : "border-[#e6c3af] text-gray-500 hover:text-gray-700"
                }`}
              >
                <span>Ratings</span>
                <svg className={`h-4 w-4 transition-transform ${isRatingOpen ? "rotate-180" : ""}`} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 8l4 4 4-4" />
                </svg>
              </button>
              {isRatingOpen && (
                <div className="absolute left-0 top-full z-20 mt-1 w-36 border border-[#BE4D00] bg-white shadow-sm">
                  {["5 Star", "4 Star and above", "3 Star and above", "2 Star and above"].map((option) => (
                    <button
                      key={option}
                      className={`block w-full px-4 py-2 text-left text-sm ${
                        selectedRating === option
                          ? "bg-[#C05000] text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                      onClick={() => { setSelectedRating(option); setIsRatingOpen(false); }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>

          </div>

          <button
            type="button"
            className="ml-2 bg-[#b64b06] px-8 py-2.5 text-sm font-medium text-white hover:bg-[#9c4005] transition-colors whitespace-nowrap"
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
}
