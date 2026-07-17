import Image from "next/image";
import { montserrat } from "../landing-fonts";

const SUPPORTING_TEXT = [
  "By integrating innovative technologies and sustainable solutions, we ensure long-term value for both homeowners and investors.",
  "By uniting vision, precision and craftsmanship, we deliver exceptional residences that reflect confidence, quality and enduring distinction.",
];

export default function WhoWeAreSection() {
  return (
    <section id="who-we-are" className="w-full bg-white">
      <div className="mx-auto max-w-[1280px] px-8 py-16 md:py-24">
        <div className="mb-12 flex flex-col gap-3">
          <p className="text-sm font-semibold uppercase tracking-[1.4px] text-[#be4d00]">About Us</p>
          <h2 className={`${montserrat.className} text-[32px] font-semibold text-[#00261b] md:text-[40px]`}>
            Who we are
          </h2>
        </div>

        <div className="grid grid-cols-1 items-stretch gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col justify-between gap-10">
            <p className="text-2xl font-medium leading-relaxed text-[#414944] md:text-[28px]">
              We develop{" "}
              <span className="font-semibold text-[#00261b]">contemporary residences</span> where{" "}
              <span className="font-semibold text-[#00261b]">architecture, light and landscape</span> exist in{" "}
              <span className="font-semibold text-[#be4d00]">perfect balance</span>. Our focus is not just to
              build houses — but to create spaces that{" "}
              <span className="font-semibold text-[#be4d00]">elevate living</span>.
            </p>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              {SUPPORTING_TEXT.map((text) => (
                <p key={text} className="text-base leading-relaxed text-[#717974]">
                  {text}
                </p>
              ))}
            </div>
          </div>

          <div className="relative min-h-[320px] overflow-hidden rounded-3xl shadow-[0px_20px_40px_0px_rgba(26,26,26,0.08)]">
            <Image
              src="/landing/who-we-are.jpg"
              alt="Modern residence set among palm trees, where architecture, light and landscape meet"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
