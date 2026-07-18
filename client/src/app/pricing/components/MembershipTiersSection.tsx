"use client";

import { motion, useReducedMotion } from "framer-motion";
import toast from "react-hot-toast";
import { StaggerContainer, StaggerItem } from "@/components/motion/Stagger";
import { montserrat } from "@/app/home/landing-fonts";
import { PRICING_PLANS, formatPlanPrice, type PricingFeature, type PricingPlan } from "@/lib/pricingPlans";

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg width="17" height="17" viewBox="0 0 20 20" fill="none" className={className}>
      <circle cx="10" cy="10" r="9" fill="currentColor" opacity="0.12" />
      <path d="M6.5 10.2 9 12.7l4.5-5.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MutedIcon({ className }: { className?: string }) {
  return (
    <svg width="17" height="17" viewBox="0 0 20 20" fill="none" className={className}>
      <circle cx="10" cy="10" r="9" fill="currentColor" opacity="0.1" />
      <path d="M6.5 10h7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function FeatureRow({ feature, accentClassName }: { feature: PricingFeature; accentClassName: string }) {
  if (feature.muted) {
    return (
      <div className="flex items-start gap-3 opacity-40">
        <MutedIcon className="mt-0.5 shrink-0 text-[#717974]" />
        <span className="text-base italic text-[#717974]">{feature.label}</span>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3">
      <CheckIcon className={`mt-0.5 shrink-0 ${accentClassName}`} />
      <span className="text-base text-[#0f1621]">{feature.label}</span>
    </div>
  );
}

function PricingCard({ plan }: { plan: PricingPlan }) {
  const shouldReduceMotion = useReducedMotion();

  if (plan.recommended) {
    return (
      <StaggerItem className="relative flex flex-1">
        <motion.div
          whileHover={shouldReduceMotion ? undefined : { y: -6 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex w-full flex-col gap-6 rounded-2xl border border-[rgba(11,61,46,0.2)] bg-[#f3f3f3] p-8 shadow-[0px_20px_40px_-8px_rgba(0,0,0,0.12)] md:-translate-y-4"
        >
          <motion.span
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.8, y: 8 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#be4d00] px-6 py-1.5 text-[10px] font-bold uppercase tracking-[2px] text-white shadow-lg"
          >
            Recommended
          </motion.span>

          <div className="flex flex-col gap-2">
            <h3 className={`${montserrat.className} text-2xl font-semibold text-[#be4d00]`}>{plan.name}</h3>
            <p className="flex items-baseline gap-1">
              <span className="text-[36px] font-bold text-[#be4d00]">{formatPlanPrice(plan.price)}</span>
              <span className="text-sm font-semibold tracking-[0.7px] text-[#0f1621]">{plan.cadence}</span>
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {plan.features.map((feature) => (
              <FeatureRow key={feature.label} feature={feature} accentClassName="text-[#be4d00]" />
            ))}
          </div>

          <motion.button
            type="button"
            onClick={() => toast.success(`Welcome to the ${plan.name} tier — our team will follow up shortly.`)}
            whileHover={shouldReduceMotion ? undefined : { y: -1 }}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
            className="rounded-xl bg-[#be4d00] px-4 py-3.5 text-lg text-white transition-colors hover:bg-[#a54300]"
          >
            {plan.cta}
          </motion.button>
        </motion.div>
      </StaggerItem>
    );
  }

  return (
    <StaggerItem className="flex flex-1">
      <motion.div
        whileHover={shouldReduceMotion ? undefined : { y: -6 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="flex w-full flex-col gap-6 border border-[rgba(192,200,195,0.5)] bg-white p-8"
      >
        <div className="flex flex-col gap-2">
          <h3 className={`${montserrat.className} text-2xl font-semibold text-[#00261b]`}>{plan.name}</h3>
          <p className="flex items-baseline gap-1">
            <span className="text-[36px] font-bold text-[#00261b]">{formatPlanPrice(plan.price)}</span>
            <span className="text-sm font-semibold tracking-[0.7px] text-[#414944]">{plan.cadence}</span>
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {plan.features.map((feature) => (
            <FeatureRow key={feature.label} feature={feature} accentClassName="text-[#00261b]" />
          ))}
        </div>

        <button
          type="button"
          onClick={() => toast.success(`Thanks for your interest in the ${plan.name} tier — we'll be in touch.`)}
          className="rounded-xl border border-[#e2e8f0] bg-[#f8fafc] px-4 py-3.5 text-lg text-[#06090e] transition-colors hover:bg-white"
        >
          {plan.cta}
        </button>
      </motion.div>
    </StaggerItem>
  );
}

export default function MembershipTiersSection() {
  return (
    <section className="w-full bg-white px-5 py-16 md:px-16 md:py-24">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-16">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <h2 className={`${montserrat.className} text-[32px] font-semibold text-[#00261b] md:text-[40px]`}>
            Membership Architecture
          </h2>
          <p className="max-w-[518px] text-right text-base text-[#414944]">
            No hidden costs. No complex contracts. Transparent investment for a legacy of quality. Start with 14 days
            of premium features for any tier.
          </p>
        </div>

        <StaggerContainer className="grid grid-cols-1 items-start gap-6 md:grid-cols-3">
          {PRICING_PLANS.map((plan) => (
            <PricingCard key={plan.id} plan={plan} />
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
