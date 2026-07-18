import { montserrat } from "@/app/home/landing-fonts";
import { AMENITIES } from "@/lib/properties";

function AmenityIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-[#00261b]">
      <path
        d="M4 12.5 9 17l11-11"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function PropertyAmenities() {
  return (
    <div className="flex flex-col gap-6">
      <h2 className={`${montserrat.className} text-2xl font-semibold text-[#00261b]`}>Amenities & Features</h2>
      <div className="flex flex-wrap gap-4">
        {AMENITIES.map((amenity) => (
          <div
            key={amenity}
            className="flex h-[92px] w-full items-center gap-4 rounded-[32px] border border-[rgba(89,112,97,0.2)] bg-white px-6 sm:w-[calc(50%-8px)]"
          >
            <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[rgba(11,61,46,0.1)]">
              <AmenityIcon />
            </span>
            <span className="text-base font-semibold uppercase tracking-[0.5px] text-[#00261b]">{amenity}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
