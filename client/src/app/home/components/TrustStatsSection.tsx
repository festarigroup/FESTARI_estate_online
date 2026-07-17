import { montserrat } from "../landing-fonts";

type Stat = {
  value: string;
  suffix?: string;
  description: string;
};

const STATS: Stat[] = [
  {
    value: "3,279+",
    description: "Exclusive property listings across 42 countries, curated for the modern investor.",
  },
  {
    value: "82+",
    description: "Global awards for excellence in digital hospitality and real estate innovation.",
  },
  {
    value: "10",
    suffix: "years",
    description: 'Of defining the "Quiet Luxury" experience for a discerning international clientele.',
  },
];

export default function TrustStatsSection() {
  return (
    <section className="w-full bg-[#f6f3f2]">
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-6 px-8 py-16 sm:grid-cols-3">
        {STATS.map((stat, i) => (
          <div
            key={stat.value}
            className={`flex flex-col gap-2 px-8 py-8 ${
              i < STATS.length - 1 ? "border-b border-[rgba(192,200,195,0.3)] sm:border-b-0 sm:border-r" : ""
            }`}
          >
            <p className={`${montserrat.className} text-[64px] font-bold leading-[70px] tracking-[-1.28px] text-[#be4d00]`}>
              {stat.value}
              {stat.suffix && <span className="ml-1 text-2xl font-semibold">{stat.suffix}</span>}
            </p>
            <p className="text-base leading-[25.6px] text-[#0f1621]">{stat.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
