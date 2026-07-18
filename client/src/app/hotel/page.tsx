import HotelHero from "./components/HotelHero";
import HotelListingsGrid from "./components/HotelListingsGrid";
import HotelFAQSection from "./components/HotelFAQSection";
import NewsletterSection from "@/app/home/components/NewsletterSection";
import LandingFooter from "@/app/home/components/LandingFooter";
import Reveal from "@/components/motion/Reveal";

export default function HotelPage() {
  return (
    <>
      <HotelHero />

      <Reveal>
        <HotelListingsGrid />
      </Reveal>

      <Reveal>
        <HotelFAQSection />
      </Reveal>

      <Reveal>
        <NewsletterSection />
      </Reveal>

      <LandingFooter />
    </>
  );
}
