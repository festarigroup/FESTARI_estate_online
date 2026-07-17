import { Montserrat, Inter, Manrope } from "next/font/google";

export const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-landing-montserrat",
  display: "swap",
});

export const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-landing-inter",
  display: "swap",
});

export const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-landing-manrope",
  display: "swap",
});
