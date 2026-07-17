"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { montserrat } from "../landing-fonts";
import { mockSubscribeNewsletter } from "@/lib/mockApi";
import OrbitVectorBackground from "./decor/OrbitVectorBackground";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await mockSubscribeNewsletter(email);
      if (res.success) {
        toast.success("You're on the list! Watch your inbox for rare opportunities.");
        setEmail("");
      } else {
        toast.error(res.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative w-full overflow-hidden bg-[#fcf9f8]">
      <OrbitVectorBackground />
      <div className="relative mx-auto flex max-w-[672px] flex-col items-center gap-6 px-8 py-16 text-center md:py-24">
        <h2 className={`${montserrat.className} text-[32px] font-semibold text-[#00261b] md:text-[40px]`}>
          Stay Informed on Rare Opportunities
        </h2>
        <p className="text-lg text-[#414944]">
          Subscribe to our weekly curated insights and receive early access to unlisted legacy estates.
        </p>

        <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4 pt-2 sm:flex-row">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your professional email"
            disabled={loading}
            className="flex-1 rounded-full border border-[#c0c8c3] bg-white px-8 py-5 text-base text-[#0f1621] placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#be4d00] disabled:opacity-70"
          />
          <button
            type="submit"
            disabled={loading}
            className="whitespace-nowrap rounded-xl bg-[#be4d00] px-4 py-3.5 text-lg text-white transition-colors hover:bg-[#a54300] disabled:opacity-70"
          >
            {loading ? "Joining…" : "Join the Exclusive list"}
          </button>
        </form>

        <p className="text-xs text-[#717974]">
          By subscribing, you agree to our Privacy Policy regarding the handling of your data.
        </p>
      </div>
    </section>
  );
}
