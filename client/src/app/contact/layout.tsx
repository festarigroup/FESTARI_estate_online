import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Festari Estate",
  description: "Get in touch with Festari Estates' concierge team for real estate, hotel, and artisan inquiries.",
};

export default function ContactLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="min-h-screen">{children}</div>;
}
