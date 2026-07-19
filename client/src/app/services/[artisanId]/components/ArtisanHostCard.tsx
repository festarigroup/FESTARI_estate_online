"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import toast from "react-hot-toast";
import { montserrat } from "@/app/home/landing-fonts";
import { StaggerContainer, StaggerItem } from "@/components/motion/Stagger";
import type { ArtisanProfile } from "@/lib/artisanShowcase";

const EASE = [0.22, 1, 0.36, 1] as const;

function StarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="#fed65b">
      <path d="M10 1.5l2.5 5.1 5.6.8-4 3.9.9 5.6L10 14.2l-5 2.7.9-5.6-4-3.9 5.6-.8L10 1.5z" />
    </svg>
  );
}

function GuildBadgeIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg width="13" height="16" viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
      <path d="M12 2C7.6 2 4 5.6 4 10c0 5.6 6.6 11.3 7 11.6.3.3.7.3 1 0 .4-.3 7-6 7-11.6 0-4.4-3.6-8-8-8Zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 7v5l3.5 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function ArtisanHostCard({ artisan }: { artisan: ArtisanProfile }) {
  const shouldReduceMotion = useReducedMotion();
  const reviewCount = Math.round(artisan.rating * 45 + 70);

  const stats = [
    { value: reviewCount, label: "Reviews" },
    { value: artisan.rating.toFixed(2), label: "Rating", icon: <StarIcon /> },
    { value: artisan.yearsExperience, label: "Years Experience" },
  ];

  return (
    <section className="w-full bg-[#f6f3f2] px-5 py-16 md:px-16 md:py-24">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-8">
        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold uppercase tracking-[1.4px] text-[#be4d00]">The Guild Master</p>
          <h2 className={`${montserrat.className} text-[32px] font-semibold text-[#00261b] md:text-[40px]`}>
            Meet the Artisan
          </h2>
        </div>

        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: EASE }}
          className="grid gap-10 rounded-[32px] border border-[rgba(89,112,97,0.15)] bg-white p-8 shadow-[0px_30px_60px_-30px_rgba(0,38,27,0.2)] md:grid-cols-[280px_1fr] md:p-10"
        >
          <div className="flex flex-col items-center gap-5 md:items-start">
            <motion.div
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
              whileHover={shouldReduceMotion ? undefined : { y: -4 }}
              className="relative w-full max-w-[240px]"
            >
              <div className="relative aspect-square w-full overflow-hidden rounded-2xl shadow-md">
                <Image src={artisan.avatar} alt={artisan.name} fill className="object-cover" />
              </div>
              <span className="absolute -bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1 whitespace-nowrap rounded-full bg-[#be4d00] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.5px] text-white shadow-md">
                <GuildBadgeIcon />
                Guild Master
              </span>
            </motion.div>

            <button
              type="button"
              onClick={() => toast.success(`Your message request has been sent to ${artisan.name}.`)}
              className="w-full max-w-[240px] rounded-xl bg-[#be4d00] px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#a54300]"
            >
              Message Artisan
            </button>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="text-[28px] font-bold text-[#00261b]">{artisan.name}</h3>
                <span className="flex items-center gap-1 rounded-full bg-[#fed65b]/20 px-3 py-1 text-sm font-semibold text-[#8a6d00]">
                  <StarIcon />
                  {artisan.rating.toFixed(2)}
                </span>
              </div>
              <p className="flex items-center gap-1.5 text-base text-[#717974]">
                <PinIcon />
                {artisan.craft} · {artisan.location}
              </p>
            </div>

            <p className="text-base leading-relaxed text-[#414944]">{artisan.bio}</p>

            <StaggerContainer className="grid grid-cols-3 divide-x divide-[rgba(89,112,97,0.2)] rounded-2xl border border-[rgba(89,112,97,0.2)] bg-[#f6f3f2] py-5">
              {stats.map((stat) => (
                <StaggerItem key={stat.label} className="flex flex-col items-center gap-1 px-2 text-center">
                  <span className="flex items-center gap-1 text-lg font-bold text-[#00261b]">
                    {stat.icon}
                    {stat.value}
                  </span>
                  <span className="text-xs font-semibold text-[#717974]">{stat.label}</span>
                </StaggerItem>
              ))}
            </StaggerContainer>

            <p className="flex items-center gap-1.5 text-xs font-semibold text-[#717974]">
              <ClockIcon />
              Response rate: 100% · Typically responds within a day
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
