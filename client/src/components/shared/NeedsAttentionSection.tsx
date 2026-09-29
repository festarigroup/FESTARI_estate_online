"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { NavIcon } from "@/components/shared/NavIcon";
import { comingSoonHref } from "@/lib/coming-soon";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

interface AttentionItem {
  icon: string;
  title: string;
  heading: string;
  detail: string;
  action: string;
  primary?: boolean;
}

const ROWS: AttentionItem[][] = [
  [
    {
      icon: "/icons/clipboard-list-01.svg",
      title: "Rent Due",
      heading: "Unit 2B, Dzorwulu",
      detail: "GHS 3,500 due Thu 1 Oct. Reminder sent to tenant.",
      action: "View Tenancy",
      primary: true,
    },
    {
      icon: "/icons/settings-02.svg",
      title: "Maintenance",
      heading: "Leaking kitchen tap, Unit 1A",
      detail: "2 quotes received: GHS 280 and GHS 350.",
      action: "Compare Quotes",
    },
  ],
  [
    {
      icon: "/icons/timer-01.svg",
      title: "Expiring",
      heading: "Fire safety certificate",
      detail: "Expires 14 Oct for Dzorwulu block. 17 days left.",
      action: "Start Renewal",
    },
    {
      icon: "/icons/settings-02.svg",
      title: "Maintenance",
      heading: "Leaking kitchen tap, Unit 1A",
      detail: "2 quotes received: GHS 280 and GHS 350.",
      action: "Compare Quotes",
    },
  ],
];

// A faint tint that gradually brightens toward the middle and back down, so
// the sweep reads as a soft traveling glow rather than a hard-edged dash.
const BORDER_GRADIENT =
  "linear-gradient(90deg, rgba(84,51,255,0.15) 0%, rgba(84,51,255,0.3) 20%, #5433ff 40%, #1465e6 50%, rgba(20,101,230,0.3) 60%, rgba(20,101,230,0.15) 80%, rgba(84,51,255,0.15) 100%)";

const ALL_ITEMS = ROWS.flat();

/** "/home" dashboard section for time-sensitive property-management items —
 * only the owner/manager viewing their own dashboard sees this. On mobile
 * every card sits in a single horizontally scrolling line; on desktop they
 * pair up two-per-row, each pair sharing one slow-moving gradient frame (a
 * subtle "look here" cue) that respects prefers-reduced-motion by holding
 * still instead. */
export function NeedsAttentionSection() {
  return (
    <section className="flex w-full flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-[15px] font-bold text-night-900">Needs your attention</h2>
        <span className="flex items-center gap-1 text-[11px] text-gray-400">
          Only you can see this
          <NavIcon icon="/icons/create-menu2-lock-key.svg" color="night" size={10} className="shrink-0" />
        </span>
      </div>

      <div className="sm:hidden">
        <GradientRow>
          {ALL_ITEMS.map((item, index) => (
            <AttentionCard key={index} item={item} />
          ))}
        </GradientRow>
      </div>

      <div className="hidden w-full flex-col gap-3 sm:flex">
        {ROWS.map((row, index) => (
          <GradientRow key={index}>
            <AttentionCard item={row[0]} />
            <AttentionCard item={row[1]} />
          </GradientRow>
        ))}
      </div>
    </section>
  );
}

function GradientRow({ children }: { children: ReactNode }) {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <motion.div
      className="w-full rounded-[29.5px] p-[1.5px] sm:rounded-[22px]"
      style={{ backgroundImage: BORDER_GRADIENT, backgroundSize: "300% 100%" }}
      animate={prefersReducedMotion ? undefined : { backgroundPositionX: ["0%", "100%", "0%"] }}
      transition={prefersReducedMotion ? undefined : { duration: 8, repeat: Infinity, ease: "linear" }}
    >
      <div className="no-scrollbar flex w-full items-stretch gap-2 overflow-x-auto rounded-[28px] bg-gray-50 p-3 sm:rounded-[21px]">
        {children}
      </div>
    </motion.div>
  );
}

function AttentionCard({ item }: { item: AttentionItem }) {
  return (
    <div className="flex w-[270px] shrink-0 flex-col gap-4 rounded-[14px] border border-gray-200 bg-gray-50 p-5 sm:w-auto sm:flex-1 sm:p-6">
      <div className="flex items-center gap-3">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-900/10">
          <NavIcon icon={item.icon} color="brand" size={16} />
        </span>
        <p className="text-[16px] font-bold tracking-tight text-night-900">{item.title}</p>
      </div>

      <div className="flex flex-col gap-1">
        <p className="text-[16px] font-bold tracking-tight text-night-900">{item.heading}</p>
        <p className="text-[12px] text-gray-700">{item.detail}</p>
      </div>

      <Link
        href={comingSoonHref(item.action)}
        className={cn(
          "flex h-10 w-full items-center justify-center rounded-xl text-[13px] font-medium sm:rounded-lg",
          item.primary
            ? "bg-brand-900 text-white hover:bg-brand-900/90"
            : "border border-gray-200 text-night-900 hover:bg-gray-50",
        )}
      >
        {item.action}
      </Link>
    </div>
  );
}
