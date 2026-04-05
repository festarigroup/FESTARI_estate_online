import Image from "next/image";
import Link from "next/link";

type WhoWeAreItem = {
  label: string;
  href?: string;
  icon: React.ReactNode;
};

type WhoWeAreSectionProps = {
  title?: string;
  brandTitle?: string;
  brandTagline?: string;
  description?: string;
  imageSrc?: string;
  imageAlt?: string;
  items?: WhoWeAreItem[];
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  sectionId?: string;
};

function ItemIconSellProperty() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-[#BE4D00]"
    >
      <path
        d="M3 10.5 12 3l9 7.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.5 9.8V21h13V9.8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 21v-6h4v6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ItemIconArtisan() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-[#BE4D00]"
    >
      <path
        d="M9 13 4 18l2 2 5-5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.5 3.5 20.5 9.5c.8.8.8 2.1 0 2.9l-7.1 7.1c-.8.8-2.1.8-2.9 0l-6-6c-.8-.8-.8-2.1 0-2.9l7.1-7.1c.8-.8 2.1-.8 2.9 0Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13 7.5h.01"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ItemIconVenue() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-[#BE4D00]"
    >
      <path
        d="M12 2l2.2 6.8h7.1l-5.8 4.2 2.2 6.8L12 15.6 6.3 19.8 8.5 13 2.7 8.8h7.1L12 2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function WhoWeAreSection({
  title = "Who we are",
  brandTitle = "FESTARI ESTATE",
  brandTagline = "SEARCH. SECURE. SETTLE",
  description = "Festari Estates is a digital marketplace that connects property sellers, artisans, and venue owners with people looking for trusted services and spaces—all in one place.",
  imageSrc = "/who-we-are-placeholder.svg",
  imageAlt = "Who we are illustration",
  items = [
    { label: "Sell Property", href: "/property", icon: <ItemIconSellProperty /> },
    { label: "Become Artisan", href: "/artisan", icon: <ItemIconArtisan /> },
    { label: "Venue Services", href: "/venues", icon: <ItemIconVenue /> },
  ],
  primaryCta = { label: "Browse properties", href: "/property" },
  secondaryCta = { label: "Contact us", href: "/contact" },
  sectionId = "who-we-are",
}: WhoWeAreSectionProps) {
  return (
    <section id={sectionId} className="w-full bg-white">
      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 py-14 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
              {title}
            </h2>

            <div className="mt-8 relative w-full max-w-[560px] aspect-[4/3]">
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority={false}
              />
            </div>
          </div>

          <div className="lg:pl-2">
            <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
              {brandTitle}
            </h3>
            <p className="mt-2 text-xs md:text-sm tracking-[0.22em] text-[#BE4D00] font-semibold">
              {brandTagline}
            </p>

            <p className="mt-6 text-gray-500 leading-relaxed max-w-xl">
              {description}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-x-10 gap-y-4">
              {items.map((item) => {
                const content = (
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center justify-center">
                      {item.icon}
                    </span>
                    <span className="text-sm font-medium text-[#BE4D00]">
                      {item.label}
                    </span>
                  </div>
                );

                return item.href ? (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="group hover:opacity-90 transition-opacity"
                  >
                    {content}
                  </Link>
                ) : (
                  <div key={item.label}>{content}</div>
                );
              })}
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href={primaryCta.href}
                className="inline-flex items-center justify-center px-6 py-2.5 rounded bg-[#BE4D00] text-white text-sm font-semibold
                           hover:bg-[#a54300] transition-colors"
              >
                {primaryCta.label}
              </Link>
              <Link
                href={secondaryCta.href}
                className="inline-flex items-center justify-center px-6 py-2.5 rounded border border-gray-300 text-gray-900 text-sm font-semibold
                           hover:bg-gray-50 transition-colors"
              >
                {secondaryCta.label}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

