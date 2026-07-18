"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { montserrat } from "@/app/home/landing-fonts";
import { StaggerContainer, StaggerItem } from "@/components/motion/Stagger";

const FAQS = [
  {
    question: "What makes Festari Hotels different?",
    answer:
      "Every stay in our portfolio is personally inspected by our travel specialists. We pair verified guest reviews with a concierge-level booking experience, so every hotel you see here is one we'd stay in ourselves.",
  },
  {
    question: "How does booking work?",
    answer:
      "Select your dates and guest count, then reserve directly through the listing — no fees, no middlemen. You'll receive confirmation and check-in details within minutes.",
  },
  {
    question: "What's your cancellation policy?",
    answer:
      "Most stays offer free cancellation up to 48 hours before check-in. Exact terms are shown on each listing before you confirm your booking.",
  },
  {
    question: "Is breakfast included?",
    answer:
      "It varies by property — look for the amenities listed on each hotel's page. Many of our boutique partners include breakfast as standard.",
  },
  {
    question: "Can I book for a group or event?",
    answer:
      "Yes. Reach out to our concierge team for group bookings, extended stays, or private events, and we'll coordinate directly with the property on your behalf.",
  },
  {
    question: "How do I list my own hotel?",
    answer:
      "Reach out through \"Become a host\" — our team will assess your property, arrange professional photography, and position it within our curated portfolio.",
  },
];

function PlusIcon({ open }: { open: boolean }) {
  const shouldReduceMotion = useReducedMotion();
  return (
    <motion.svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      className="shrink-0 text-[#ffe088]"
      animate={{ rotate: open ? 45 : 0 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.25, ease: [0.22, 1, 0.36, 1] }}
    >
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </motion.svg>
  );
}

export default function HotelFAQSection() {
  const [openIndex, setOpenIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="w-full bg-white px-8 py-16 md:py-24">
      <div className="mx-auto max-w-[1280px] rounded-[40px] bg-[#00261b] p-8 md:p-16 lg:p-20">
        <div className="mx-auto max-w-[820px] text-center">
          <h2 className={`${montserrat.className} text-[28px] font-semibold leading-tight text-white md:text-[36px]`}>
            <span className="text-[#ffe088]">We believe</span> great hospitality starts with asking the right
            questions — <span className="text-white">about comfort, service, and the way a stay shapes your
            trip.</span>
          </h2>
        </div>

        <StaggerContainer className="mt-16 grid gap-12 lg:grid-cols-2 lg:gap-16">
          <StaggerItem className="flex flex-col gap-4">
            <div className="group relative h-[320px] w-full overflow-hidden rounded-[24px] lg:h-full lg:min-h-[420px]">
              <Image
                src="/hotel/hotel-dusk-pool.jpg"
                alt="Labadi Seaside Suites"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div>
              <p className="text-sm text-white/50">Featured Stay</p>
              <p className="text-lg font-semibold text-white">Labadi Seaside Suites</p>
            </div>
          </StaggerItem>

          <div className="flex flex-col justify-center">
            {FAQS.map((faq, index) => {
              const open = index === openIndex;
              return (
                <StaggerItem key={faq.question} className="border-b border-white/10 py-5">
                  <button
                    type="button"
                    onClick={() => setOpenIndex(open ? -1 : index)}
                    aria-expanded={open}
                    className="flex w-full items-center justify-between gap-4 text-left"
                  >
                    <span className={`text-base font-semibold md:text-lg ${open ? "text-[#ffe088]" : "text-white"}`}>
                      {faq.question}
                    </span>
                    <PlusIcon open={open} />
                  </button>
                  <motion.div
                    initial={false}
                    animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
                    transition={{ duration: shouldReduceMotion ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="pt-3 text-sm leading-relaxed text-white/60 md:text-base">{faq.answer}</p>
                  </motion.div>
                </StaggerItem>
              );
            })}
          </div>
        </StaggerContainer>
      </div>
    </section>
  );
}
