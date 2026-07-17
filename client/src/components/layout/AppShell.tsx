"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import Footer from "@/components/footer/layout";
import Navbar from "@/components/navbar/layout";
import SidebarLayout from "@/components/sidebar/layout";
import PageTransition from "@/components/motion/PageTransition";
import Reveal from "@/components/motion/Reveal";

// Routes that render full-bleed, without the site sidebar/navbar/footer chrome.
const BARE_ROUTES = ["/home", "/property", "/login", "/signup", "/verify-otp", "/verify-otp/change-contact", "/forgot-password"];

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  if (BARE_ROUTES.includes(pathname)) {
    return <>{children}</>;
  }

  return (
    <>
      <SidebarLayout />
      <div className="min-h-screen ml-[16rem] flex flex-col">
        <Navbar />
        <main className="flex-1">
          <PageTransition>{children}</PageTransition>
        </main>
        <Reveal>
          <Footer />
        </Reveal>
      </div>
    </>
  );
}
