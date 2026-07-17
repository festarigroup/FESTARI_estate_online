"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import LandingNavbar from "./LandingNavbar";
import { montserrat } from "../landing-fonts";

const SEARCH_TABS = [
  { key: "properties", label: "Properties", href: "/property" },
  { key: "hotels", label: "Hotels", href: "/hotel" },
  { key: "artisans", label: "Artisans", href: "/services" },
] as const;

const PROPERTY_TYPES = ["Any type", "Villa", "Penthouse", "Estate", "Townhouse"];
const PRICE_RANGES = ["Any price", "Under $1M", "$1M – $3M", "$3M – $10M", "$10M+"];

export default function LandingHero() {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();
  const [activeTab, setActiveTab] = useState<(typeof SEARCH_TABS)[number]["key"]>("properties");
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [priceRange, setPriceRange] = useState("");

  const handleExplore = () => {
    const tab = SEARCH_TABS.find((t) => t.key === activeTab)!;
    router.push(tab.href);
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
    <section className="relative flex min-h-[870px] w-full flex-col overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/landing/hero-estate.jpg"
          alt="Luxury legacy estate at dusk"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <LandingNavbar />

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-8 px-5 py-16 text-center">
        <motion.h1
          {...fadeUp(0)}
          className={`${montserrat.className} max-w-4xl text-[42px] font-bold leading-[1.1] tracking-[-1.28px] text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.25)] sm:text-[56px] md:text-[64px] md:leading-[70px]`}
        >
          Discover Your Legacy Estate
        </motion.h1>

        <motion.p {...fadeUp(0.1)} className="max-w-[672px] text-lg text-white/90">
          {"Connecting discerning individuals with the world's most exclusive properties and bespoke hospitality services."}
        </motion.p>

        <motion.div {...fadeUp(0.2)} className="w-full max-w-[1050px]">
          <div className="rounded-[32px] border border-white/20 bg-[rgba(50,50,50,0.7)] p-2.5">
            <div className="flex flex-wrap gap-2 p-2">
              {SEARCH_TABS.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`rounded-xl px-4 py-3.5 text-lg font-semibold transition-colors ${
                    activeTab === tab.key
                      ? "border border-white text-white"
                      : "text-[#8f8f8f] hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex flex-col items-stretch gap-4 p-4 md:flex-row md:items-center">
              <label className="flex flex-1 flex-col gap-1 border-white/20 px-4 py-1 text-left md:border-r">
                <span className="text-xs font-medium uppercase tracking-[1.4px] text-white">Location</span>
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Where to?"
                  className="bg-transparent text-base text-white placeholder:text-[#8f8f8f] focus:outline-none"
                />
              </label>

              <label className="flex flex-1 flex-col gap-1 border-white/20 px-4 py-1 text-left md:border-r">
                <span className="text-xs font-medium uppercase tracking-[1.4px] text-white">Property type</span>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="appearance-none bg-transparent text-base text-white focus:outline-none [&>option]:text-[#0f1621]"
                >
                  <option value="" disabled className="hidden">
                    Choose type
                  </option>
                  {PROPERTY_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-1 flex-col gap-1 px-4 py-1 text-left">
                <span className="text-xs font-medium uppercase tracking-[1.4px] text-white">Price range</span>
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="appearance-none bg-transparent text-base text-white focus:outline-none [&>option]:text-[#0f1621]"
                >
                  <option value="" disabled className="hidden">
                    Select price
                  </option>
                  {PRICE_RANGES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </label>

              <motion.button
                type="button"
                onClick={handleExplore}
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
                Explore selection
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
