import Image from "next/image";
import Link from "next/link";

const hotelNames: Record<number, string> = {
  1: "Labadi Seaside Suites",
  2: "East Legon Grand Hotel",
  3: "Kumasi City Comfort Inn",
  4: "Takoradi Palm Residences",
  5: "Cantonments Skyline Hotel",
  6: "Osu Boutique Stay",
  7: "Ridge Executive Suites",
  8: "Airport City Inn",
  9: "Koforidua Hillview Lodge",
  10: "Tamale Heritage Hotel",
  11: "Cape Coast Ocean Breeze",
  12: "Ho Garden Retreat",
};

const CARD_GRADIENT = {
  background:
    "linear-gradient(0deg, rgba(80,80,80,0.15) 0%, rgba(80,80,80,0) 100%)",
};

const INFO_CARDS = [
  { label: "Average Price", value: "GHS 2,400/month" },
  { label: "Area", value: "760 m²" },
] as const;

const GALLERY_ITEMS = [
  { src: "/HotelHeroSection.jpg", alt: "Hotel gallery image 1", className: "relative h-36 md:h-44 overflow-hidden" },
  { src: "/detailedhotelherosection.jpg", alt: "Hotel gallery image 2", className: "relative h-36 md:h-44 md:col-span-2 overflow-hidden" },
  { src: "/HotelHeroSection.jpg", alt: "Hotel gallery image 3", className: "relative h-36 md:h-44 md:col-span-2 overflow-hidden" },
  { src: "/detailedhotelherosection.jpg", alt: "Hotel gallery image 4", className: "relative h-36 md:h-44 overflow-hidden" },
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
    description: "Recent guests gave Dominic Dk a 5-star rating for communication.",
  },
] as const;

const AMENITIES = [
  "◈ Wifi",
  "🗓 Long term stays allowed",
  "▭ Free parking on premises",
  "◫ Microwave",
  "▣ Television",
  "▯ Akai refrigerator",
  "❉ Air conditioning",
  "⚡ Air conditioning",
] as const;

const HOST_STATS = [
  { value: "15", label: "Reviews" },
  { value: "5.0★", label: "Rating" },
  { value: "3", label: "Months hosting" },
] as const;

function StarRow() {
  return (
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
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-gray-200 px-4 py-3" style={CARD_GRADIENT}>
      <p className="text-base leading-none text-gray-500">{label}</p>
      <p className="mt-2 text-3xl leading-none font-light text-gray-900">{value}</p>
    </div>
  );
}

export default async function HotelDetailPage({
  params,
}: {
  params: Promise<{ hotelId: string }>;
}) {
  const { hotelId } = await params;
  const numericId = Number(hotelId);
  const title = hotelNames[numericId] ?? "FirstClass Hotel";

  return (
    <section className="w-full px-3 py-3 md:px-4 md:py-4">
      <div className="relative w-full overflow-hidden">
        <div className="relative h-[clamp(370px,47vw,760px)] w-full">
          <Image
            src="/detailedhotelherosection.jpg"
            alt={title}
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />

          <div className="absolute inset-0 bg-black/10" />

          <h1 className="absolute bottom-5 left-4 z-10 text-3xl font-light tracking-tight text-white md:left-6 md:bottom-6 md:text-5xl">
            FirstClass Hotel
          </h1>

          <div className="absolute bottom-3 right-3 z-20 w-[clamp(220px,30vw,360px)] bg-white/95">
            <div className="grid grid-cols-3 border-b border-gray-200">
              <div className="px-2.5 py-2 text-center">
                <p className="text-[11px] font-medium text-gray-700 leading-tight">
                  Guest
                  <br />
                  favorite
                </p>
              </div>
              <div className="px-2.5 py-2 text-center border-x border-gray-200">
                <p className="text-3xl leading-none font-light text-gray-800">5.0</p>
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
                <p className="text-3xl leading-none font-light text-gray-800">50</p>
                <p className="text-[10px] text-gray-500">Reviews</p>
              </div>
            </div>

            <button
              type="button"
              className="w-full bg-[#BE4D00] px-6 py-2 text-base leading-none font-medium text-white hover:bg-[#a54300] transition-colors"
            >
              Reserve now
            </button>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <Link
            href="/hotel"
            className="inline-flex items-center gap-2 border border-gray-200 bg-white px-4 py-2 text-sm leading-none text-gray-500 hover:bg-gray-50 transition-colors"
          >
            <span aria-hidden="true">←</span> Previous
          </Link>

          <Link
            href={numericId < 12 ? `/hotel/${numericId + 1}` : "/hotel/1"}
            className="inline-flex items-center gap-2 bg-[#BE4D00] px-5 py-2 text-sm leading-none text-white hover:bg-[#a54300] transition-colors"
          >
            Next <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="mt-6 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {INFO_CARDS.map((card) => (
              <InfoCard key={card.label} label={card.label} value={card.value} />
            ))}
          </div>

          <InfoCard label="Address" value="Airport Residential, Accra" />

          <p className="pt-2 text-lg leading-relaxed text-gray-500">
            Available for both short- and long-term stays, FirstClass Hotel
            offers a cozy and serene environment with full access to the
            entire space for guests. The hotel is located near Airport
            Residential, making it ideal for guests seeking a peaceful stay
            with privacy and security. Assistance is provided remotely through
            the app, as there is no staff permanently on-site.
          </p>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
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

          <div className="mt-8 border-t border-gray-200 pt-6 space-y-5">
            {HIGHLIGHTS.map((highlight) => (
              <div key={highlight.title} className="flex items-start gap-3">
                <span className="mt-1 text-gray-700">{highlight.icon}</span>
                <div>
                  <p className="text-xl font-light text-gray-900">{highlight.title}</p>
                  <p className="text-sm text-gray-500">{highlight.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">
              What this place offers
            </h2>
            <p className="mt-3 text-lg leading-relaxed text-gray-500 max-w-[1200px]">
              Enjoy a range of amenities designed to make your stay comfortable and
              convenient. From essential services to thoughtful extras, everything
              is prepared for a relaxing experience. Option 2 (modern hospitality tone)
            </p>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-x-14 gap-y-4 text-xl text-gray-900">
              {AMENITIES.map((amenity) => (
                <p key={amenity}>{amenity}</p>
              ))}
            </div>
          </div>

          <div className="mt-10 border-t border-gray-200 pt-8">
            <h2 className="text-4xl font-extrabold tracking-tight text-gray-900">
              Location
            </h2>
            <p className="mt-2 text-base text-gray-500 max-w-5xl">
              Find us easily with the map below. Explore our exact location and
              nearby landmarks. Use Google Maps to get quick directions to the
              hotel.
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

          <div className="mt-10 border-t border-gray-200 pt-8">
            <h2 className="text-5xl font-light tracking-tight text-gray-900">
              Meet your host
            </h2>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-8">
              <div>
                <div className="flex items-start gap-6">
                  <div className="flex flex-col items-center min-w-[112px]">
                    <div className="relative w-[94px] h-[94px] rounded-full bg-[#1F2127] text-white flex items-center justify-center text-[38px] font-light">
                      D
                      <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-[#F59E0B] border-2 border-white text-[13px] leading-none text-white flex items-center justify-center">
                        ✿
                      </span>
                    </div>
                    <p className="mt-2 text-[45px] leading-none font-medium text-gray-900">
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
                        <p className="text-[42px] leading-none font-medium text-gray-900">
                          {stat.value}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5 space-y-2 text-sm text-gray-500">
                  <p>♡ Born in the 80s</p>
                  <p>⌂ Works at Tarkwa,Within 10km</p>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-gray-500 max-w-md">
                  I focus on delivering safe, neat, and reliable electrical
                  works. I believe in simple, quality solutions you can trust.
                </p>
              </div>

              <div>
                <h3 className="text-3xl font-light text-gray-900">Host details</h3>
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

