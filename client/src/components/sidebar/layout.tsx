"use client";

import Image from "next/image";
import Link from "next/link";

export default function SidebarLayout() {
  return (
    <aside className="fixed left-0 top-0 w-64 h-screen bg-white flex flex-col items-center border-r border-gray-200 overflow-y-auto">
      {/* Logo */}
      <div className="pt-4 text-center">
        <Image
          src="/FestariEstatesLogo.png"
          alt="Festari Estates Logo"
          width={250}
          height={250}
          priority
        />
        <p className=" text-[#BE4D00] tracking-wider">SEARCH. SECURE. SETTLE</p>
      </div>

      {/* Navigation */}
      <nav className="mt-8 w-full flex-1">
        <ul className="space-y-4 text-center text-[16px] font-lightbold ">
          <li>
            <Link href="/" className="text-black">
              Home
            </Link>
          </li>
          <li>
            <Link href="/services" className="text-black">
              Services
            </Link>
          </li>
          <li>
            <Link href="/gallery" className="text-black">
              Gallery
            </Link>
          </li>
          <li>
            <Link href="/property" className="text-black">
              Properties
            </Link>
          </li>
          <li>
            <Link href="/about" className="text-black">
              About Us
            </Link>
          </li>
          <li>
            <Link href="/contact" className="text-black">
              Contact
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
