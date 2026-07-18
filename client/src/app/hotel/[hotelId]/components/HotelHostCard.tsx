import Image from "next/image";
import { montserrat } from "@/app/home/landing-fonts";
import { HOTEL_HOST, type Hotel } from "@/lib/hotels";

function StarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 20 20" fill="#fed65b">
      <path d="M10 1.5l2.5 5.1 5.6.8-4 3.9.9 5.6L10 14.2l-5 2.7.9-5.6-4-3.9 5.6-.8L10 1.5z" />
    </svg>
  );
}

export default function HotelHostCard({ hotel }: { hotel: Hotel }) {
  const baseScore = 4.68 + hotel.rating * 0.05;
  const reviewCount = Math.round(hotel.rating * 45 + 70);

  return (
    <div className="flex flex-col gap-6">
      <h2 className={`${montserrat.className} text-2xl font-semibold text-[#00261b]`}>Meet Your Host</h2>

      <div className="flex flex-col gap-8 rounded-[24px] border border-[rgba(89,112,97,0.2)] bg-[#f6f3f2] p-8 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-6">
          <div className="relative size-20 shrink-0 overflow-hidden rounded-2xl">
            <Image src="/landing/consultant-avatar.jpg" alt={HOTEL_HOST.name} fill className="object-cover" />
            <span className="absolute bottom-0 right-0 flex size-6 items-center justify-center rounded-full border-4 border-white bg-[#22c55e]" />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-lg font-bold text-[#00261b]">{HOTEL_HOST.name}</p>
            <p className="text-sm text-[#717974]">{HOTEL_HOST.role}</p>
            <div className="mt-1 flex items-center gap-1.5">
              <StarIcon />
              <span className="text-sm font-semibold text-[#00261b]">{baseScore.toFixed(2)}</span>
              <span className="text-xs text-[#717974]">
                · {reviewCount} reviews · {HOTEL_HOST.yearsHosting} years hosting
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 md:w-[320px] md:shrink-0">
          <p className="text-sm leading-relaxed text-[#414944]">{HOTEL_HOST.bio}</p>
          <button
            type="button"
            className="self-start rounded-xl bg-[#00261b] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#00382a]"
          >
            Message Host
          </button>
        </div>
      </div>
    </div>
  );
}
