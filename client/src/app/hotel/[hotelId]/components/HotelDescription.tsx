import { montserrat } from "@/app/home/landing-fonts";
import type { Hotel } from "@/lib/hotels";

export default function HotelDescription({ hotel }: { hotel: Hotel }) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className={`${montserrat.className} text-2xl font-semibold text-[#00261b]`}>Hotel Description</h2>
      {hotel.description.map((paragraph, index) => (
        <p key={index} className="text-lg leading-[29px] text-[#0f1621]">
          {paragraph}
        </p>
      ))}
    </div>
  );
}
