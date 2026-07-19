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

export default function ArtisanHostCard({ artisan }: { artisan: ArtisanProfile }) {
  const shouldReduceMotion = useReducedMotion();
  const reviewCount = Math.round(artisan.rating * 45 + 70);

  const stats = [
    { value: reviewCount, label: "Reviews" },
    { value: artisan.rating.toFixed(2), label: "Rating", icon: <StarIcon /> },
    { value: artisan.yearsExperience, label: "Years Experience" },
  ];

  return (
    <section className="w-full bg-white px-5 py-16 md:px-16 md:py-24">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-6">
        <h2 className={`${montserrat.className} text-2xl font-semibold text-[#00261b]`}>Meet the Artisan</h2>

        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: EASE }}
          whileHover={shouldReduceMotion ? undefined : { y: -2 }}
          className="flex max-w-[720px] flex-col gap-8 rounded-[24px] border border-[rgba(89,112,97,0.2)] bg-white p-8"
        >
          <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:items-center sm:text-left">
            <motion.div
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.7 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
              className="relative shrink-0"
            >
              <div className="size-24 overflow-hidden rounded-full border-4 border-white shadow-md">
                <Image src={artisan.avatar} alt={artisan.name} width={96} height={96} className="size-full object-cover" />
              </div>
              <span className="absolute -bottom-1.5 left-1/2 flex -translate-x-1/2 items-center gap-1 whitespace-nowrap rounded-full bg-[#be4d00] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.5px] text-white shadow-md">
                <GuildBadgeIcon />
                Guild Master
              </span>
            </motion.div>

            <div className="flex flex-1 flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xl font-bold text-[#00261b]">{artisan.name}</p>
                <p className="text-sm text-[#717974]">
                  {artisan.craft} · {artisan.location}
                </p>
              </div>
              <button
                type="button"
                onClick={() => toast.success(`Your message request has been sent to ${artisan.name}.`)}
                className="mt-4 self-center rounded-xl bg-[#be4d00] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#a54300] sm:mt-0 sm:self-auto"
              >
                Message Artisan
              </button>
            </div>
          </div>

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

          <div className="flex flex-col gap-2">
            <p className="text-sm leading-relaxed text-[#414944]">{artisan.bio}</p>
            <p className="text-xs font-semibold text-[#717974]">Response rate: 100% · Typically responds within a day</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
