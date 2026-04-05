import React from "react";

export type MarqueeStat = {
  value: string;
  label: string;
};

type StatsMarqueeProps = {
  stats: MarqueeStat[];
  durationSeconds?: number;
  repeat?: number;
  sectionId?: string;
  className?: string;
};

export default function StatsMarquee({
  stats,
  durationSeconds = 25,
  repeat = 2,
  sectionId = "stats-marquee",
  className = "w-full bg-white border-y border-gray-100 py-6 overflow-hidden",
}: StatsMarqueeProps) {
  return (
    <section id={sectionId} className={className}>
      <div
        className="flex animate-marquee whitespace-nowrap"
        style={{ animationDuration: `${durationSeconds}s` }}
      >
        {Array.from({ length: repeat }).map((_, setIdx) => (
          <div key={setIdx} className="flex items-center shrink-0">
            {stats.map((stat, statIdx) => (
              <div
                key={`${stat.value}-${stat.label}-${statIdx}`}
                className="flex flex-col items-center px-12"
              >
                <span className="text-2xl md:text-3xl font-bold text-[#BE4D00]">
                  {stat.value}
                </span>
                <span className="text-xs md:text-sm text-gray-500 font-medium mt-1">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

