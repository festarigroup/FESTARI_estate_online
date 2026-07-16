import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | Festari Estate",
  description: "Login to your Festari Estate account.",
};

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
