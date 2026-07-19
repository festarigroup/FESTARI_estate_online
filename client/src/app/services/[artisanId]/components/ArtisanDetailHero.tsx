"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import LandingNavbar from "@/app/home/components/LandingNavbar";
import { montserrat } from "@/app/home/landing-fonts";
import type { ArtisanProfile } from "@/lib/artisanShowcase";

function ArrowIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path
        d={direction === "left" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ArtisanDetailHero({ artisan }: { artisan: ArtisanProfile }) {
  const shouldReduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const images = artisan.portfolioImages;

  const goTo = (next: number) => setIndex(((next % images.length) + images.length) % images.length);

  const fadeUp = (delay = 0) =>
    shouldReduceMotion
      ? { initial: { opacity: 1 }, animate: { opacity: 1 } }
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  return (
    <section className="relative flex min-h-[820px] w-full flex-col overflow-hidden">
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={images[index]}
              alt={`${artisan.name} portfolio work ${index + 1}`}
              fill
              priority
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80" />
      </div>

      <LandingNavbar overlay />

      <div className="relative z-10 flex flex-1 flex-col justify-center gap-6 px-5 py-20 md:px-16">
        <motion.p {...fadeUp(0)} className="text-sm font-semibold uppercase tracking-[1.4px] text-white">
          {artisan.craft}
        </motion.p>

        <motion.h1
          {...fadeUp(0.1)}
          className={`${montserrat.className} max-w-3xl text-[42px] font-bold leading-[1.1] tracking-[-1.28px] text-white sm:text-[52px] md:text-[64px] md:leading-[70px]`}
        >
          {artisan.name}
        </motion.h1>

        <motion.p {...fadeUp(0.2)} className="max-w-[576px] text-lg text-white/70">
          {artisan.bio}
        </motion.p>

        <motion.div {...fadeUp(0.3)} className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            aria-label="Previous portfolio image"
            className="flex size-12 items-center justify-center rounded-full border border-white/40 text-white transition-colors hover:bg-white/10"
          >
            <ArrowIcon direction="left" />
          </button>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            aria-label="Next portfolio image"
            className="flex size-12 items-center justify-center rounded-full border border-white/40 text-white transition-colors hover:bg-white/10"
          >
            <ArrowIcon direction="right" />
          </button>
        </motion.div>
      </div>

      <div className="absolute right-8 top-1/2 z-10 hidden -translate-y-1/2 flex-col gap-2 md:flex">
        {images.map((image, i) => (
          <button
            key={image}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Show portfolio image ${i + 1}`}
            className={`size-3.5 rounded-full border border-[#c0c8c3] transition-colors ${
              i === index ? "bg-white" : "bg-[rgba(181,181,181,0.19)] hover:bg-white/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
