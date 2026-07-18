"use client";

import { motion, useReducedMotion } from "framer-motion";
import { montserrat } from "@/app/home/landing-fonts";
import type { Hotel } from "@/lib/hotels";

const EASE = [0.22, 1, 0.36, 1] as const;

const LEAVES = [
  { x: 27, y: 51, angle: -35 },
  { x: 21, y: 42, angle: -50 },
  { x: 17, y: 33, angle: -62 },
  { x: 14, y: 24, angle: -72 },
  { x: 12, y: 15, angle: -80 },
  { x: 11, y: 6, angle: -88 },
];

function LaurelIcon({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      width="36"
      height="60"
      viewBox="0 0 36 60"
      fill="none"
      className={`text-[#00261b] ${flip ? "-scale-x-100" : ""}`}
    >
      <path d="M31 57c-9-6-19-24-19-51" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      {LEAVES.map((leaf, index) => (
        <path
          key={index}
          d="M0,0 C4,-6 12,-6 16,0 C12,6 4,6 0,0 Z"
          transform={`translate(${leaf.x} ${leaf.y}) rotate(${leaf.angle})`}
          fill="currentColor"
        />
      ))}
    </svg>
  );
}

export default function HotelGuestFavorite({ hotel }: { hotel: Hotel }) {
  const shouldReduceMotion = useReducedMotion();
  const guestScore = (4.68 + hotel.rating * 0.05).toFixed(2);

  return (
    <div className="flex flex-col items-center gap-3 py-8 text-center">
      <div className="flex items-center gap-4">
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: -24, rotate: -8 }}
          whileInView={{ opacity: 1, x: 0, rotate: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <LaurelIcon />
        </motion.div>

        <motion.span
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.6 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.15, ease: EASE }}
          className={`${montserrat.className} text-[56px] font-bold text-[#00261b] md:text-[64px]`}
        >
          {guestScore}
        </motion.span>

        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: 24, rotate: 8 }}
          whileInView={{ opacity: 1, x: 0, rotate: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <LaurelIcon flip />
        </motion.div>
      </div>

      <motion.h3
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, delay: 0.3, ease: EASE }}
        className={`${montserrat.className} text-2xl font-semibold text-[#00261b]`}
      >
        Guest Favorite
      </motion.h3>
      <motion.p
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, delay: 0.38, ease: EASE }}
        className="max-w-md text-base text-[#717974]"
      >
        One of the most loved stays on Festari Estates, based on ratings, reviews, and reliability.
      </motion.p>
    </div>
  );
}
