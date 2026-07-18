"use client";

import Image from "next/image";
import Reveal from "@/components/motion/Reveal";
import { montserrat } from "@/app/home/landing-fonts";

const STATS = [
  { value: "0%", label: "Platform Surcharge" },
  { value: "100%", label: "Client Focused" },
];

export default function TransparencySection() {
  return (
    <section className="w-full bg-[#f0eded] px-5 py-16 md:px-16 md:py-24">
      <div className="mx-auto flex max-w-[1280px] flex-col items-center gap-12 lg:flex-row">
        <Reveal x={-24} y={0} className="flex flex-1 flex-col gap-6">
          <h2 className={`${montserrat.className} text-[32px] font-semibold leading-[1.25] text-[#00261b] md:text-[40px]`}>
            No hidden charges.
            <br />
            Just pure portfolio focus.
          </h2>
          <p className="text-lg text-[#414944]">
            At Festari Estates, we believe transparency is the bedrock of luxury service. Our fee structure is as
            solid as the foundations of our listings. We do not charge hidden maintenance fees, transaction
            surcharges, or opaque listing renewals.
          </p>
          <div className="flex gap-8 pt-1">
            {STATS.map((stat) => (
              <div key={stat.label} className="flex flex-1 flex-col gap-2">
                <p className="text-2xl font-semibold text-[#be4d00]">{stat.value}</p>
                <p className="text-sm font-semibold uppercase tracking-[0.35px] text-[#1c1b1b]">{stat.label}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal x={24} y={0} delay={0.1} className="relative h-[360px] w-full flex-1 overflow-hidden rounded-2xl md:h-[500px]">
          <Image
            src="/pricing/blueprint.jpg"
            alt="Architect reviewing estate blueprints"
            fill
            className="object-cover"
          />
        </Reveal>
      </div>
    </section>
  );
}
