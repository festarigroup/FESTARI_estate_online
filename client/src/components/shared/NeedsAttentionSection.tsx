"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { comingSoonHref } from "@/lib/coming-soon";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

interface AttentionItem {
  avatar: string;
  title: string;
  heading: string;
  detail: string;
  action: string;
  primary?: boolean;
}

// Reuses this app's existing avatar photography — there's no property-manager
// backend yet (see dummy-listings.ts).
const AVATAR = "/images/avatar-generic.png";

const ROWS: AttentionItem[][] = [
  [
    {
      avatar: AVATAR,
      title: "Rent Due",
      heading: "Unit 2B, Dzorwulu",
      detail: "GHS 3,500 due Thu 1 Oct. Reminder sent to tenant.",
      action: "View Tenancy",
      primary: true,
    },
    {
      avatar: AVATAR,
      title: "Maintenance",
      heading: "Leaking kitchen tap, Unit 1A",
      detail: "2 quotes received: GHS 280 and GHS 350.",
      action: "Compare Quotes",
    },
  ],
  [
    {
      avatar: AVATAR,
      title: "Expiring",
      heading: "Fire safety certificate",
      detail: "Expires 14 Oct for Dzorwulu block. 17 days left.",
      action: "Start Renewal",
    },
    {
      avatar: AVATAR,
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

/** "/home" dashboard section for time-sensitive property-management items —
 * only the owner/manager viewing their own dashboard sees this. Each row
 * pairs two independently-bordered cards inside one shared, slow-moving
 * gradient frame (a subtle "look here" cue), which respects
 * prefers-reduced-motion by holding still instead. */
export function NeedsAttentionSection() {
  return (
    <section className="flex w-full flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-[15px] font-bold text-night-900">Needs your attention</h2>
        <span className="flex items-center gap-1 text-[11px] text-gray-400">
          <span className="relative block size-3 shrink-0">
            <Image src="/icons/visibility-user-check.svg" alt="" fill sizes="12px" />
          </span>
          Only you can see this
        </span>
      </div>

      <div className="flex w-full flex-col gap-3">
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
      className="w-full rounded-[22px] p-[1.5px]"
      style={{ backgroundImage: BORDER_GRADIENT, backgroundSize: "300% 100%" }}
      animate={prefersReducedMotion ? undefined : { backgroundPositionX: ["0%", "100%", "0%"] }}
      transition={prefersReducedMotion ? undefined : { duration: 8, repeat: Infinity, ease: "linear" }}
    >
      <div className="flex w-full flex-col gap-2 rounded-[21px] bg-gray-50 p-1.5 sm:flex-row sm:items-stretch">
        {children}
      </div>
    </motion.div>
  );
}

function AttentionCard({ item }: { item: AttentionItem }) {
  return (
    <div className="flex flex-1 flex-col gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-5 sm:p-6">
      <div className="flex items-center gap-3">
        <span className="relative block size-8 shrink-0 overflow-hidden rounded-full">
          <Image src={item.avatar} alt="" fill className="object-cover" sizes="32px" />
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
          "flex h-10 w-full items-center justify-center rounded-lg text-[13px] font-medium",
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
