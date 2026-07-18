import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Artisans | Festari Estate",
  description: "Meet the master artisans curated by Festari Estates to furnish and finish every property.",
};

export default function ServicesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="min-h-screen">{children}</div>;
}
