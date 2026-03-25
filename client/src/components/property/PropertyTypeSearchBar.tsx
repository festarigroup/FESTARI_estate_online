"use client";

import { useEffect, useRef, useState } from "react";

const houseOptions = [
  "Detached",
  "Semi-Detached",
  "Townhouse",
  "Bungalow",
  "Duplex",
];

const apartmentOptions = ["Studio", "1 bedroom", "2 bedroom", "3+ bedroom"];
const roomOptions = ["Single", "Chamber &", "2 bedroom", "3+ bedroom"];

export default function PropertyTypeSearchBar() {
  const [isHouseOpen, setIsHouseOpen] = useState(false);
  const [isApartmentOpen, setIsApartmentOpen] = useState(false);
  const [isRoomOpen, setIsRoomOpen] = useState(false);
  const [selectedHouseType, setSelectedHouseType] = useState("Detached");
  const [selectedApartmentType, setSelectedApartmentType] = useState("Studio");
  const [selectedRoomType, setSelectedRoomType] = useState("Single");
  const controlsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (!controlsRef.current) {
        return;
      }

      if (!controlsRef.current.contains(event.target as Node)) {
        setIsHouseOpen(false);
        setIsApartmentOpen(false);
        setIsRoomOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div className="mt-5 flex justify-center">
      <div className="w-full">
        <div className="mx-auto flex w-fit items-center justify-center flex-wrap">
          <div ref={controlsRef} className="flex items-center">
            <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIsHouseOpen((prev) => !prev);
                setIsApartmentOpen(false);
                    setIsRoomOpen(false);
              }}
              className={`flex items-center gap-2 border px-2 py-3 text-sm whitespace-nowrap transition-colors ${
                isHouseOpen
                  ? "border-[#BE4D00] text-[#BE4D00]"
                  : "border-transparent text-gray-600"
              }`}
              aria-expanded={isHouseOpen}
              aria-haspopup="menu"
            >
              <span>House</span>
              <svg
                className={`h-3 w-3 transition-transform ${
                  isHouseOpen ? "rotate-180" : ""
                }`}
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 8l4 4 4-4" />
              </svg>
            </button>

            {isHouseOpen && (
              <div className="absolute left-0 top-full z-20 mt-1 w-32 border border-[#BE4D00] bg-white shadow-sm" role="menu">
                {houseOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      setSelectedHouseType(option);
                      setIsHouseOpen(false);
                    }}
                    className={`block w-full px-2 py-2 text-left text-sm ${
                      selectedHouseType === option
                        ? "bg-[#BE4D00] text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    role="menuitem"
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsApartmentOpen((prev) => !prev);
                  setIsHouseOpen(false);
                  setIsRoomOpen(false);
                }}
                className={`flex items-center gap-2 border px-2 py-3 text-sm whitespace-nowrap transition-colors ${
                  isApartmentOpen
                    ? "border-[#BE4D00] text-[#BE4D00]"
                    : "border-transparent text-gray-500"
                }`}
                aria-expanded={isApartmentOpen}
                aria-haspopup="menu"
              >
                <span>Apartment/flat</span>
                <svg
                  className={`h-3 w-3 transition-transform ${
                    isApartmentOpen ? "rotate-180" : ""
                  }`}
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 8l4 4 4-4" />
                </svg>
              </button>

              {isApartmentOpen && (
                <div className="absolute left-0 top-full z-20 mt-1 w-32 border border-[#BE4D00] bg-white shadow-sm" role="menu">
                  {apartmentOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        setSelectedApartmentType(option);
                        setIsApartmentOpen(false);
                      }}
                      className={`block w-full px-2 py-2 text-left text-sm ${
                        selectedApartmentType === option
                          ? "bg-[#BE4D00] text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                      role="menuitem"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsRoomOpen((prev) => !prev);
                  setIsHouseOpen(false);
                  setIsApartmentOpen(false);
                }}
                className={`flex items-center gap-2 border px-2 py-3 text-sm whitespace-nowrap transition-colors ${
                  isRoomOpen
                    ? "border-[#BE4D00] text-[#BE4D00]"
                    : "border-transparent text-gray-500"
                }`}
                aria-expanded={isRoomOpen}
                aria-haspopup="menu"
              >
                <span>Room</span>
                <svg
                  className={`h-3 w-3 transition-transform ${
                    isRoomOpen ? "rotate-180" : ""
                  }`}
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 8l4 4 4-4" />
                </svg>
              </button>

              {isRoomOpen && (
                <div className="absolute left-0 top-full z-20 mt-1 w-32 border border-[#BE4D00] bg-white shadow-sm" role="menu">
                  {roomOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        setSelectedRoomType(option);
                        setIsRoomOpen(false);
                      }}
                      className={`block w-full px-2 py-2 text-left text-sm ${
                        selectedRoomType === option
                          ? "bg-[#BE4D00] text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                      role="menuitem"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {["Land/plot", "Commercial"].map((item) => (
            <button
              key={item}
              type="button"
              className="flex items-center gap-2 px-5 py-3 text-sm text-gray-500 whitespace-nowrap transition-colors hover:text-gray-700"
            >
              <span>{item}</span>
              <svg
                className="h-3 w-3"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 8l4 4 4-4" />
              </svg>
            </button>
          ))}

          <button
            type="button"
            className="ml-2 bg-[#BE4D00] px-8 py-3 text-sm font-medium text-white hover:bg-[#a74200] transition-colors whitespace-nowrap"
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
}
