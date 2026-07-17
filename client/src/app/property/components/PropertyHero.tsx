"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import LandingNavbar from "@/app/home/components/LandingNavbar";
import HeroSelect from "@/app/home/components/HeroSelect";
import { montserrat } from "@/app/home/landing-fonts";

const CATEGORIES = ["House", "Apartment", "Residential"];

const PROPERTY_TYPES = ["Any type", "Villa", "Penthouse", "Estate", "Townhouse"];
const PRICE_RANGES = ["Any price", "Under GHS 5M", "GHS 5M – 20M", "GHS 20M – 50M", "GHS 50M+"];
const ROOM_COUNTS = ["Any", "1 bed room", "2 bed rooms", "3 bed rooms", "4+ bed rooms"];

export default function PropertyHero() {
  const shouldReduceMotion = useReducedMotion();
  const [activeCategory, setActiveCategory] = useState("House");
  const [propertyType, setPropertyType] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [location, setLocation] = useState("");
  const [rooms, setRooms] = useState("");

  const handleSearch = () => {
    document.getElementById("listings")?.scrollIntoView({ behavior: shouldReduceMotion ? "auto" : "smooth" });
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
    <section className="relative flex min-h-[820px] w-full flex-col overflow-hidden pb-24">
      <div className="absolute inset-0">
        <Image src="/property/property-hero.jpg" alt="Grand estate at sunset" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <LandingNavbar />

      <div className="relative z-10 flex flex-1 flex-col justify-center gap-6 px-5 py-16 md:px-16">
        <motion.div {...fadeUp(0)} className="flex gap-2">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`rounded-full px-6 py-2 text-sm font-bold tracking-[0.7px] backdrop-blur-md transition-colors ${
                activeCategory === category ? "bg-white/20 text-white" : "bg-white/10 text-white/80 hover:bg-white/15"
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        <motion.h1
          {...fadeUp(0.1)}
          className={`${montserrat.className} max-w-3xl text-[42px] font-bold leading-[1.1] tracking-[-1.28px] text-white sm:text-[52px] md:text-[64px] md:leading-[80px]`}
        >
          Find Your Dream Estate
        </motion.h1>

        <motion.p {...fadeUp(0.2)} className="max-w-[576px] text-lg text-white/90">
          Explore an exclusive portfolio of premium apartments, historic plots, and commercial spaces tailored to
          your prestigious lifestyle.
        </motion.p>
      </div>

      <motion.div {...fadeUp(0.3)} className="relative z-10 mx-5 md:mx-16">
        <div className="rounded-[32px] border border-white/20 bg-[rgba(50,50,50,0.7)] p-2.5">
          <p className="px-6 py-3 text-2xl font-medium text-white">Find your perfect home</p>

          <div className="flex flex-col items-stretch gap-4 p-4 md:flex-row md:items-center">
            <label className="flex flex-1 flex-col gap-1 border-white/20 px-4 py-1 text-left md:border-r">
              <span className="text-xs font-medium uppercase tracking-[1.4px] text-white">Property type</span>
              <HeroSelect value={propertyType} placeholder="Choose type" options={PROPERTY_TYPES} onChange={setPropertyType} />
            </label>

            <label className="flex flex-1 flex-col gap-1 border-white/20 px-4 py-1 text-left md:border-r">
              <span className="text-xs font-medium uppercase tracking-[1.4px] text-white">Price range</span>
              <HeroSelect value={priceRange} placeholder="Select price" options={PRICE_RANGES} onChange={setPriceRange} />
            </label>

            <label className="flex flex-1 flex-col gap-1 border-white/20 px-4 py-1 text-left md:border-r">
              <span className="text-xs font-medium uppercase tracking-[1.4px] text-white">Location</span>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Where?"
                className="bg-transparent text-base text-white placeholder:text-[#afafaf] focus:outline-none"
              />
            </label>

            <label className="flex flex-1 flex-col gap-1 px-4 py-1 text-left">
              <span className="text-xs font-medium uppercase tracking-[1.4px] text-white">Number of rooms</span>
              <HeroSelect value={rooms} placeholder="3 bed rooms" options={ROOM_COUNTS} onChange={setRooms} />
            </label>

            <motion.button
              type="button"
              onClick={handleSearch}
              whileHover={shouldReduceMotion ? undefined : { y: -1 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
              className="flex items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-[#e2e8f0] bg-[#f8fafc] px-4 py-3.5 text-lg text-[#06090e] transition-colors hover:bg-white"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M21 21l-4.35-4.35M19 11a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Search Property
            </motion.button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
