import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import DesktopScreenGuard from "@/components/DesktopScreenGuard";
import AppShell from "@/components/layout/AppShell";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Festari Estate",
  description: "Festari Estate Online",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${plusJakartaSans.className} min-h-screen bg-gray-50`}>
        <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
        <DesktopScreenGuard>
          <AppShell>{children}</AppShell>
        </DesktopScreenGuard>
      </body>
    </html>
  );
}
