import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Poppins } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["600"],
});

export const metadata: Metadata = {
  title: "Biltlinx",
  description: "Connecting the Built Environment",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${poppins.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            className: "font-sans",
            style: {
              background: "#ffffff",
              color: "#16151a",
              fontSize: "14px",
              fontWeight: 500,
              padding: "12px 16px",
              borderRadius: "12px",
              boxShadow:
                "0px 20px 24px -4px rgba(10,13,18,0.1), 0px 8px 8px -4px rgba(10,13,18,0.04)",
            },
            success: {
              iconTheme: { primary: "#1465e6", secondary: "#ffffff" },
            },
            error: {
              iconTheme: { primary: "#e73d1c", secondary: "#ffffff" },
            },
          }}
        />
      </body>
    </html>
  );
}
