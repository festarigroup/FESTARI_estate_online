"use client";

import { StaggerContainer, StaggerItem } from "@/components/motion/Stagger";
import type { Hotel } from "@/lib/hotels";

function BedIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-[#be4d00]">
      <path
        d="M2 16V4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12M2 16h20M2 16v3M22 16v3M6 8h4a1 1 0 0 1 1 1v2H5V9a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BathIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-[#be4d00]">
      <path
        d="M4 12h16v3a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-3ZM7 12V6a2 2 0 0 1 3.6-1.2M4 19v2M18 19v2"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SqftIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-[#be4d00]">
      <path
        d="M3 3h7v7H3V3ZM14 14h7v7h-7v-7Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ParkingIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-[#be4d00]">
      <path
        d="M5 21V5a1 1 0 0 1 1-1h7a5 5 0 0 1 0 10H8v7"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function HotelQuickStats({ hotel }: { hotel: Hotel }) {
  const stats = [
    { icon: <BedIcon />, value: hotel.bedrooms, label: "Bedrooms" },
    { icon: <BathIcon />, value: hotel.bathrooms, label: "Bathrooms" },
    { icon: <SqftIcon />, value: hotel.sqft.toLocaleString(), label: "Sq Ft" },
    { icon: <ParkingIcon />, value: hotel.parking, label: "Parking" },
  ];

  return (
    <StaggerContainer className="grid grid-cols-2 gap-6 rounded-[24px] border border-[rgba(89,112,97,0.2)] bg-white p-8 sm:grid-cols-4">
      {stats.map((stat) => (
        <StaggerItem key={stat.label} className="flex flex-col items-center gap-3 text-center">
          {stat.icon}
          <p className="text-2xl font-bold text-[#00261b]">{stat.value}</p>
          <p className="text-sm font-semibold text-[#717974]">{stat.label}</p>
        </StaggerItem>
      ))}
    </StaggerContainer>
  );
}
