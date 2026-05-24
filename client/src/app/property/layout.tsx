import type { Metadata } from "next";

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
  return <>{children}</>;
}
