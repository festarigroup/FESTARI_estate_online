"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import LandingNavbar from "@/app/home/components/LandingNavbar";
import HeroSelect from "@/app/home/components/HeroSelect";
import { montserrat } from "@/app/home/landing-fonts";

const PRICE_RANGES = ["Any price", "Under GHS 5,000", "GHS 5,000 – 20,000", "GHS 20,000+"];
const CATEGORIES = ["Any category", "Woodworking", "Stonemasonry", "Textile Art", "Metalwork", "Ceramics"];
const AVAILABILITY = ["Any time", "Available now", "Within 2 weeks", "Within a month"];

function FilterIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 6h16M7 12h10M10 18h4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ArtisanHero() {
  const shouldReduceMotion = useReducedMotion();
  const [location, setLocation] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [category, setCategory] = useState("");
  const [availability, setAvailability] = useState("");

  const handleFilter = () => {
    document.getElementById("portfolio")?.scrollIntoView({ behavior: shouldReduceMotion ? "auto" : "smooth" });
  };

  const fadeUp = (delay = 0) =>
    shouldReduceMotion
      ? { initial: { opacity: 1 }, animate: { opacity: 1 } }
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  return (
    <section className="relative flex min-h-[820px] w-full flex-col pb-24">
      <div className="absolute inset-0 overflow-hidden">
        <Image src="/artisans/hero.jpg" alt="Master artisan at work" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1c1b1b]/90" />
      </div>

      <LandingNavbar overlay />

      <div className="relative z-10 flex flex-1 flex-col justify-center gap-6 px-5 py-16 md:px-16">
        <motion.p {...fadeUp(0)} className="text-sm font-semibold uppercase tracking-[1.4px] text-white">
          The Artisan Guild
        </motion.p>

        <motion.h1
          {...fadeUp(0.1)}
          className={`${montserrat.className} max-w-3xl text-[42px] font-bold leading-[1.1] tracking-[-1.28px] text-white sm:text-[52px] md:text-[64px] md:leading-[80px]`}
        >
          The Hands Behind the Heritage
        </motion.h1>

        <motion.p {...fadeUp(0.2)} className="max-w-[576px] text-lg text-white/70">
          Curating the world&apos;s most distinguished makers to furnish, finish, and breathe life into every
          Festari estate.
        </motion.p>
      </div>

      <motion.div {...fadeUp(0.3)} className="relative z-10 mx-5 md:mx-16">
        <div className="rounded-[32px] border border-white/20 bg-[rgba(50,50,50,0.7)] p-2.5">
          <p className="px-6 py-3 text-2xl font-medium text-white">Find your perfect artisan</p>

          <div className="flex flex-col items-stretch gap-4 p-4 md:flex-row md:items-center">
            <label className="flex flex-1 flex-col gap-1 border-white/20 px-4 py-1 text-left md:border-r">
              <span className="text-xs font-medium uppercase tracking-[1.4px] text-white">Location</span>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Where?"
                className="bg-transparent text-base text-white placeholder:text-[#afafaf] focus:outline-none"
              />
            </label>

            <label className="flex flex-1 flex-col gap-1 border-white/20 px-4 py-1 text-left md:border-r">
              <span className="text-xs font-medium uppercase tracking-[1.4px] text-white">Price range</span>
              <HeroSelect value={priceRange} placeholder="Select price" options={PRICE_RANGES} onChange={setPriceRange} />
            </label>

            <label className="flex flex-1 flex-col gap-1 border-white/20 px-4 py-1 text-left md:border-r">
              <span className="text-xs font-medium uppercase tracking-[1.4px] text-white">Category</span>
              <HeroSelect value={category} placeholder="Any category" options={CATEGORIES} onChange={setCategory} />
            </label>

            <label className="flex flex-1 flex-col gap-1 px-4 py-1 text-left">
              <span className="text-xs font-medium uppercase tracking-[1.4px] text-white">Availability</span>
              <HeroSelect value={availability} placeholder="Any time" options={AVAILABILITY} onChange={setAvailability} />
            </label>

            <motion.button
              type="button"
              onClick={handleFilter}
              whileHover={shouldReduceMotion ? undefined : { y: -1 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
              className="flex items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-[#e2e8f0] bg-[#f8fafc] px-4 py-3.5 text-lg text-[#06090e] transition-colors hover:bg-white"
            >
              <FilterIcon />
              Filter
            </motion.button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
