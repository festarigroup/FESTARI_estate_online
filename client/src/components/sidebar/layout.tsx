"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Gallery", href: "/gallery" },
  { label: "Properties", href: "/property" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function SidebarLayout() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 w-64 h-screen bg-white flex flex-col items-center border-r border-gray-200 overflow-y-auto">
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="pt-4 text-center"
      >
        <Image
          src="/FestariEstatesLogo.png"
          alt="Festari Estates Logo"
          width={250}
          height={250}
          priority
        />
        <p className=" text-[#BE4D00] tracking-wider">SEARCH. SECURE. SETTLE</p>
      </motion.div>

      {/* Navigation */}
      <nav className="mt-8 w-full flex-1">
        <ul className="space-y-4 text-center text-[16px] font-lightbold ">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className={`group relative inline-flex items-center gap-2 transition-colors duration-200 ${
                    isActive ? "text-[#BE4D00] font-semibold" : "text-black hover:text-[#BE4D00]"
                  }`}
                >
                  {item.label}
                  <span
                    className={`absolute -bottom-1 left-0 h-[2px] w-full origin-left bg-[#BE4D00] transition-transform duration-300 ease-out ${
                      isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
