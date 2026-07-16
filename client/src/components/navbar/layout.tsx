"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { label: "Hotels", href: "/hotel" },
    { label: "Artisan", href: "/artisans" },
    { label: "Agents", href: "/agents" },
    { label: "About us", href: "/about" },
    { label: "Pricings", href: "/pricing" },
  ];

  return (
    <nav className="mt-4 w-full border-b border-gray-200 bg-transparent">
      <div className="mx-auto flex h-16 w-full max-w-[1180px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="hidden items-center gap-8 lg:flex">
          {navLinks.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="group relative text-base font-medium leading-none text-gray-900 transition-colors hover:text-[#BE4D00]"
            >
              {item.label}
              <span className="absolute -bottom-1.5 left-0 h-[2px] w-full origin-left scale-x-0 bg-[#BE4D00] transition-transform duration-300 ease-out group-hover:scale-x-100" />
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-4 lg:flex">
          <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/become-host"
              className="inline-flex items-center border border-gray-300 bg-gray-100 px-5 py-2 text-base font-medium text-gray-800 transition-colors hover:bg-gray-200"
            >
              Become a host
            </Link>
          </motion.div>
          <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/signup"
              className="bg-[#BE4D00] px-4 py-2 text-base font-medium leading-none text-white transition-colors hover:bg-[#a64300]"
            >
              Signup
            </Link>
          </motion.div>
          <Link
            href="/login"
            className="group relative text-base font-medium leading-none text-gray-900 transition-colors hover:text-[#BE4D00]"
          >
            Log in
            <span className="absolute -bottom-1.5 left-0 h-[2px] w-full origin-left scale-x-0 bg-[#BE4D00] transition-transform duration-300 ease-out group-hover:scale-x-100" />
          </Link>
        </div>

        <div className="relative flex items-center lg:hidden">
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="inline-flex h-10 w-10 items-center justify-center text-gray-800 transition-colors hover:text-[#BE4D00]"
            aria-label="Open menu"
            aria-expanded={isMenuOpen}
            aria-controls="navbar-menu"
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            <motion.svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              animate={{ rotate: isMenuOpen ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </motion.svg>
          </motion.button>

          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                id="navbar-menu"
                role="menu"
                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                className="absolute right-0 top-12 z-20 w-60 origin-top-right border border-gray-200 bg-white shadow-lg"
              >
                <ul className="divide-y divide-gray-200">
                  {navLinks.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className="block px-4 py-2 text-base text-gray-800 transition-colors hover:bg-gray-100 hover:text-[#BE4D00]"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link
                      href="/login"
                      className="block px-4 py-2 text-base text-gray-800 transition-colors hover:bg-gray-100 hover:text-[#BE4D00]"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Log in
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/signup"
                      className="block bg-[#BE4D00] px-4 py-2 text-base text-white transition-colors hover:bg-[#a64300]"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Signup
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/become-host"
                      className="block px-4 py-2 text-base text-gray-800 transition-colors hover:bg-gray-100 hover:text-[#BE4D00]"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Become a host
                    </Link>
                  </li>
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
}
