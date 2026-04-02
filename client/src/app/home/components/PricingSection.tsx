"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type PricingTier = {
  name: string;
  tagline: string;
  monthlyPrice: string;
  yearlyPrice: string;
  features: string[];
  ctaLabel?: string;
  ctaHref?: string;
};

type PricingSectionProps = {
  title?: string;
  subtitle?: string;
  tiers?: PricingTier[];
  sectionId?: string;
};

function CheckIcon() {
  return (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 12.5 10 17.5 19 7.5"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function PricingSection({
  title = "Simple pricing",
  subtitle = "Choose the plan that fits your needs. No hidden costs, no surprises.",
  tiers = [
    {
      name: "Starter",
      tagline: "For new sellers",
      monthlyPrice: "$15/mo",
      yearlyPrice: "$150/yr",
      features: ["List up to 3 properties", "Basic analytics", "Email support"],
      ctaLabel: "Get Started",
      ctaHref: "/signup",
    },
    {
      name: "Professional",
      tagline: "For active sellers",
      monthlyPrice: "$35/mo",
      yearlyPrice: "$350/yr",
      features: [
        "Unlimited listings",
        "Advanced analytics",
        "Priority support",
        "Featured listings",
      ],
      ctaLabel: "Get Started",
      ctaHref: "/signup",
    },
    {
      name: "Premium",
      tagline: "For agencies",
      monthlyPrice: "$99/mo",
      yearlyPrice: "$990/yr",
      features: [
        "Team accounts",
        "Custom branding",
        "Dedicated manager",
        "API access",
        "White label option",
      ],
      ctaLabel: "Get Started",
      ctaHref: "/signup",
    },
  ],
  sectionId = "pricing",
}: PricingSectionProps) {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  const displayedTiers = useMemo(
    () =>
      tiers.map((t) => ({
        ...t,
        price: billing === "monthly" ? t.monthlyPrice : t.yearlyPrice,
      })),
    [tiers, billing],
  );

  return (
    <section id={sectionId} className="w-full bg-white">
      <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6 py-10 md:py-12">
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">
          {title}
        </h2>
        <p className="mt-3 text-sm text-gray-500">{subtitle}</p>

        <div className="mt-6 inline-flex border border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={() => setBilling("monthly")}
            className={`px-4 py-1.5 text-[11px] font-medium transition-colors ${
              billing === "monthly"
                ? "bg-white text-gray-900"
                : "text-gray-500 hover:text-gray-900"
            }`}
            aria-pressed={billing === "monthly"}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setBilling("yearly")}
            className={`px-4 py-1.5 text-[11px] font-medium transition-colors border-l border-gray-200 ${
              billing === "yearly"
                ? "bg-white text-gray-900"
                : "text-gray-500 hover:text-gray-900"
            }`}
            aria-pressed={billing === "yearly"}
          >
            Yearly
          </button>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayedTiers.map((t) => (
            <div
              key={t.name}
              className="bg-gray-100 border border-gray-200 p-7"
            >
              <div className="pb-6 border-b border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900">{t.name}</h3>
                <p className="mt-1 text-[11px] text-gray-500">{t.tagline}</p>
              </div>

              <div className="pt-6">
                <p className="text-3xl font-extrabold text-gray-900">
                  {t.price}
                </p>

                <Link
                  href={t.ctaHref ?? "/signup"}
                  className="mt-6 w-full inline-flex items-center justify-center px-4 py-2 bg-white border border-gray-200 text-gray-900 text-xs font-semibold
                             hover:bg-gray-50 transition-colors"
                >
                  {t.ctaLabel ?? "Get Started"}
                  <span className="ml-2">→</span>
                </Link>

                <ul className="mt-6 space-y-3 text-[11px] text-gray-600">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <span className="mt-0.5 text-gray-700">
                        <CheckIcon />
                      </span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

