import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Change Contact Method | Festari Estate",
  description: "Choose which verified contact method to update.",
};

export default function ChangeContactLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
