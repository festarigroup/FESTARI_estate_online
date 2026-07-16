import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password | Festari Estate",
  description: "Reset your Festari Estate account password.",
};

export default function ForgotPasswordLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
