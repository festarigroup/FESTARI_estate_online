"use client";

import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import LandingNavbar from "@/app/home/components/LandingNavbar";
import LandingFooter from "@/app/home/components/LandingFooter";
import OrbitVectorBackground from "@/app/home/components/decor/OrbitVectorBackground";
import { montserrat } from "@/app/home/landing-fonts";
import { mockSubscribeNewsletter } from "@/lib/mockApi";
import Reveal from "@/components/motion/Reveal";

function ArrowLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M19 12H5m0 0 7 7m-7-7 7-7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ComingSoonPage({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await mockSubscribeNewsletter(email);
      if (res.success) {
        toast.success("You're on the list! We'll let you know the moment this goes live.");
        setEmail("");
      } else {
        toast.error(res.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#00261b] px-5">
        <OrbitVectorBackground />

        <LandingNavbar overlay />

        <Reveal className="relative z-10 flex max-w-[560px] flex-col items-center gap-6 py-24 text-center">
          <span className="w-fit rounded-full bg-[#be4d00]/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-[1.4px] text-[#fb7933]">
            Coming Soon
          </span>

          <h1 className={`${montserrat.className} text-[32px] font-semibold leading-[1.15] text-white md:text-[40px]`}>
            {title}
          </h1>

          <p className="text-lg text-white/70">{description}</p>

          <form onSubmit={handleSubmit} className="flex w-full flex-col gap-3 pt-2 sm:flex-row">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              disabled={loading}
              className="flex-1 rounded-full border border-white/20 bg-white/10 px-6 py-3.5 text-base text-white placeholder:text-white/50 focus:outline-none focus:ring-1 focus:ring-[#be4d00] disabled:opacity-70"
            />
            <button
              type="submit"
              disabled={loading}
              className="whitespace-nowrap rounded-xl bg-[#be4d00] px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-[#a54300] disabled:opacity-70"
            >
              {loading ? "Joining…" : "Notify me"}
            </button>
          </form>

          <Link
            href="/home"
            className="flex items-center gap-2 pt-2 text-sm font-semibold tracking-[0.7px] text-white underline-offset-4 hover:underline"
          >
            <ArrowLeftIcon />
            Back to Home
          </Link>
        </Reveal>
      </section>

      <LandingFooter />
    </>
  );
}
