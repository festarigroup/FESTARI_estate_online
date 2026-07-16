import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up | Festari Estate",
  description: "Create a Festari Estate account.",
};

export default function SignupLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
