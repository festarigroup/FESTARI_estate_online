import { montserrat } from "@/app/home/landing-fonts";
import type { Hotel } from "@/lib/hotels";

function PinIcon() {
  return (
    <svg width="14" height="17" viewBox="0 0 24 30" fill="none" className="text-[#be4d00]">
      <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 18 12 18s12-9 12-18c0-6.6-5.4-12-12-12Z" fill="currentColor" />
      <circle cx="12" cy="12" r="4.5" fill="#fff" />
    </svg>
  );
}

export default function HotelLocationMap({ hotel }: { hotel: Hotel }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className={`${montserrat.className} text-2xl font-semibold text-[#00261b]`}>Where You&apos;ll Be</h2>
        <div className="flex items-center gap-2 text-sm font-semibold text-[#717974]">
          <PinIcon />
          {hotel.location}
        </div>
      </div>

      <div className="relative h-[384px] w-full overflow-hidden rounded-[24px] bg-[#f0eded]">
        <svg className="absolute inset-0 h-full w-full opacity-40" viewBox="0 0 800 400" preserveAspectRatio="none">
          <defs>
            <pattern id="hotel-location-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.5" fill="#9aa39c" />
            </pattern>
          </defs>
          <rect width="800" height="400" fill="url(#hotel-location-grid)" />
          <path d="M0 260 Q200 200 400 250 T800 220" stroke="#c0c8c3" strokeWidth="6" fill="none" />
          <path d="M120 0 Q160 180 100 400" stroke="#c0c8c3" strokeWidth="6" fill="none" />
          <path d="M700 0 Q640 160 720 400" stroke="#c0c8c3" strokeWidth="6" fill="none" />
        </svg>

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full">
          <div className="flex size-16 items-center justify-center rounded-full bg-[#be4d00]/15">
            <div className="flex size-12 items-center justify-center rounded-full bg-[#be4d00] shadow-lg">
              <svg width="20" height="24" viewBox="0 0 24 30" fill="none">
                <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 18 12 18s12-9 12-18c0-6.6-5.4-12-12-12Z" fill="#fff" />
                <circle cx="12" cy="12" r="4.5" fill="#be4d00" />
              </svg>
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 left-6 max-w-[280px] rounded-xl border border-white/40 bg-white/90 p-4 backdrop-blur-md">
          <p className="text-sm font-semibold tracking-[0.5px] text-[#00261b]">{hotel.tag}</p>
          <p className="text-xs text-[#717974]">{hotel.location}</p>
        </div>
      </div>

      <p className="max-w-[680px] text-base leading-relaxed text-[#414944]">
        Set within easy reach of {hotel.location}&apos;s best restaurants and everyday conveniences, with quiet
        residential streets just beyond the property line.{" "}
        <button type="button" className="font-semibold text-[#00261b] underline">
          Show more
        </button>
      </p>
    </div>
  );
}
