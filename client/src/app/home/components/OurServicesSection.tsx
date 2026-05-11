import Link from "next/link";

type ServiceCard = {
  title: string;
  description: string;
  ctaLabel: string;
  href: string;
  icon: React.ReactNode;
};

type OurServicesSectionProps = {
  title?: string;
  services?: ServiceCard[];
  sectionId?: string;
};

function IconHands() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-gray-700"
    >
      <path
        d="M7.5 12.5V9.5a1.5 1.5 0 0 1 3 0V12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M10.5 12V8.5a1.5 1.5 0 0 1 3 0V12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M13.5 12V9.3a1.5 1.5 0 1 1 3 0V14c0 3-2 6-6 6-3.5 0-6.5-2.5-7.5-6l-.4-1.6a1.6 1.6 0 0 1 3-1l.9 2.1"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconArtisan() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-gray-700"
    >
      <path
        d="M12 3v4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M7 7h10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M8 21h8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M9 7c0 6-2 8-2 10a5 5 0 0 0 10 0c0-2-2-4-2-10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconStar() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-gray-700"
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

function ArrowRight() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
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

export default function OurServicesSection({
  title = "Our Services",
  services = [
    {
      title: "Sell\nProperty",
      description: "sell your properties with\nfestari Estates",
      ctaLabel: "List a property",
      href: "/property",
      icon: <IconHands />,
    },
    {
      title: "Artisan\nServices",
      description: "Become and Artisan on\nmy platform",
      ctaLabel: "Offer your service",
      href: "/artisan",
      icon: <IconArtisan />,
    },
    {
      title: "Venue\nServices",
      description: "find guests on our\nplatform",
      ctaLabel: "List a venue",
      href: "/venues",
      icon: <IconStar />,
    },
  ],
  sectionId = "our-services",
}: OurServicesSectionProps) {
  return (
    <section id={sectionId} className="w-full bg-white">
      <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6 py-4 md:py-5">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
          {title}
        </h2>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-7">
          {services.map((s) => (
            <div
              key={s.ctaLabel}
              className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow rounded-sm p-7"
            >
              <div className="w-10 h-10 rounded bg-gray-100 inline-flex items-center justify-center">
                {s.icon}
              </div>

              <h3 className="mt-5 text-2xl font-extrabold leading-tight text-gray-900 whitespace-pre-line">
                {s.title}
              </h3>
              <p className="mt-2 text-sm text-gray-400 whitespace-pre-line">
                {s.description}
              </p>

              <Link
                href={s.href}
                className="mt-5 inline-flex items-center gap-2 px-4 py-2 bg-[#BE4D00] text-white text-xs font-semibold rounded
                           hover:bg-[#a54300] transition-colors"
              >
                {s.ctaLabel} <ArrowRight />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

