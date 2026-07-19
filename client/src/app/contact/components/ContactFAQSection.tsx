"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { montserrat } from "@/app/home/landing-fonts";
import { StaggerContainer, StaggerItem } from "@/components/motion/Stagger";

const FAQS = [
  {
    question: "How quickly will I hear back from your team?",
    answer:
      "Our concierges respond to every inquiry within one business day, and often much sooner. Priority-tier members receive same-day responses.",
  },
  {
    question: "Can I schedule a private consultation?",
    answer:
      "Yes. Mention your preferred time zone in your message and a dedicated consultant will reach out to arrange a call or in-person meeting.",
  },
  {
    question: "Do you handle international property inquiries?",
    answer:
      "Absolutely — our hubs in London, New York, and Tarkwa coordinate cross-border acquisitions, due diligence, and relocation support.",
  },
  {
    question: "Is there a dedicated concierge for Legacy members?",
    answer:
      "Legacy members are paired with a named concierge who oversees every request personally, from viewings to artisan commissions.",
  },
  {
    question: "What information should I include in my message?",
    answer:
      "Let us know the type of inquiry, your timeline, and any specific properties, hotels, or artisans you have in mind — the more context, the faster we can help.",
  },
];

function ChevronIcon({ open }: { open: boolean }) {
  const shouldReduceMotion = useReducedMotion();
  return (
    <motion.svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      className="shrink-0 text-[#414944]"
      animate={{ rotate: open ? 180 : 0 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.25, ease: [0.22, 1, 0.36, 1] }}
    >
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </motion.svg>
  );
}

export default function ContactFAQSection() {
  const [openIndex, setOpenIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="w-full bg-[#f0eded] px-5 py-16 md:px-16 md:py-24">
      <div className="mx-auto flex max-w-[1280px] flex-col items-center gap-16">
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-sm font-semibold uppercase tracking-[2.8px] text-[#00261b]">Intellectual Concierge</p>
          <h2 className={`${montserrat.className} text-[32px] font-semibold text-[#00261b] md:text-[40px]`}>
            Frequently Asked Questions
          </h2>
        </div>

        <StaggerContainer className="flex w-full max-w-[820px] flex-col gap-4">
          {FAQS.map((faq, index) => {
            const open = index === openIndex;
            return (
              <StaggerItem key={faq.question}>
                <div
                  className={`rounded-2xl border bg-white px-6 py-5 transition-shadow ${
                    open ? "border-[#be4d00]/30 shadow-[0px_25px_50px_-33px_rgba(0,0,0,0.25)]" : "border-[#e5e2e1]"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(open ? -1 : index)}
                    aria-expanded={open}
                    className="flex w-full items-center justify-between gap-4 text-left"
                  >
                    <span className="text-base font-semibold text-[#00261b] md:text-lg">{faq.question}</span>
                    <ChevronIcon open={open} />
                  </button>
                  <motion.div
                    initial={false}
                    animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
                    transition={{ duration: shouldReduceMotion ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="pt-3 text-sm leading-relaxed text-[#717974] md:text-base">{faq.answer}</p>
                  </motion.div>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
