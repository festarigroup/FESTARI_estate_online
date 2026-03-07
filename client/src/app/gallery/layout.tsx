import type { Metadata } from "next";
import Navbar from "@/components/navbar/layout";

export const metadata: Metadata = {
  title: "Gallery | Festari Estate",
  description:
    "Explore photos of properties, spaces, and services available on Festari Estates.",
};

export default function GalleryLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col p-8">
      {/* Hero Banner */}
      <div
        className="w-full h-screen shadow-sm rounded-lg bg-cover bg-center relative"
        style={{ backgroundImage: "url('/gallery.png')" }}
      >
        <Navbar />
        <div className="absolute bottom-8 left-8">
          <h2 className="text-4xl font-bold text-white uppercase">Gallery</h2>
        </div>
      </div>

      {/* Intro Text */}
      <p className="mt-10 text-gray-700 text-base">
        Explore photos of properties, spaces, and services available on Festari
        Estates
      </p>

      {/* Page Content */}
      <div className="mt-8">{children}</div>
    </div>
  );
}
