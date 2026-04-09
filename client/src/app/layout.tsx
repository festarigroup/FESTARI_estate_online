import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import Footer from "@/components/footer/layout";
import Navbar from "@/components/navbar/layout";
import SidebarLayout from "@/components/sidebar/layout";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Festari Estate",
  description: "Festari Estate Online",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${plusJakartaSans.className} min-h-screen bg-gray-50`}>
        <SidebarLayout />
        <div className="min-h-screen ml-64 flex flex-col">
          <Navbar />
          <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
