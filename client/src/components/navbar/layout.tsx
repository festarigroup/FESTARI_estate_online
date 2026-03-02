"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { label: "Logout", href: "/logout" },
    { label: "Register", href: "/signup" },
    { label: "Properties", href: "/properties" },
    { label: "Artisans", href: "/artisans" },
    { label: "Hotels", href: "/hotels" },
    { label: "Pricings", href: "/pricing" },
    { label: "Make Inquiry", href: "/inquiry" },
    { label: "About Us", href: "/about" },
  ];

  return (
    <nav className="mt-4 w-full">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center px-8 h-12.5 mx-auto">
        <div aria-hidden="true" />
        <div className="bg-white border border-gray-200 rounded-md px-6 py-2.5 flex items-center gap-4">
          <Link
            href="/list-property"
            className="text-gray-700 hover:text-gray-900 text-sm font-medium"
          >
            List a property
          </Link>
          <Link
            href="/list-venue"
            className="text-gray-700 hover:text-gray-900 text-sm font-medium"
          >
            List a venue
          </Link>
          <Link
            href="/offer-service"
            className="text-gray-700 hover:text-gray-900 text-sm font-medium"
          >
            Offer your service
          </Link>
          <button
            className="w-8 h-8 rounded-full bg-[#BE4D00] flex items-center justify-center hover:bg-[#a64300] transition-colors ml-2"
            aria-label="Filter"
          >
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
          </button>
        </div>

        <div className="relative flex items-center gap-3 justify-self-end">
          <Link
            href="/become-host"
            className="border border-[#BE4D00] text-[#BE4D00] px-4 py-2 rounded-md text-sm font-medium hover:bg-[#BE4D00] hover:text-white transition-colors"
          >
            Become host
          </Link>
          <button
            className="w-10 h-10 flex items-center justify-center text-[#BE4D00] hover:text-[#a64300] transition-colors"
            aria-label="Open menu"
            aria-expanded={isMenuOpen}
            aria-controls="navbar-menu"
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {isMenuOpen && (
            <div
              id="navbar-menu"
              role="menu"
              className="absolute right-0 top-12 w-48 bg-white border border-gray-200 shadow-lg"
            >
              <ul className="divide-y divide-gray-200">
                {menuItems.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <h1 className="text-xl font-bold text-gray-900">Festari Estate</h1>
      </div>
    </nav>
  );
}
