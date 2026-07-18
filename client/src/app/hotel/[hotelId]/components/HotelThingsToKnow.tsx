"use client";

import { montserrat } from "@/app/home/landing-fonts";
import { StaggerContainer, StaggerItem } from "@/components/motion/Stagger";

const COLUMNS = [
  {
    title: "House Rules",
    items: ["Check-in: 3:00 p.m. – 8:00 p.m.", "Checkout before 11:00 a.m.", "4 guests maximum"],
  },
  {
    title: "Safety & Property",
    items: ["Security camera on the premises", "Pool without a fence or lock", "Smoke and CO alarms fitted"],
  },
  {
    title: "Cancellation Policy",
    items: ["Free cancellation up to 48 hours before check-in", "Add your dates to see the exact policy for your stay"],
  },
];

export default function HotelThingsToKnow() {
  return (
    <div className="flex flex-col gap-8">
      <h2 className={`${montserrat.className} text-2xl font-semibold text-[#00261b]`}>Things to Know</h2>

      <StaggerContainer className="grid grid-cols-1 gap-8 sm:grid-cols-3">
        {COLUMNS.map((column) => (
          <StaggerItem key={column.title} className="flex flex-col gap-4">
            <h3 className="text-base font-bold text-[#00261b]">{column.title}</h3>
            <ul className="flex flex-col gap-2">
              {column.items.map((item) => (
                <li key={item} className="text-sm leading-relaxed text-[#414944]">
                  {item}
                </li>
              ))}
            </ul>
            <button type="button" className="self-start text-sm font-semibold text-[#00261b] underline">
              Show more
            </button>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </div>
  );
}
