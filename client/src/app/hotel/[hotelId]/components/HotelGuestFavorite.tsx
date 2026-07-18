import { montserrat } from "@/app/home/landing-fonts";
import type { Hotel } from "@/lib/hotels";

const LEAVES = [
  { x: 27, y: 51, angle: -35 },
  { x: 21, y: 42, angle: -50 },
  { x: 17, y: 33, angle: -62 },
  { x: 14, y: 24, angle: -72 },
  { x: 12, y: 15, angle: -80 },
  { x: 11, y: 6, angle: -88 },
];

function LaurelIcon({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      width="36"
      height="60"
      viewBox="0 0 36 60"
      fill="none"
      className={`text-[#00261b] ${flip ? "-scale-x-100" : ""}`}
    >
      <path d="M31 57c-9-6-19-24-19-51" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      {LEAVES.map((leaf, index) => (
        <path
          key={index}
          d="M0,0 C4,-6 12,-6 16,0 C12,6 4,6 0,0 Z"
          transform={`translate(${leaf.x} ${leaf.y}) rotate(${leaf.angle})`}
          fill="currentColor"
        />
      ))}
    </svg>
  );
}

export default function HotelGuestFavorite({ hotel }: { hotel: Hotel }) {
  const guestScore = (4.68 + hotel.rating * 0.05).toFixed(2);

  return (
    <div className="flex flex-col items-center gap-3 py-8 text-center">
      <div className="flex items-center gap-4">
        <LaurelIcon />
        <span className={`${montserrat.className} text-[56px] font-bold text-[#00261b] md:text-[64px]`}>
          {guestScore}
        </span>
        <LaurelIcon flip />
      </div>
      <h3 className={`${montserrat.className} text-2xl font-semibold text-[#00261b]`}>Guest Favorite</h3>
      <p className="max-w-md text-base text-[#717974]">
        One of the most loved stays on Festari Estates, based on ratings, reviews, and reliability.
      </p>
    </div>
  );
}
