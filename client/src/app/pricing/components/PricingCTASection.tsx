"use client";

import toast from "react-hot-toast";
import { montserrat } from "@/app/home/landing-fonts";
import OrbitVectorBackground from "@/app/home/components/decor/OrbitVectorBackground";

export default function PricingCTASection() {
  return (
    <section className="relative flex h-[480px] w-full items-center justify-center overflow-hidden bg-[#fcf9f8] px-6">
      <OrbitVectorBackground />

      <div className="relative z-10 mx-auto flex max-w-[672px] flex-col items-center gap-8 text-center">
        <div className="flex flex-col gap-4">
          <h2
            className={`${montserrat.className} text-[32px] font-semibold leading-[1.2] text-[#00261b] md:text-[40px]`}
          >
            Your Journey as a Curator Begins Here
          </h2>
          <p className="text-lg text-[#414944]">Join over 150,000 global investors and curators today.</p>
        </div>

        <button
          type="button"
          onClick={() => toast.success("Your 14-day trial has started — welcome to Festari Estates.")}
          className="whitespace-nowrap rounded-xl bg-[#be4d00] px-4 py-3.5 text-lg text-white transition-colors hover:bg-[#a54300]"
        >
          Start a trial
        </button>
      </div>
    </section>
  );
}
