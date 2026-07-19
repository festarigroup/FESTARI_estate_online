"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import LandingNavbar from "@/app/home/components/LandingNavbar";
import { montserrat } from "@/app/home/landing-fonts";

export default function ContactHero() {
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
    <section className="relative flex min-h-[560px] w-full flex-col">
      <div className="absolute inset-0 overflow-hidden">
        <Image src="/contact/hero.jpg" alt="Festari Estates concierge lobby" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70" />
      </div>

      <LandingNavbar overlay />

      <div className="relative z-10 flex flex-1 flex-col justify-center gap-5 px-5 py-20 md:px-16">
        <motion.div {...fadeUp(0)} className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[1.4px]">
          <Link href="/home" className="text-[#bcedd7] transition-colors hover:text-white">
            Home
          </Link>
          <span className="text-[#bcedd7]">/</span>
          <span className="text-white">Contact</span>
        </motion.div>

        <motion.h1
          {...fadeUp(0.1)}
          className={`${montserrat.className} max-w-2xl text-[42px] font-bold leading-[1.05] tracking-[-1.28px] text-white sm:text-[52px] md:text-[64px]`}
        >
          Connect with <span className="font-normal italic">Excellence</span>
        </motion.h1>
      </div>
    </section>
  );
}
