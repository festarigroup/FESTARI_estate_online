import Image from "next/image";
import Link from "next/link";

function StarRating() {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className="w-4 h-4 text-[#BE4D00] fill-current"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function HomePage() {
  return (
    <section
      id="hero-section"
      className="relative w-full min-h-[600px] bg-[#BE4D0008] overflow-hidden"
    >
      {/* Dot pattern background */}
      <div
        className="absolute top-0 right-0 w-1/2 h-full opacity-[0.08] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, #9ca3af 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      <div className="relative z-10 flex flex-col lg:flex-row items-center w-full max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 py-12 lg:py-20 gap-10 lg:gap-16">
        {/* ─── Left Content ─── */}
        <div className="flex-1 max-w-xl">
          <h1 className="text-4xl md:text-5xl lg:text-[3.25rem] font-bold leading-[1.15] text-[#BE4D00] tracking-tight">
            Buy or Sell Properties with Confidence
          </h1>

          <p className="mt-5 text-gray-500 text-base md:text-lg leading-relaxed max-w-md">
            Browse verified listings and connect directly with trusted property
            owners.
          </p>

          {/* Star ratings row */}
          <div className="mt-8 flex flex-wrap items-center gap-8">
            <div className="flex flex-col items-start gap-1.5">
              <StarRating />
              <span className="text-xs text-gray-500 font-medium tracking-wide">
                Excellence
              </span>
            </div>
            <div className="flex flex-col items-start gap-1.5">
              <StarRating />
              <span className="text-xs text-gray-500 font-medium tracking-wide">
                Quality
              </span>
            </div>
            <div className="flex flex-col items-start gap-1.5">
              <StarRating />
              <span className="text-xs text-gray-500 font-medium tracking-wide">
                Experience
              </span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/property"
              id="hero-explore-btn"
              className="inline-flex items-center justify-center px-7 py-3 rounded-md bg-[#BE4D00] text-white text-sm font-semibold
                         shadow-lg shadow-[#BE4D00]/25 hover:bg-[#a54300] transition-all duration-200 hover:shadow-xl hover:shadow-[#BE4D00]/30
                         hover:-translate-y-0.5 active:translate-y-0"
            >
              Explore more
            </Link>
            <Link
              href="/property"
              id="hero-list-btn"
              className="inline-flex items-center justify-center px-7 py-3 rounded-md border-2 border-gray-900 text-gray-900 text-sm font-semibold
                         hover:bg-gray-900 hover:text-white transition-all duration-200
                         hover:-translate-y-0.5 active:translate-y-0"
            >
              List a property
            </Link>
          </div>
        </div>

        {/* ─── Right Image ─── */}
        <div className="flex-1 relative w-full max-w-2xl">
          <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
            {/* Placeholder — swap src when the real image is ready */}
            <Image
              src="/HomePageHeroSection.png"
              alt="Modern luxury property"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />

            {/* Gradient overlay at bottom for the CTA strip */}
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/50 to-transparent" />
          </div>

          {/* Bottom CTA banner */}
          <div
            className="absolute -bottom-5 right-4 md:right-8 bg-white rounded-xl px-6 py-3 shadow-xl
                        flex items-center gap-3 border border-gray-100
                        hover:shadow-2xl transition-shadow duration-300 cursor-pointer group"
          >
            <span className="text-sm text-gray-600">
              Interested in this home?{" "}
              <span className="font-bold text-gray-900 group-hover:text-[#BE4D00] transition-colors duration-200">
                Check it out!
              </span>
            </span>
            <svg
              className="w-4 h-4 text-gray-900 group-hover:text-[#BE4D00] group-hover:translate-x-1 transition-all duration-200"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
