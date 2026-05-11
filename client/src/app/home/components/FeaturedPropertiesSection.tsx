import Image from "next/image";
import Link from "next/link";

export type FeaturedProperty = {
  id: string | number;
  price: string;
  period?: string;
  title: string;
  location: string;
  beds: string;
  persons: string;
  bath: string;
  imageSrc?: string;
};

type FeaturedPropertiesSectionProps = {
  title?: string;
  properties?: FeaturedProperty[];
  viewMoreHref?: string;
  sectionId?: string;
};

function Star({ filled }: { filled: boolean }) {
  return (
    <svg
      className="w-3 h-3"
      viewBox="0 0 20 20"
      fill={filled ? "#111827" : "#E5E7EB"}
      aria-hidden="true"
    >
      <path d="M10 1.5l2.5 5.1 5.6.8-4 3.9.9 5.6L10 14.2 5 16.9l.9-5.6-4-3.9 5.6-.8L10 1.5z" />
    </svg>
  );
}

function Heart() {
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
      />
    </svg>
  );
}

function ViewMoreArrow() {
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

function MiniIconBed() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 11V9a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M4 11h16v6M4 17v2M20 17v2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MiniIconPerson() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M4 20a8 8 0 0 1 16 0"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MiniIconBath() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7 7V6a2 2 0 0 1 2-2h2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M5 12h14v3a6 6 0 0 1-6 6h-2a6 6 0 0 1-6-6v-3Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M4 12V10h16v2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function FeaturedPropertyCard({ p }: { p: FeaturedProperty }) {
  return (
    <div className="bg-white rounded-sm overflow-hidden border border-gray-100">
      <div className="relative h-40 md:h-44 bg-gray-100 overflow-hidden">
        <Image
          src={p.imageSrc ?? "/property-card-placeholder.svg"}
          alt={p.title}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 33vw"
        />

        <div className="absolute top-3 left-3 flex items-center gap-1">
          {[0, 1, 2, 3, 4].map((i) => (
            <Star key={i} filled={i < 3} />
          ))}
        </div>

        <button
          type="button"
          aria-label="Add to favorites"
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center
                     hover:bg-white text-gray-500 hover:text-[#BE4D00] transition-colors"
        >
          <Heart />
        </button>

        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <span
              key={i}
              className={`h-1.5 w-1.5 rounded-full ${
                i === 2 ? "bg-white" : "bg-white/60"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="px-5 pt-4 pb-5">
        <div className="flex items-baseline gap-1">
          <p className="text-base font-extrabold text-gray-900">{p.price}</p>
          {p.period ? (
            <span className="text-[10px] text-gray-400">{p.period}</span>
          ) : null}
        </div>

        <p className="mt-2 text-xs text-gray-700 leading-snug line-clamp-2">
          {p.title}
        </p>
        <p className="mt-2 text-[10px] text-gray-400">{p.location}</p>

        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-gray-700">
          <div className="flex items-center gap-2 text-[10px]">
            <MiniIconBed />
            <span className="text-gray-500">{p.beds}</span>
          </div>
          <div className="flex items-center gap-2 text-[10px]">
            <MiniIconPerson />
            <span className="text-gray-500">{p.persons}</span>
          </div>
          <div className="flex items-center gap-2 text-[10px]">
            <MiniIconBath />
            <span className="text-gray-500">{p.bath}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FeaturedPropertiesSection({
  title = "Featured Properties",
  properties = [
    {
      id: 1,
      price: "GHS 2,400",
      period: "/month",
      title: "Large 4-room apartment with a beautiful terrace",
      location: "Airport Residential, Accra",
      beds: "King Size Bed",
      persons: "1-2 Persons",
      bath: "Bath1",
    },
    {
      id: 2,
      price: "GHS 2,400",
      period: "/month",
      title: "Large 4-room apartment with a beautiful terrace",
      location: "Airport Residential, Accra",
      beds: "King Size Bed",
      persons: "1-2 Persons",
      bath: "Bath1",
    },
    {
      id: 3,
      price: "GHS 2,400",
      period: "/month",
      title: "Large 4-room apartment with a beautiful terrace",
      location: "Airport Residential, Accra",
      beds: "King Size Bed",
      persons: "1-2 Persons",
      bath: "Bath1",
    },
  ],
  viewMoreHref = "/property",
  sectionId = "featured-properties",
}: FeaturedPropertiesSectionProps) {
  return (
    <section id={sectionId} className="w-full bg-white">
      <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6 py-6 md:py-8">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
          {title}
        </h2>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-10">
          {properties.slice(0, 3).map((p) => (
            <FeaturedPropertyCard key={p.id} p={p} />
          ))}
        </div>

        <div className="mt-8 flex justify-end">
          <Link
            href={viewMoreHref}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded text-xs text-gray-700
                       hover:bg-gray-50 transition-colors"
          >
            View more <ViewMoreArrow />
          </Link>
        </div>
      </div>
    </section>
  );
}

