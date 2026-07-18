"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { formatNightlyRate, type Hotel } from "@/lib/hotels";

const GUEST_COUNTS = ["1 Guest", "2 Guests", "3 Guests", "4+ Guests"];

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 20 20" fill={filled ? "#fed65b" : "rgba(11,61,46,0.15)"}>
      <path d="M10 1.5l2.5 5.1 5.6.8-4 3.9.9 5.6L10 14.2l-5 2.7.9-5.6-4-3.9 5.6-.8L10 1.5z" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-[#717974]">
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const FIELD_CLASSNAME =
  "w-full rounded-xl border border-[#c0c8c3] bg-[#f8fafc] px-3 py-3 text-sm text-[#0f1621] transition-colors [color-scheme:light] hover:border-[#be4d00]/50 focus:border-[#be4d00] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#be4d00]/15";

export default function HotelBookingCard({ hotel }: { hotel: Hotel }) {
  const shouldReduceMotion = useReducedMotion();
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(GUEST_COUNTS[1]);

  return (
    <motion.div
      whileHover={shouldReduceMotion ? undefined : { y: -2 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col gap-6 rounded-[24px] border border-[rgba(89,112,97,0.2)] bg-white p-8"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-2xl font-bold text-[#00261b]">
            {formatNightlyRate(hotel.pricePerNight)}
            <span className="text-sm font-normal text-[#717974]">/night</span>
          </p>
          <p className="mt-1 text-sm text-[#717974]">{hotel.location}</p>
        </div>
        <span className="flex items-center gap-1 rounded-full bg-[rgba(11,61,46,0.06)] px-3 py-1.5">
          {Array.from({ length: 5 }).map((_, index) => (
            <StarIcon key={index} filled={index < hotel.rating} />
          ))}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-[0.7px] text-[#717974]">Check-in</span>
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className={FIELD_CLASSNAME}
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-[0.7px] text-[#717974]">Check-out</span>
          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className={FIELD_CLASSNAME}
          />
        </label>
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-semibold uppercase tracking-[0.7px] text-[#717974]">Guests</span>
        <div className="relative">
          <select
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            className={`${FIELD_CLASSNAME} appearance-none pr-9`}
          >
            {GUEST_COUNTS.map((count) => (
              <option key={count} value={count}>
                {count}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
            <ChevronDownIcon />
          </span>
        </div>
      </label>

      <Link
        href={`/hotel/${hotel.id}/reserve`}
        className="flex items-center justify-center rounded-xl bg-[#be4d00] px-6 py-4 text-base font-semibold text-white transition-colors hover:bg-[#a54300]"
      >
        Check availability
      </Link>
    </motion.div>
  );
}
