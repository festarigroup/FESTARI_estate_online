import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing | Festari Estate",
  description: "Explore Festari Estates' membership tiers for exclusive access to properties, hotels, and artisans.",
};

export default function PricingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="min-h-screen">{children}</div>;
}
