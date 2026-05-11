import Image from "next/image";
import Link from "next/link";

type ReadyJourneySectionProps = {
  title?: string;
  description?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  imageSrc?: string;
  imageAlt?: string;
  sectionId?: string;
};

export default function ReadyJourneySection({
  title = "Ready to begin your\njourney",
  description =
    "Join thousands of users already buying, selling, and building on the platform",
  primaryCta = { label: "Join us now", href: "/signup" },
  secondaryCta = { label: "Learn more", href: "/about" },
  imageSrc = "/ready-journey-placeholder.svg",
  imageAlt = "Ready journey placeholder image",
  sectionId = "ready-journey",
}: ReadyJourneySectionProps) {
  return (
    <section id={sectionId} className="w-full bg-white">
      <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6 py-10 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 whitespace-pre-line">
              {title}
            </h2>
            <p className="mt-4 text-sm md:text-base text-gray-500 max-w-xl leading-relaxed">
              {description}
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
          </div>

          <div className="relative w-full aspect-[16/9] bg-gray-100 overflow-hidden">
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

