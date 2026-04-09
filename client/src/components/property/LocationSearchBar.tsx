"use client";

import { useEffect, useRef, useState } from "react";

export default function LocationSearchBar() {
  const [isRegionOpen, setIsRegionOpen] = useState(false);
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [isTownOpen, setIsTownOpen] = useState(false);

  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedTown, setSelectedTown] = useState("");

  const controlsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (!controlsRef.current) return;
      if (!controlsRef.current.contains(event.target as Node)) {
        setIsRegionOpen(false);
        setIsCityOpen(false);
        setIsTownOpen(false);
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
            
            {/* Region Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsRegionOpen(!isRegionOpen);
                  setIsCityOpen(false);
                  setIsTownOpen(false);
                }}
                className="flex items-center gap-2 py-3 text-sm text-gray-500 whitespace-nowrap transition-colors hover:text-gray-700"
              >
                <span>{selectedRegion || "Region"}</span>
                <svg className={`h-3 w-3 transition-transform ${isRegionOpen ? "rotate-180" : ""}`} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 8l4 4 4-4" />
                </svg>
              </button>
              {isRegionOpen && (
                <div className="absolute left-0 top-full z-20 mt-1 w-32 border border-[#BE4D00] bg-white shadow-sm">
                  {["Greater Accra", "Ashanti", "Western"].map((option) => (
                    <button
                      key={option}
                      className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 text-gray-700"
                      onClick={() => { setSelectedRegion(option); setIsRegionOpen(false); }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* City/District Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsCityOpen(!isCityOpen);
                  setIsRegionOpen(false);
                  setIsTownOpen(false);
                }}
                className="flex items-center gap-2 py-3 text-sm text-gray-500 whitespace-nowrap transition-colors hover:text-gray-700"
              >
                <span>{selectedCity || "City/District"}</span>
                <svg className={`h-3 w-3 transition-transform ${isCityOpen ? "rotate-180" : ""}`} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 8l4 4 4-4" />
                </svg>
              </button>
              {isCityOpen && (
                <div className="absolute left-0 top-full z-20 mt-1 w-32 border border-[#BE4D00] bg-white shadow-sm">
                  {["Accra", "Tema", "Kumasi"].map((option) => (
                    <button
                      key={option}
                      className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 text-gray-700"
                      onClick={() => { setSelectedCity(option); setIsCityOpen(false); }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Town/Neighborhood Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsTownOpen(!isTownOpen);
                  setIsRegionOpen(false);
                  setIsCityOpen(false);
                }}
                className="flex items-center gap-2 py-3 text-sm text-gray-500 whitespace-nowrap transition-colors hover:text-gray-700"
              >
                <span>{selectedTown || "Town/Neighborhood"}</span>
                <svg className={`h-3 w-3 transition-transform ${isTownOpen ? "rotate-180" : ""}`} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 8l4 4 4-4" />
                </svg>
              </button>
              {isTownOpen && (
                <div className="absolute left-0 top-full z-20 mt-1 w-32 border border-[#BE4D00] bg-white shadow-sm">
                  {["Osu", "East Legon", "Cantonments"].map((option) => (
                    <button
                      key={option}
                      className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 text-gray-700"
                      onClick={() => { setSelectedTown(option); setIsTownOpen(false); }}
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
            className="ml-2 bg-[#E6BFA5] px-6 py-2 text-sm font-medium text-white hover:bg-[#d5a88c] transition-colors whitespace-nowrap"
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
}
