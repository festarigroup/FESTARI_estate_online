"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { montserrat } from "@/app/home/landing-fonts";

const FAQS = [
  {
    question: "What makes Festari Estates different?",
    answer:
      "Every listing is personally vetted by our estate specialists. We pair rigorous due diligence with a concierge-level buying experience, so every property you see here is one we'd stand behind ourselves.",
  },
  {
    question: "How does the buying process work?",
    answer:
      "Start with a private consultation with one of our estate specialists. From there we arrange viewings, handle due diligence, and coordinate with legal counsel through to closing.",
  },
  {
    question: "Can I schedule a private viewing?",
    answer:
      "Yes. Every listing offers private, by-appointment viewings arranged directly through your assigned specialist, with virtual walkthroughs available for international buyers.",
  },
  {
    question: "Are financing options available?",
    answer:
      "We partner with a small number of trusted mortgage and private banking partners who work exclusively with our buyers to structure financing discreetly.",
  },
  {
    question: "What's included in the asking price?",
    answer:
      "Each listing price reflects the property as shown, including any fixtures noted in the description. Furnishings, art, and vehicles are negotiated separately unless stated otherwise.",
  },
  {
    question: "How do I list my own property?",
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

export default function PropertyFAQSection() {
  const [openIndex, setOpenIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="w-full bg-white px-8 py-16 md:py-24">
      <div className="mx-auto max-w-[1280px] rounded-[40px] bg-[#00261b] p-8 md:p-16 lg:p-20">
        <div className="mx-auto max-w-[820px] text-center">
          <h2 className={`${montserrat.className} text-[28px] font-semibold leading-tight text-white md:text-[36px]`}>
            <span className="text-[#ffe088]">We believe</span> great real estate starts with asking the right
            questions — <span className="text-white">about lifestyle, location, and the way a home shapes everyday
            life.</span>
          </h2>
        </div>

        <div className="mt-16 grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col gap-4">
            <div className="relative h-[320px] w-full overflow-hidden rounded-[24px] lg:h-full lg:min-h-[420px]">
              <Image
                src="/property/azure-cliffside-villa.jpg"
                alt="Azure Cliffside Villa"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div>
              <p className="text-sm text-white/50">Featured Development</p>
              <p className="text-lg font-semibold text-white">Azure Cliffside Villa</p>
            </div>
          </div>

          <div className="flex flex-col justify-center">
            {FAQS.map((faq, index) => {
              const open = index === openIndex;
              return (
                <div key={faq.question} className="border-b border-white/10 py-5">
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
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
