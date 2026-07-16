import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verify Your Identity | Festari Estate",
  description: "Verify your identity to finish creating your Festari Estate account.",
};

export default function VerifyOtpLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
