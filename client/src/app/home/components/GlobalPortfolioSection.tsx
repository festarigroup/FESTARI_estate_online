"use client";

import { useState } from "react";
import { montserrat } from "../landing-fonts";

type Region = {
  name: string;
  top: string;
  left: string;
  properties: number;
};

const REGIONS: Region[] = [
  { name: "Greater Accra", top: "68%", left: "58%", properties: 248 },
  { name: "Western", top: "80%", left: "32%", properties: 96 },
  { name: "Upper East", top: "18%", left: "48%", properties: 41 },
];

function PinIcon({ active }: { active: boolean }) {
  return (
    <svg width="27" height="33" viewBox="0 0 24 30" fill="none">
      <path
        d="M12 0C5.4 0 0 5.4 0 12c0 9 12 18 12 18s12-9 12-18c0-6.6-5.4-12-12-12Z"
        fill={active ? "#be4d00" : "#ffffff"}
        stroke={active ? "#fff" : "#00261b"}
        strokeWidth="1.5"
      />
      <circle cx="12" cy="12" r="4.5" fill={active ? "#fff" : "#00261b"} />
    </svg>
  );
}

export default function GlobalPortfolioSection() {
  const [activeRegion, setActiveRegion] = useState(REGIONS[0]);

  return (
    <section className="w-full bg-[#fcf9f8]">
      <div className="mx-auto max-w-[1280px] px-8 py-16 md:py-24">
        <div className="flex flex-col overflow-hidden rounded-[40px] bg-[#00261b] shadow-2xl lg:flex-row">
          <div className="flex flex-col gap-6 p-10 lg:w-[384px] lg:shrink-0">
            <h2 className={`${montserrat.className} text-[32px] font-semibold leading-tight text-white md:text-[40px]`}>
              Explore the Global Portfolio
            </h2>
            <p className="text-lg text-white/70">
              Select a region to discover curated opportunities and localized expert insights.
            </p>
            <div className="flex flex-col gap-4">
              {REGIONS.map((region) => (
                <button
                  key={region.name}
                  type="button"
                  onClick={() => setActiveRegion(region)}
                  className={`flex items-center justify-between rounded-2xl border p-5 text-left transition-colors ${
                    activeRegion.name === region.name
                      ? "border-[#be4d00] bg-[#be4d00]/20"
                      : "border-white/10 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <span className="text-base font-bold text-white">{region.name}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M9 6l6 6-6 6"
                      stroke="currentColor"
                      className="text-white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              ))}
            </div>
          </div>

          <div className="relative min-h-[420px] flex-1 bg-[#e5e2e1] lg:min-h-[700px]">
            <div
              className="absolute inset-0 opacity-70"
              style={{
                backgroundImage: "radial-gradient(circle, rgba(0,38,27,0.18) 1.5px, transparent 1.5px)",
                backgroundSize: "22px 22px",
              }}
            />
            {REGIONS.map((region) => (
              <button
                key={region.name}
                type="button"
                onClick={() => setActiveRegion(region)}
                aria-label={`View ${region.name}`}
                style={{ top: region.top, left: region.left }}
                className="absolute -translate-x-1/2 -translate-y-full transition-transform hover:scale-110"
              >
                <PinIcon active={activeRegion.name === region.name} />
              </button>
            ))}

            <div className="absolute bottom-8 right-8 max-w-[320px] rounded-xl border border-white/20 bg-[rgba(252,249,248,0.85)] p-4 backdrop-blur-md">
              <p className="text-sm font-semibold tracking-[0.7px] text-[#00261b]">
                Currently Viewing: {activeRegion.name}
              </p>
              <p className="text-xs text-[#414944]">{activeRegion.properties} Premium Properties Available</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
