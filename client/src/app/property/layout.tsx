import type { Metadata } from "next";
import Navbar from "@/components/navbar/layout";

export const metadata: Metadata = {
  title: "Properties | Festari Estate",
  description:
    "Browse available properties for sale and rent on Festari Estates.",
};

export default function PropertyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col p-8">
      {/* Hero Banner */}
      <div
        className="w-full h-screen shadow-sm rounded-lg bg-cover bg-center relative"
        style={{ backgroundImage: "url('/services.jpg')" }}
      >
        <Navbar />
        <div className="absolute bottom-8 left-8">
          <h2 className="text-4xl font-bold text-white uppercase">
            Properties
          </h2>
        </div>
      </div>

      {/* Intro Text */}
      <p className="mt-10 text-gray-700 text-base">
        Discover homes, apartments, and commercial spaces available for sale and
        rent across Ghana
      </p>

      {/* Page Content */}
      <div className="mt-8">{children}</div>
    </div>
  );
}
