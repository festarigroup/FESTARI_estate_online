import type { Metadata } from "next";
import PropertyTypeSearchBar from "@/components/property/PropertyTypeSearchBar";

export const metadata: Metadata = {
  title: "Properties | Festari Estate",
  description:
    "Browse available properties for sale and rent on Festari Estates.",
};

export default function PropertyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col p-4 ">
      {/* Hero Banner */}
      <div className="relative -mt-2 pt-3 md:-mt-3">
        <div className="relative h-[clamp(320px,46vw,700px)]">
          <p className="absolute left-1/2 top-[clamp(1.2rem,3.2vw,2.8rem)] z-20 -translate-x-1/2 text-[11px] leading-none sm:text-xs md:text-sm">
            Transforming the future of home living
          </p>

          <h2 className="absolute inset-x-0 top-[clamp(1.75rem,4.1vw,3.75rem)] z-0 w-full text-center text-[clamp(4.2rem,14vw,11.3rem)] font-black uppercase text-[#BE4D00]">
            Property
          </h2>

          <div className="absolute inset-x-0 bottom-[-2.5rem] z-10 flex justify-center">
            <img
              src="/PropertyHeroSection.png"
              alt="Modern property building"
              className="pointer-events-none h-[clamp(240px,46vw,735px)] w-auto"
            />
          </div>

          <div className="absolute left-4 top-[225px] z-20 sm:left-8 sm:top-[245px] md:left-20 md:top-[305px] lg:left-24 lg:top-[370px] xl:left-32 xl:top-[445px] 2xl:left-44 2xl:top-[520px]">
            <p className="max-w-[120px] text-[10px] leading-tight text-gray-500 sm:max-w-[135px] sm:text-[11px] md:max-w-[148px] md:text-[12px]">
              Start your journey towards home ownership today!
            </p>
            <button
              type="button"
              className="mt-2 bg-[#BE4D00] px-3 py-1.5 text-[10px] font-semibold text-white sm:px-3.5 sm:py-1.5 sm:text-[11px] md:text-[12px]"
            >
              List property
            </button>
          </div>

          <div className="absolute right-3 top-[225px] z-20 flex flex-col gap-1 sm:right-8 sm:top-[245px] md:right-20 md:top-[305px] lg:right-24 lg:top-[370px] xl:right-32 xl:top-[445px] 2xl:right-44 2xl:top-[520px]">
            <span className="inline-flex items-center border border-[#E2AE8A] bg-white/90 px-3 py-1.5 text-[10px] text-gray-500 sm:text-[11px] md:text-[12px]">
              Modern home
            </span>
            <div className="flex gap-1">
              <span className="border border-[#E2AE8A] bg-white/90 px-3 py-1.5 text-[10px] text-gray-500 sm:text-[11px] md:text-[12px]">
                Luxury
              </span>
              <span className="border border-[#E2AE8A] bg-white/90 px-3 py-1.5 text-[10px] text-gray-500 sm:text-[11px] md:text-[12px]">
                Eco-friendly
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Intro Text */}
      <h1 className="text-center text-5xl font-bold text-gray-800">
      Featured Properties
      </h1>

      {/* Filter Strip */}
      <div className="mt-6 flex justify-center">
        <div className="inline-flex items-center gap-8 border border-[#D06A2C] px-5 py-2.5">
          <button className="text-sm text-gray-600 hover:text-[#BE4D00] transition-colors">
            Property
          </button>
          <button className="text-sm text-gray-600 hover:text-[#BE4D00] transition-colors">
            Location
          </button>
          <button className="text-sm text-gray-600 hover:text-[#BE4D00] transition-colors">
            Pricing
          </button>

          <button
            type="button"
            aria-label="Open filters"
            className="ml-1 h-8 w-8 rounded-full bg-[#BE4D00] text-white flex items-center justify-center"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 5h18l-7 8v6l-4-2v-4L3 5z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Property Type Search Bar */}
      <PropertyTypeSearchBar />

      <h3 className="text-3xl text-center mt-10">Homes selected just for you</h3>

      {/* Page Content */}
      <div className="mt-8">{children}</div>
    </div>
  );
}
