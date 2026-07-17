"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import LandingNavbar from "./LandingNavbar";
import HeroSelect from "./HeroSelect";
import { montserrat } from "../landing-fonts";

const SEARCH_TABS = [
  { key: "properties", label: "Properties", href: "/property" },
  { key: "hotels", label: "Hotels", href: "/hotel" },
  { key: "artisans", label: "Artisans", href: "/services" },
] as const;

type SearchTabKey = (typeof SEARCH_TABS)[number]["key"];

type SearchField = {
  key: string;
  label: string;
  placeholder: string;
} & ({ type: "text" | "date" } | { type: "select"; options: string[] });

const SEARCH_FIELDS: Record<SearchTabKey, SearchField[]> = {
  properties: [
    { key: "location", label: "Location", type: "text", placeholder: "Where to?" },
    {
      key: "propertyType",
      label: "Property type",
      type: "select",
      placeholder: "Choose type",
      options: ["Any type", "Villa", "Penthouse", "Estate", "Townhouse"],
    },
    {
      key: "priceRange",
      label: "Price range",
      type: "select",
      placeholder: "Select price",
      options: ["Any price", "Under $1M", "$1M – $3M", "$3M – $10M", "$10M+"],
    },
  ],
  hotels: [
    { key: "location", label: "Location", type: "text", placeholder: "Where to?" },
    { key: "checkIn", label: "Check-in date", type: "date", placeholder: "Add date" },
    {
      key: "guests",
      label: "Guests",
      type: "select",
      placeholder: "Add guests",
      options: ["1 Guest", "2 Guests", "3 Guests", "4 Guests", "5+ Guests"],
    },
  ],
  artisans: [
    { key: "location", label: "Location", type: "text", placeholder: "Where to?" },
    {
      key: "serviceType",
      label: "Service type",
      type: "select",
      placeholder: "Choose service",
      options: ["Interior Designer", "Landscape Architect", "Craftsman", "Event Planner"],
    },
    {
      key: "budget",
      label: "Budget",
      type: "select",
      placeholder: "Select budget",
      options: ["Any budget", "Under $5K", "$5K – $20K", "$20K – $50K", "$50K+"],
    },
  ],
};

export default function LandingHero() {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();
  const [activeTab, setActiveTab] = useState<SearchTabKey>("properties");
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});

  const handleTabChange = (tab: SearchTabKey) => {
    setActiveTab(tab);
    setFieldValues({});
  };

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
                  onClick={() => handleTabChange(tab.key)}
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
              {SEARCH_FIELDS[activeTab].map((field, i) => (
                <label
                  key={field.key}
                  className={`flex flex-1 flex-col gap-1 border-white/20 px-4 py-1 text-left ${
                    i < SEARCH_FIELDS[activeTab].length - 1 ? "md:border-r" : ""
                  }`}
                >
                  <span className="text-xs font-medium uppercase tracking-[1.4px] text-white">{field.label}</span>
                  {field.type === "select" ? (
                    <HeroSelect
                      value={fieldValues[field.key] ?? ""}
                      placeholder={field.placeholder}
                      options={field.options}
                      onChange={(v) => setFieldValues((prev) => ({ ...prev, [field.key]: v }))}
                    />
                  ) : (
                    <input
                      type={field.type}
                      value={fieldValues[field.key] ?? ""}
                      onChange={(e) => setFieldValues((prev) => ({ ...prev, [field.key]: e.target.value }))}
                      placeholder={field.placeholder}
                      className="bg-transparent text-base text-white placeholder:text-[#8f8f8f] focus:outline-none [color-scheme:dark]"
                    />
                  )}
                </label>
              ))}

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
