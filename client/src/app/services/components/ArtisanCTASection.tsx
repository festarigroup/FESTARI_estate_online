"use client";

import Image from "next/image";
import toast from "react-hot-toast";
import { montserrat } from "@/app/home/landing-fonts";

export default function ArtisanCTASection() {
  return (
    <section className="relative flex h-[556px] w-full items-center justify-center overflow-hidden bg-gradient-to-b from-[#616161] to-[#00261b] px-6 py-[120px]">
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <Image
          src="/artisans/newsletter-bg.svg"
          alt=""
          width={2066}
          height={450}
          className="w-[160%] max-w-none md:w-full"
        />
      </div>

      <div className="relative z-10 mx-auto flex max-w-[768px] flex-col items-center gap-10">
        <div className="flex flex-col items-center gap-4">
          <h2
            className={`${montserrat.className} text-center text-[42px] font-bold leading-[1.1] tracking-[-1.28px] text-white sm:text-[52px] md:text-[64px] md:leading-[70px]`}
          >
            Your Vision, Their Masterpiece
          </h2>
          <p className="text-center text-lg text-[#aeaeae]">
            Collaborate directly with our master artisans to create one-of-a-kind furniture, finishes, and features
            tailored for your estate.
          </p>
        </div>

        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={() => toast.success("Thanks for your interest — our guild team will reach out shortly.")}
            className="whitespace-nowrap rounded-xl bg-[#be4d00] px-4 py-3.5 text-lg text-white transition-colors hover:bg-[#a54300]"
          >
            Become artisan
          </button>
          <button
            type="button"
            onClick={() => toast.success("A consultant will be in touch to schedule your session.")}
            className="whitespace-nowrap rounded-xl border border-[#be4d00] bg-white px-4 py-3.5 text-lg text-[#be4d00] transition-colors hover:bg-[#be4d00]/5"
          >
            Consultancy
          </button>
        </div>
      </div>
    </section>
  );
}
