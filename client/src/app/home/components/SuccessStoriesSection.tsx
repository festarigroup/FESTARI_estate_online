"use client";

import { useMemo, useState } from "react";

type Story = {
  quote: string;
  name: string;
  role: string;
  rating?: number;
};

type SuccessStoriesSectionProps = {
  title?: string;
  subtitle?: string;
  stories?: Story[];
  sectionId?: string;
};

function Stars({ rating = 5 }: { rating?: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className="w-3 h-3"
          viewBox="0 0 20 20"
          fill={i < rating ? "#111827" : "#E5E7EB"}
          aria-hidden="true"
        >
          <path d="M10 1.5l2.5 5.1 5.6.8-4 3.9.9 5.6L10 14.2 5 16.9l.9-5.6-4-3.9 5.6-.8L10 1.5z" />
        </svg>
      ))}
    </div>
  );
}

function ArrowButton({
  direction,
  onClick,
}: {
  direction: "left" | "right";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-9 h-9 border border-gray-200 bg-white hover:bg-gray-50 transition-colors inline-flex items-center justify-center"
      aria-label={direction === "left" ? "Previous testimonial" : "Next testimonial"}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {direction === "left" ? (
          <path
            d="M15 19l-7-7 7-7"
            stroke="#111827"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : (
          <path
            d="M9 5l7 7-7 7"
            stroke="#111827"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </svg>
    </button>
  );
}

function AvatarFallback({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");

  return (
    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-700">
      {initials}
    </div>
  );
}

export default function SuccessStoriesSection({
  title = "Success stories",
  subtitle = "What users say about their experience",
  stories = [
    {
      quote:
        '"The dashboard made managing my listings painless. I track everything in one place."',
      name: "Marcus Thompson",
      role: "Real estate agent",
      rating: 5,
    },
    {
      quote:
        '"I found my dream home within weeks. The search filters saved me hours of browsing."',
      name: "Lisa Wong",
      role: "Property buyer",
      rating: 5,
    },
    {
      quote: '"Artisans on this platform are top-notch. I found help quickly for my projects."',
      name: "David Patel",
      role: "Homeowner",
      rating: 5,
    },
  ],
  sectionId = "success-stories",
}: SuccessStoriesSectionProps) {
  const [active, setActive] = useState(0);
  const total = stories.length;

  const visibleStories = useMemo(() => {
    // Keep the simple 3-card layout; arrows update active indicator/dots.
    return stories.slice(0, 3);
  }, [stories]);

  const goPrev = () => setActive((v) => (v - 1 + total) % total);
  const goNext = () => setActive((v) => (v + 1) % total);

  return (
    <section id={sectionId} className="w-full bg-white">
      <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6 py-10 md:py-12">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">
              {title}
            </h2>
            <p className="mt-3 text-sm text-gray-500">{subtitle}</p>
          </div>

          <div className="hidden md:flex items-center gap-2 pt-2">
            <ArrowButton direction="left" onClick={goPrev} />
            <ArrowButton direction="right" onClick={goNext} />
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {visibleStories.map((s, idx) => (
            <div
              key={s.name}
              className={`bg-gray-100 border border-gray-200 p-6 ${
                idx === 2 ? "md:opacity-75" : ""
              }`}
            >
              <Stars rating={s.rating ?? 5} />
              <p className="mt-4 text-sm text-gray-800 leading-relaxed">
                {s.quote}
              </p>

              <div className="mt-5 flex items-center gap-3">
                <AvatarFallback name={s.name} />
                <div className="leading-tight">
                  <p className="text-sm font-semibold text-gray-900">{s.name}</p>
                  <p className="text-[11px] text-gray-500">{s.role}</p>
                </div>
              </div>
            </div>
          ))}

          <div className="flex md:hidden items-center justify-between gap-2">
            <ArrowButton direction="left" onClick={goPrev} />
            <ArrowButton direction="right" onClick={goNext} />
          </div>
        </div>

        <div className="mt-6 flex justify-center gap-2">
          {Array.from({ length: Math.min(4, total) }).map((_, i) => (
            <span
              key={i}
              className={`h-1.5 w-1.5 rounded-full ${
                i === active ? "bg-[#BE4D00]" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

