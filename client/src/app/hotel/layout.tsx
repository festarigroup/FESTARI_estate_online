import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hotels | Festari Estate",
  description: "Explore available hotels on Festari Estate.",
};

export default function HotelLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="min-h-screen">{children}</div>;
}
