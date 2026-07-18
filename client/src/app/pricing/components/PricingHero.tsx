"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import LandingNavbar from "@/app/home/components/LandingNavbar";
import { montserrat } from "@/app/home/landing-fonts";

function GlobeIcon() {
  return (
    <svg width="16" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
      <path
        d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 0c2.5 2.7 4 6.2 4 10s-1.5 7.3-4 10m0-20c-2.5 2.7-4 6.2-4 10s1.5 7.3 4 10M2.5 9h19M2.5 15h19"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function PricingHero() {
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
    <section className="relative flex min-h-[620px] w-full flex-col">
      <div className="absolute inset-0 overflow-hidden">
        <Image src="/pricing/hero.jpg" alt="Illuminated luxury villa at night" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70" />
      </div>

      <LandingNavbar overlay />

      <div className="relative z-10 flex flex-1 flex-col justify-center gap-6 px-5 py-20 md:px-16">
        <motion.span
          {...fadeUp(0)}
          className="w-fit rounded-full bg-white px-4 py-1.5 text-xs font-medium uppercase tracking-[1.2px] text-[#0f1621]"
        >
          Exclusivity Guaranteed
        </motion.span>

        <motion.h1
          {...fadeUp(0.1)}
          className={`${montserrat.className} max-w-2xl text-[42px] font-bold leading-[1.1] tracking-[-1.28px] text-white sm:text-[52px] md:text-[64px] md:leading-[70px]`}
        >
          Investment in Excellence
        </motion.h1>

        <motion.p {...fadeUp(0.2)} className="max-w-[512px] text-lg text-white">
          Select a membership tier tailored to your portfolio&apos;s growth and management. Our tiers provide bespoke
          access to the world&apos;s most sought-after properties and artisans.
        </motion.p>

        <motion.div {...fadeUp(0.3)} className="flex items-center gap-2 pt-1">
          <GlobeIcon />
          <span className="text-sm font-semibold tracking-[0.7px] text-white">Global Portfolio: 745,000+ Listings</span>
        </motion.div>
      </div>
    </section>
  );
}
