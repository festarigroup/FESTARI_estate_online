"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

const NAV_LINKS = [
  { label: "Features", href: "#holistic-services" },
  { label: "Real Estates", href: "/property" },
  { label: "Venues", href: "/services" },
  { label: "Artisans", href: "/services" },
  { label: "Pricings", href: "#featured-estates" },
];

export default function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="sticky top-0 z-50 flex justify-center px-5 pt-5 md:px-8">
      <motion.nav
        initial={false}
        animate={{
          borderRadius: scrolled ? 20 : 64,
          paddingTop: scrolled ? 12 : 16,
          paddingBottom: scrolled ? 12 : 16,
          backgroundColor: scrolled ? "rgba(0,38,27,0.92)" : "rgba(0,0,0,0.15)",
        }}
        transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="flex w-full max-w-[1152px] items-center justify-center border border-white/20 px-8 backdrop-blur-md"
      >
        <div className="flex w-full items-center justify-between gap-8">
          <div className="flex items-center gap-12">
            <Link href="/home" className="shrink-0">
              <Image
                src="/auth-logo-mark.png"
                alt="Festari Estates"
                width={44}
                height={44}
                className="h-11 w-auto [filter:brightness(0)_invert(1)]"
                priority
              />
            </Link>
            <div className="hidden items-center gap-8 lg:flex">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`text-[16px] font-medium tracking-[0.7px] transition-colors ${
                    link.label === "Features"
                      ? "border-b-2 border-[#fb7933] pb-1.5 font-semibold text-[#fb7933]"
                      : "text-white hover:text-[#fb7933]"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-6">
            <Link
              href="/signup"
              className="whitespace-nowrap rounded-xl bg-[#be4d00] px-4 py-3.5 text-[18px] font-normal text-white transition-colors hover:bg-[#a54300]"
            >
              Become a host
            </Link>
            <Link
              href="/login"
              aria-label="Account"
              className="flex size-8 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12Zm0 2.4c-3.5 0-9.9 1.9-9.9 5.6v1.8h19.8v-1.8c0-3.7-6.4-5.6-9.9-5.6Z"
                  fill="currentColor"
                />
              </svg>
            </Link>
          </div>
        </div>
      </motion.nav>
    </div>
  );
}
