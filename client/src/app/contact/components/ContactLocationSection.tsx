"use client";

import { motion, useReducedMotion } from "framer-motion";
import { montserrat } from "@/app/home/landing-fonts";

const HUBS = [
  { city: "London", detail: "Mayfair District Office" },
  { city: "New York", detail: "Park Avenue Plaza" },
  { city: "Tarkwa", detail: "Regional Excellence Center" },
];

const EASE = [0.22, 1, 0.36, 1] as const;

function PinIcon() {
  return (
    <svg width="14" height="17" viewBox="0 0 24 30" fill="none" className="shrink-0 text-[#be4d00]">
      <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 18 12 18s12-9 12-18c0-6.6-5.4-12-12-12Z" fill="currentColor" />
      <circle cx="12" cy="12" r="4.5" fill="#fff" />
    </svg>
  );
}

export default function ContactLocationSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative h-[500px] w-full overflow-hidden bg-[#f0eded]">
      <svg className="absolute inset-0 h-full w-full opacity-40" viewBox="0 0 1600 500" preserveAspectRatio="none">
        <defs>
          <pattern id="contact-location-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.5" fill="#9aa39c" />
          </pattern>
        </defs>
        <rect width="1600" height="500" fill="url(#contact-location-grid)" />
        <path d="M0 320 Q400 250 800 310 T1600 270" stroke="#c0c8c3" strokeWidth="6" fill="none" />
        <path d="M300 0 Q380 220 260 500" stroke="#c0c8c3" strokeWidth="6" fill="none" />
        <path d="M1200 0 Q1120 200 1260 500" stroke="#c0c8c3" strokeWidth="6" fill="none" />
      </svg>

      <motion.div
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={
          shouldReduceMotion ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 16, delay: 0.2 }
        }
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full"
      >
        <div className="flex size-16 items-center justify-center rounded-full bg-[#be4d00]/15">
          <div className="flex size-12 items-center justify-center rounded-full bg-[#be4d00] shadow-lg">
            <svg width="20" height="24" viewBox="0 0 24 30" fill="none">
              <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 18 12 18s12-9 12-18c0-6.6-5.4-12-12-12Z" fill="#fff" />
              <circle cx="12" cy="12" r="4.5" fill="#be4d00" />
            </svg>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
        className="absolute bottom-12 left-8 flex max-w-[384px] flex-col gap-4 rounded-2xl border border-white/40 bg-white/70 p-8 shadow-[0px_25px_50px_-33px_rgba(0,0,0,0.25)] backdrop-blur-[10px] md:left-16"
      >
        <h3 className={`${montserrat.className} text-2xl font-semibold text-[#00261b]`}>Our Global Hubs</h3>
        <ul className="flex flex-col gap-4">
          {HUBS.map((hub) => (
            <li key={hub.city} className="flex items-center gap-3 text-base text-[#414944]">
              <PinIcon />
              <span>
                <span className="font-bold">{hub.city}:</span> {hub.detail}
              </span>
            </li>
          ))}
        </ul>
      </motion.div>
    </section>
  );
}
