import Image from "next/image";
import Link from "next/link";

type DashboardCard = {
  title: string;
  description: string;
  imageSrc?: string;
  imageAlt?: string;
};

type DashboardWorksSectionProps = {
  title?: string;
  subtitle?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  cards?: DashboardCard[];
  sectionId?: string;
};

function ArrowRight() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DashboardInfoCard({ card }: { card: DashboardCard }) {
  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-sm overflow-hidden">
      <div className="relative w-full aspect-[16/9] bg-gray-100">
        <Image
          src={card.imageSrc ?? "/dashboard-placeholder.svg"}
          alt={card.imageAlt ?? card.title}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 42vw"
        />
      </div>
      <div className="p-6">
        <h3 className="text-sm font-semibold text-gray-900">{card.title}</h3>
        <p className="mt-2 text-sm text-gray-500 leading-relaxed">
          {card.description}
        </p>
      </div>
    </div>
  );
}

export default function DashboardWorksSection({
  title = "Your dashboard\nworks for you",
  subtitle = "Each user type gets a tailored experience. Manage listings, track inquiries, and grow your business from one place.",
  primaryCta = { label: "Find your services", href: "/services" },
  secondaryCta = { label: "Contact us", href: "/contact" },
  cards = [
    {
      title: "Seller tools",
      description:
        "List properties with photos and details. Track interested buyers in real time.",
    },
    {
      title: "Buyer tools",
      description:
        "Save favourite properties and compare options. Message sellers directly through the platform.",
    },
    {
      title: "Artisan tools",
      description:
        "Showcase your work with a portfolio. Accept jobs and manage your schedule.",
    },
    {
      title: "Venue tools",
      description:
        "Display your space with high-quality images. Handle bookings and payments seamlessly.",
    },
  ],
  sectionId = "dashboard-works",
}: DashboardWorksSectionProps) {
  const stackScrollHeightVh = Math.max(140, cards.length * 70);

  return (
    <section id={sectionId} className="w-full bg-white">
      <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6 py-10 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div className="pt-2 lg:sticky lg:top-[40%] lg:-translate-y-1/2 self-start">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 whitespace-pre-line">
              {title}
            </h2>
            <p className="mt-6 text-sm md:text-base text-gray-500 leading-relaxed max-w-xl">
              {subtitle}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href={primaryCta.href}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#BE4D00] text-white text-sm font-semibold rounded
                           hover:bg-[#a54300] transition-colors"
              >
                {primaryCta.label} <ArrowRight />
              </Link>
              <Link
                href={secondaryCta.href}
                className="inline-flex items-center justify-center px-5 py-2.5 border border-gray-300 text-gray-900 text-sm font-semibold rounded
                           hover:bg-gray-50 transition-colors"
              >
                {secondaryCta.label}
              </Link>
            </div>
          </div>

          <div className="relative">
            {/* Mobile: simple list. Desktop: stacked sticky cards that layer while scrolling. */}
            <div className="flex flex-col gap-8 lg:hidden">
              {cards.map((card) => (
                <DashboardInfoCard key={card.title} card={card} />
              ))}
            </div>

            <div
              className="hidden lg:block relative"
              style={{ height: `${stackScrollHeightVh}vh` }}
            >
              {cards.map((card, idx) => {
                const topPx = 96 + idx * 18; // creates the "layer" offsets

                return (
                  <div
                    key={card.title}
                    className="lg:sticky"
                    style={{
                      top: topPx,
                      zIndex: idx + 1,
                    }}
                  >
                    <DashboardInfoCard card={card} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

