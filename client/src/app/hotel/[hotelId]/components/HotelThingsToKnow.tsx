"use client";

import { useState } from "react";
import { montserrat } from "@/app/home/landing-fonts";
import { StaggerContainer, StaggerItem } from "@/components/motion/Stagger";

const COLUMNS = [
  {
    title: "House Rules",
    items: ["Check-in: 3:00 p.m. – 8:00 p.m.", "Checkout before 11:00 a.m.", "4 guests maximum"],
    moreItems: ["No smoking indoors", "No parties or events", "Quiet hours from 10:00 p.m."],
  },
  {
    title: "Safety & Property",
    items: ["Security camera on the premises", "Pool without a fence or lock", "Smoke and CO alarms fitted"],
    moreItems: ["Fire extinguisher on site", "First aid kit available on request", "Nearest hospital within 15 minutes"],
  },
  {
    title: "Cancellation Policy",
    items: ["Free cancellation up to 48 hours before check-in", "Add your dates to see the exact policy for your stay"],
    moreItems: ["Partial refund if you cancel within 48 hours", "No refund for no-shows or early checkout"],
  },
];

function ThingsColumn({ column }: { column: (typeof COLUMNS)[number] }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <StaggerItem className="flex flex-col gap-4">
      <h3 className="text-base font-bold text-[#00261b]">{column.title}</h3>
      <ul className="flex flex-col gap-2">
        {[...column.items, ...(expanded ? column.moreItems : [])].map((item) => (
          <li key={item} className="text-sm leading-relaxed text-[#414944]">
            {item}
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className="self-start text-sm font-semibold text-[#00261b] underline"
      >
        {expanded ? "Show less" : "Show more"}
      </button>
    </StaggerItem>
  );
}

export default function HotelThingsToKnow() {
  return (
    <div className="flex flex-col gap-8">
      <h2 className={`${montserrat.className} text-2xl font-semibold text-[#00261b]`}>Things to Know</h2>

      <StaggerContainer className="grid grid-cols-1 gap-8 sm:grid-cols-3">
        {COLUMNS.map((column) => (
          <ThingsColumn key={column.title} column={column} />
        ))}
      </StaggerContainer>
    </div>
  );
}
