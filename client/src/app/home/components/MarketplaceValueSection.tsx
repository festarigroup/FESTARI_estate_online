import Image from "next/image";
import Link from "next/link";

type ValueFeature = {
  title: string;
  description: string;
  icon: React.ReactNode;
};

type MarketplaceValueSectionProps = {
  eyebrowTitle?: string;
  eyebrowDescription?: string;
  features?: ValueFeature[];
  mainTitle?: string;
  mainDescription?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  imageSrc?: string;
  imageAlt?: string;
  sectionId?: string;
};

function IconBadgeCheck() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-gray-900"
      aria-hidden="true"
    >
      <path
        d="M12 2l2.5 2 3.3-.4 1 3.2 3 1.6-1.6 3 1.6 3-3 1.6-1 3.2-3.3-.4L12 22l-2.5-2-3.3.4-1-3.2-3-1.6 1.6-3L2 9.4l3-1.6 1-3.2 3.3.4L12 2Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M8.2 12.4 10.6 15l5.2-5.6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconGrid() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-gray-900"
      aria-hidden="true"
    >
      <path
        d="M4 4h6v6H4V4Zm10 0h6v6h-6V4ZM4 14h6v6H4v-6Zm10 0h6v6h-6v-6Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconMoney() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-gray-900"
      aria-hidden="true"
    >
      <path
        d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M13.8 8.3c-.4-.6-1-.9-1.8-.9-1.2 0-2 .6-2 1.5 0 2.1 4.4 1.1 4.4 4 0 1.2-1.1 2.1-2.7 2.1-1.1 0-2-.4-2.6-1.2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M12 6.2v11.6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function MarketplaceValueSection({
  eyebrowTitle = "Why choose this marketplace",
  eyebrowDescription = "We’ve built something different. One platform handles everything you need in real estate, from buying and selling to finding skilled professionals.",
  features = [
    {
      title: "Verified professionals only",
      description: "Every artisan and venue host is checked before joining.",
      icon: <IconBadgeCheck />,
    },
    {
      title: "Centralized management",
      description:
        "Sellers, buyers, and service providers all work from intuitive dashboards.",
      icon: <IconGrid />,
    },
    {
      title: "Transparent pricing",
      description: "No hidden fees. You know exactly what you’re paying.",
      icon: <IconMoney />,
    },
  ],
  mainTitle = "Built for everyone in real estate",
  mainDescription =
    "Real Estate Marketplace Platform exists because the property world needed one place where all players could meet. We connect sellers, buyers, artisans, and venue hosters with the tools they need to succeed.",
  primaryCta = { label: "Discover more", href: "/services" },
  secondaryCta = { label: "Read about us", href: "/about" },
  imageSrc = "/marketplace-hero-placeholder.svg",
  imageAlt = "Marketplace hero placeholder image",
  sectionId = "marketplace-value",
}: MarketplaceValueSectionProps) {
  return (
    <section id={sectionId} className="w-full bg-white">
      <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6 py-10 md:py-14">
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">
          {eyebrowTitle}
        </h2>
        <p className="mt-4 text-sm md:text-base text-gray-500 max-w-5xl leading-relaxed">
          {eyebrowDescription}
        </p>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
          {features.map((f) => (
            <div key={f.title} className="flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded bg-gray-100 inline-flex items-center justify-center">
                {f.icon}
              </div>
              <h3 className="mt-4 text-lg font-bold text-gray-900">
                {f.title}
              </h3>
              <p className="mt-2 text-sm text-gray-500 max-w-xs leading-relaxed">
                {f.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-14">
          <h3 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">
            {mainTitle}
          </h3>
          <p className="mt-4 text-sm md:text-base text-gray-500 leading-relaxed max-w-6xl">
            {mainDescription}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href={primaryCta.href}
              className="inline-flex items-center justify-center px-4 py-2 bg-[#BE4D00] text-white text-xs font-semibold rounded
                         hover:bg-[#a54300] transition-colors"
            >
              {primaryCta.label}
            </Link>
            <Link
              href={secondaryCta.href}
              className="inline-flex items-center justify-center px-4 py-2 border border-gray-200 text-gray-900 text-xs font-semibold rounded
                         hover:bg-gray-50 transition-colors"
            >
              {secondaryCta.label}
            </Link>
          </div>

          <div className="mt-8 relative w-full aspect-[16/9] bg-gray-100 overflow-hidden">
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              className="object-cover"
              sizes="100vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

