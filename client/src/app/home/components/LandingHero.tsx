"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import LandingNavbar from "./LandingNavbar";
import { montserrat } from "../landing-fonts";

const PARTNERS = [
  "Meridian Trust Bank",
  "Obeng & Partners Law",
  "Vantage Capital Group",
  "Crestline Architecture",
  "Anchor Title Co.",
  "Prestige Relocation",
];

function PartnerBadge({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .filter((word) => /[A-Za-z]/.test(word[0]))
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");

  return (
    <div className="flex shrink-0 items-center gap-3">
      <span className="flex size-9 items-center justify-center rounded-full border border-white/30 text-xs font-bold text-white">
        {initials}
      </span>
      <span className="whitespace-nowrap text-lg font-semibold tracking-[0.5px] text-white/80">{name}</span>
    </div>
  );
}

export default function LandingHero() {
  const shouldReduceMotion = useReducedMotion();

  const fadeUp = (delay = 0) =>
    shouldReduceMotion
      ? { initial: { opacity: 1 }, animate: { opacity: 1 } }
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  return (
    <section className="relative flex min-h-[870px] w-full flex-col">
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src="/landing/hero-estate.jpg"
          alt="Luxury legacy estate at dusk"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <LandingNavbar overlay />

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
          <div className="overflow-hidden rounded-[32px] border border-white/20 bg-[rgba(50,50,50,0.7)] px-2.5 py-8 md:py-10">
            <p className="mb-8 text-center text-xs font-semibold uppercase tracking-[1.4px] text-white/50">
              Trusted by Industry Leaders
            </p>
            <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
              <div className={`flex w-max items-center gap-14 ${shouldReduceMotion ? "" : "animate-marquee"}`}>
                {[...PARTNERS, ...PARTNERS].map((partner, i) => (
                  <PartnerBadge key={`${partner}-${i}`} name={partner} />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
