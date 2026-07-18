"use client";

import { montserrat } from "@/app/home/landing-fonts";
import { StaggerContainer, StaggerItem } from "@/components/motion/Stagger";
import type { Hotel } from "@/lib/hotels";

const REVIEWS = [
  {
    name: "Amara Boateng",
    location: "Accra, Ghana",
    stay: "Stayed 3 nights",
    quote:
      "The room was immaculate and the staff anticipated everything before we asked. Checking in felt like arriving somewhere we already belonged.",
  },
  {
    name: "Julian Reyes",
    location: "London, UK",
    stay: "Stayed a week",
    quote:
      "Quiet, well run, and exactly as described. The little touches — fresh flowers, a handwritten welcome note — made the stay feel personal.",
  },
  {
    name: "Priya Nair",
    location: "Dubai, UAE",
    stay: "Stayed 2 nights",
    quote: "Booked for a work trip and stayed an extra night just to enjoy the property. Breakfast alone was worth it.",
  },
  {
    name: "Kwesi Owusu",
    location: "Kumasi, Ghana",
    stay: "Stayed a weekend",
    quote: "Felt safe, private, and genuinely cared for from check-in to check-out. Would book again without hesitation.",
  },
];

function CleanlinessIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-[#be4d00]">
      <path
        d="M5 3l1.5 4L11 8.5 6.5 10 5 14l-1.5-4L-1 8.5 3.5 7 5 3ZM17 9l1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3Z"
        fill="currentColor"
      />
    </svg>
  );
}

function AccuracyIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-[#be4d00]">
      <path d="M4 12.5 9 17l11-11" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckInIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-[#be4d00]">
      <circle cx="10" cy="10" r="6.5" stroke="currentColor" strokeWidth="2" />
      <path d="M20 20l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function CommunicationIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-[#be4d00]">
      <path
        d="M4 5h16v10H9l-4 4v-4H4V5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-[#be4d00]">
      <path
        d="M12 2C7.6 2 4 5.6 4 10c0 5.6 6.6 11.3 7 11.6.3.3.7.3 1 0 .4-.3 7-6 7-11.6 0-4.4-3.6-8-8-8Zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ValueIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-[#be4d00]">
      <path
        d="M20 12 12 20l-8-8V4h8l8 8Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="#fed65b">
      <path d="M10 1.5l2.5 5.1 5.6.8-4 3.9.9 5.6L10 14.2l-5 2.7.9-5.6-4-3.9 5.6-.8L10 1.5z" />
    </svg>
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
    <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#f6f3f2] text-sm font-bold text-[#be4d00]">
      {initials}
    </div>
  );
}

export default function HotelReviews({ hotel }: { hotel: Hotel }) {
  const baseScore = 4.68 + hotel.rating * 0.05;
  const categories = [
    { label: "Cleanliness", icon: <CleanlinessIcon />, offset: 0.08 },
    { label: "Accuracy", icon: <AccuracyIcon />, offset: 0.05 },
    { label: "Check-in", icon: <CheckInIcon />, offset: 0.1 },
    { label: "Communication", icon: <CommunicationIcon />, offset: 0.06 },
    { label: "Location", icon: <LocationIcon />, offset: 0.12 },
    { label: "Value", icon: <ValueIcon />, offset: -0.05 },
  ];

  const reviewCount = Math.round(hotel.rating * 45 + 70);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className={`${montserrat.className} text-2xl font-semibold text-[#00261b]`}>What Guests Say</h2>
        <div className="flex items-center gap-1.5">
          <StarIcon />
          <span className="text-base font-bold text-[#00261b]">{baseScore.toFixed(2)}</span>
          <span className="text-sm text-[#717974]">({reviewCount} reviews)</span>
        </div>
      </div>

      <StaggerContainer className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
        {categories.map((category) => (
          <StaggerItem
            key={category.label}
            className="flex flex-col items-center gap-2 rounded-2xl border border-[rgba(89,112,97,0.2)] bg-white p-4 text-center"
          >
            {category.icon}
            <p className="text-lg font-bold text-[#00261b]">{Math.min(5, baseScore + category.offset).toFixed(1)}</p>
            <p className="text-xs font-semibold text-[#717974]">{category.label}</p>
          </StaggerItem>
        ))}
      </StaggerContainer>

      <StaggerContainer className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {REVIEWS.map((review) => (
          <StaggerItem
            key={review.name}
            className="flex flex-col gap-4 rounded-[24px] border border-[rgba(89,112,97,0.2)] bg-white p-6 transition-shadow duration-300 hover:shadow-[0px_20px_40px_0px_rgba(26,26,26,0.08)]"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <AvatarFallback name={review.name} />
                <div>
                  <p className="text-base font-bold text-[#00261b]">{review.name}</p>
                  <p className="text-xs text-[#717974]">{review.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, index) => (
                  <StarIcon key={index} />
                ))}
              </div>
            </div>
            <p className="text-base italic leading-relaxed text-[#717974]">{review.quote}</p>
            <p className="text-xs font-semibold uppercase tracking-[0.7px] text-[#717974]">{review.stay}</p>
          </StaggerItem>
        ))}
      </StaggerContainer>

      <button
        type="button"
        className="self-start rounded-full border border-[#c0c8c3] px-6 py-3 text-sm font-semibold text-[#00261b] transition-colors hover:bg-[#f6f3f2]"
      >
        Show all {reviewCount} reviews
      </button>
    </div>
  );
}
