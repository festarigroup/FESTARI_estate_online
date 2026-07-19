"use client";

import { useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { montserrat } from "@/app/home/landing-fonts";

type Review = {
  name: string;
  role: string;
  location: string;
  quote: string;
};

const REVIEWS: Review[] = [
  {
    name: "Sarah Whitfield",
    role: "Property Curator",
    location: "London, UK",
    quote: "Their craftsmanship transformed our estate library into something truly extraordinary.",
  },
  {
    name: "Kwame Asante",
    role: "Estate Manager",
    location: "Accra, Ghana",
    quote: "Punctual, meticulous, and endlessly patient with every design change we made.",
  },
  {
    name: "Elena Marchetti",
    role: "Interior Architect",
    location: "Milan, Italy",
    quote: "The finished piece exceeded every reference photo we sent them.",
  },
  {
    name: "James Okafor",
    role: "Homeowner",
    location: "Lagos, Nigeria",
    quote: "Working with them felt like collaborating with a true master of the craft.",
  },
];

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

function QuoteMarkIcon() {
  return (
    <svg width="28" height="22" viewBox="0 0 28 22" fill="none" className="text-[#c0c8c3]">
      <path
        d="M0 22V13.75C0 9.4375 1.1875 6.1875 3.5625 4C5.9375 1.8125 8.75 0.5 12 0V4.5C10 5.125 8.5 6.0625 7.5 7.3125C6.5 8.5625 6 10.0625 6 11.8125H12V22H0ZM16 22V13.75C16 9.4375 17.1875 6.1875 19.5625 4C21.9375 1.8125 24.75 0.5 28 0V4.5C26 5.125 24.5 6.0625 23.5 7.3125C22.5 8.5625 22 10.0625 22 11.8125H28V22H16Z"
        fill="currentColor"
      />
    </svg>
  );
}

function AvatarFallback({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return (
    <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#f6f3f2] text-sm font-bold text-[#be4d00]">
      {initials}
    </div>
  );
}

export default function ArtisanReviewsSection() {
  const shouldReduceMotion = useReducedMotion();
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollByCard = (direction: 1 | -1) => {
    scrollerRef.current?.scrollBy({ left: direction * 380, behavior: shouldReduceMotion ? "auto" : "smooth" });
  };

  return (
    <section className="w-full bg-black px-5 py-16 md:px-16 md:py-24">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="flex flex-col gap-3">
            <p className="text-sm font-semibold uppercase tracking-[1.4px] text-white/60">Our Reviews</p>
            <h2 className={`${montserrat.className} text-[32px] font-semibold text-white md:text-[40px]`}>
              What Our Clients Say
            </h2>
          </div>
          <div className="hidden items-center gap-4 sm:flex">
            <button
              type="button"
              onClick={() => scrollByCard(-1)}
              aria-label="Previous review"
              className="flex size-12 items-center justify-center rounded-full border-2 border-[#c0c8c3] text-white transition-colors hover:bg-white/10"
            >
              <ArrowIcon direction="left" />
            </button>
            <button
              type="button"
              onClick={() => scrollByCard(1)}
              aria-label="Next review"
              className="flex size-12 items-center justify-center rounded-full bg-[#be4d00] text-white transition-colors hover:bg-[#a54300]"
            >
              <ArrowIcon direction="right" />
            </button>
          </div>
        </div>

        <div
          ref={scrollerRef}
          className="scrollbar-orange flex gap-6 overflow-x-auto scroll-smooth pb-2 [scroll-snap-type:x_mandatory]"
        >
          {REVIEWS.map((review) => (
            <div
              key={review.name}
              className="flex w-[340px] shrink-0 flex-col gap-6 rounded-2xl bg-white p-8 [scroll-snap-align:start]"
            >
              <div className="flex items-center justify-between gap-3">
                <AvatarFallback name={review.name} />
                <span className="rounded-full bg-[#f6f3f2] px-3 py-1.5 text-xs font-semibold tracking-[0.7px] text-[#414944]">
                  {review.role}
                </span>
              </div>
              <QuoteMarkIcon />
              <p className="min-h-[80px] text-lg font-medium leading-relaxed text-[#00261b]">{review.quote}</p>
              <div>
                <p className="text-sm font-semibold tracking-[0.7px] text-[#00261b]">{review.name}</p>
                <p className="text-sm text-[#717974]">{review.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
