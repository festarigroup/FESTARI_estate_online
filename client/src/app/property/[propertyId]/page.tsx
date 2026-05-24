import Image from "next/image";
import Link from "next/link";

const propertyNames: Record<number, string> = {
  1: "Large 4-room apartment with a beautiful terrace",
  2: "Modern 3-bedroom detached house with garden",
  3: "Cozy studio apartment near the city center",
  4: "Spacious penthouse with panoramic city views",
  5: "Newly built 2-bedroom semi-detached house",
  6: "Executive 5-bedroom villa with swimming pool",
  7: "Commercial property ideal for office space",
  8: "Furnished 2-bed apartment with 24hr security",
};

const CARD_GRADIENT = {
  background:
    "linear-gradient(0deg, rgba(80,80,80,0.15) 0%, rgba(80,80,80,0) 100%)",
};

const INFO_CARDS = [
  { label: "Price", value: "GHS 2,400/month" },
  { label: "Area", value: "760 m²" },
] as const;

const GALLERY_ITEMS = [
  { src: "/PropertyHeroSection.png", alt: "Property gallery image 1", className: "relative h-36 md:h-44 overflow-hidden" },
  { src: "/PropertyHeroSection.png", alt: "Property gallery image 2", className: "relative h-36 md:h-44 md:col-span-2 overflow-hidden" },
  { src: "/PropertyHeroSection.png", alt: "Property gallery image 3", className: "relative h-36 md:h-44 md:col-span-2 overflow-hidden" },
  { src: "/PropertyHeroSection.png", alt: "Property gallery image 4", className: "relative h-36 md:h-44 overflow-hidden" },
] as const;

const HIGHLIGHTS = [
  {
    icon: "⌂",
    title: "Self check-in",
    description: "Check yourself in with the lockbox.",
  },
  {
    icon: "Ⓟ",
    title: "Park for free",
    description: "This is one of the few places in the area with free parking.",
  },
  {
    icon: "◷",
    title: "Exceptional host communication",
    description: "Recent guests gave the host a 5-star rating for communication.",
  },
] as const;

const AMENITIES = [
  "◈ Wifi",
  "🗓 Long term stays allowed",
  "▭ Free parking on premises",
  "◫ Microwave",
  "▣ Television",
  "▯ Refrigerator",
  "❉ Air conditioning",
  "⚡ Backup power",
] as const;

const HOST_STATS = [
  { value: "15", label: "Reviews" },
  { value: "5.0★", label: "Rating" },
  { value: "3", label: "Months hosting" },
] as const;

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-gray-200 px-5 py-4" style={CARD_GRADIENT}>
      <p className="text-base leading-none text-gray-500">{label}</p>
      <p className="mt-2 text-xl leading-none font-light text-gray-900">{value}</p>
    </div>
  );
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ propertyId: string }>;
}) {
  const { propertyId } = await params;
  const numericId = Number(propertyId);
  const title = propertyNames[numericId] ?? "Featured Property";

  return (
    <section className="w-full px-6 py-8 md:px-10 md:py-10">
      <div className="relative w-full overflow-hidden">
        <div className="relative h-[clamp(370px,47vw,760px)] w-full">
          <Image
            src="/PropertyHeroSection.png"
            alt={title}
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />

          <div className="absolute inset-0 bg-black/10" />

          <h1 className="absolute bottom-5 left-4 z-10 text-3xl font-light tracking-tight text-white md:left-6 md:bottom-6 md:text-5xl">
            {title}
          </h1>

          <div className="absolute bottom-3 right-3 z-20 w-[clamp(220px,30vw,360px)] bg-white/95">
            <div className="grid grid-cols-3 border-b border-gray-200">
              <div className="px-2.5 py-2 text-center">
                <p className="text-[11px] font-medium text-gray-700 leading-tight">
                  Buyer
                  <br />
                  favorite
                </p>
              </div>
              <div className="px-2.5 py-2 text-center border-x border-gray-200">
                <p className="text-xl leading-none font-light text-gray-800">5.0</p>
                <div className="mt-1 flex justify-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <svg
                      key={index}
                      className="h-2 w-2"
                      viewBox="0 0 20 20"
                      fill="#BE4D00"
                      aria-hidden="true"
                    >
                      <path d="M10 1.5l2.5 5.1 5.6.8-4 3.9.9 5.6L10 14.2 5 16.9l.9-5.6-4-3.9 5.6-.8L10 1.5z" />
                    </svg>
                  ))}
                </div>
              </div>
              <div className="px-2.5 py-2 text-center">
                <p className="text-xl leading-none font-light text-gray-800">50</p>
                <p className="text-[10px] text-gray-500">Reviews</p>
              </div>
            </div>

            <button
              type="button"
              className="w-full bg-[#BE4D00] px-6 py-2 text-base leading-none font-medium text-white hover:bg-[#a54300] transition-colors"
            >
              Contact agent
            </button>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between">
          <Link
            href="/property"
            className="inline-flex items-center gap-2 border border-gray-200 bg-white px-4 py-2 text-sm leading-none text-gray-500 hover:bg-gray-50 transition-colors"
          >
            <span aria-hidden="true">←</span> Back to properties
          </Link>

          <Link
            href={numericId < 8 ? `/property/${numericId + 1}` : "/property/1"}
            className="inline-flex items-center gap-2 bg-[#BE4D00] px-5 py-2 text-sm leading-none text-white hover:bg-[#a54300] transition-colors"
          >
            Next <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="mt-10 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {INFO_CARDS.map((card) => (
              <InfoCard key={card.label} label={card.label} value={card.value} />
            ))}
          </div>

          <InfoCard label="Address" value="Airport Residential, Accra" />

          <p className="pt-2 text-lg leading-relaxed text-gray-500">
            Available for both short- and long-term stays, this property
            offers a cozy and serene environment with full access to the
            entire space. Located in a prime area, it is ideal for those
            seeking a peaceful stay with privacy and security. Assistance
            is provided remotely through the app.
          </p>
        </div>

        <div className="mt-14 border-t border-gray-200 pt-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {GALLERY_ITEMS.map((item, index) => (
              <div key={item.alt} className={item.className}>
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover"
                  sizes={
                    index === 1 || index === 2
                      ? "(max-width: 768px) 100vw, 66vw"
                      : "(max-width: 768px) 100vw, 33vw"
                  }
                />
                {index === 3 ? (
                  <button
                    type="button"
                    className="absolute inset-x-6 bottom-6 bg-white/95 text-[#2D1768] text-sm font-medium py-2 hover:bg-white transition-colors"
                  >
                    See more photos
                  </button>
                ) : null}
              </div>
            ))}
          </div>

          <div className="mt-12 border-t border-gray-200 pt-8 space-y-6">
            {HIGHLIGHTS.map((highlight) => (
              <div key={highlight.title} className="flex items-start gap-3">
                <span className="mt-1 text-gray-700">{highlight.icon}</span>
                <div>
                  <p className="text-base font-light text-gray-900">{highlight.title}</p>
                  <p className="text-sm text-gray-500">{highlight.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-14">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              What this place offers
            </h2>
            <p className="mt-3 text-lg leading-relaxed text-gray-500 max-w-[1200px]">
              Enjoy a range of amenities designed to make your stay comfortable and
              convenient. From essential services to thoughtful extras, everything
              is prepared for a relaxing experience.
            </p>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-x-14 gap-y-4 text-sm text-gray-900">
              {AMENITIES.map((amenity) => (
                <p key={amenity}>{amenity}</p>
              ))}
            </div>
          </div>

          <div className="mt-14 border-t border-gray-200 pt-10">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              Location
            </h2>
            <p className="mt-2 text-base text-gray-500 max-w-5xl">
              Find us easily with the map below. Explore our exact location and
              nearby landmarks. Use Google Maps to get quick directions to the
              property.
            </p>

            <div className="mt-5 relative w-full aspect-[16/7] overflow-hidden border border-gray-200">
              <Image
                src="/location-map-placeholder.svg"
                alt="Location map placeholder"
                fill
                className="object-cover"
                sizes="100vw"
              />
            </div>
          </div>

          <div className="mt-14 border-t border-gray-200 pt-10">
            <h2 className="text-2xl font-light tracking-tight text-gray-900">
              Meet your host
            </h2>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-12">
              <div>
                <div className="flex items-start gap-6">
                  <div className="flex flex-col items-center min-w-[112px]">
                    <div className="relative w-[94px] h-[94px] rounded-full bg-[#1F2127] text-white flex items-center justify-center text-[38px] font-light">
                      D
                      <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-[#F59E0B] border-2 border-white text-[13px] leading-none text-white flex items-center justify-center">
                        ✿
                      </span>
                    </div>
                    <p className="mt-2 text-xl leading-none font-medium text-gray-900">
                      Daniel
                    </p>
                    <p className="mt-1 text-base text-gray-500">Host</p>
                  </div>

                  <div className="w-full max-w-[220px]">
                    {HOST_STATS.map((stat, idx) => (
                      <div
                        key={stat.label}
                        className={idx < HOST_STATS.length - 1 ? "py-2 border-b border-gray-200" : "py-2"}
                      >
                        <p className="text-xl leading-none font-medium text-gray-900">
                          {stat.value}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5 space-y-2 text-sm text-gray-500">
                  <p>♡ Born in the 80s</p>
                  <p>⌂ Works at Accra, Within 10km</p>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-gray-500 max-w-md">
                  I focus on delivering safe, neat, and reliable property
                  listings. I believe in simple, quality solutions you can trust.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-light text-gray-900">Host details</h3>
                <p className="mt-3 text-sm text-gray-500">Response rate: 100%</p>
                <p className="mt-1 text-sm text-gray-500">Responds within an hour</p>

                <button
                  type="button"
                  className="mt-4 px-3 py-1.5 border border-gray-200 bg-gray-50 text-xs text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Message
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
