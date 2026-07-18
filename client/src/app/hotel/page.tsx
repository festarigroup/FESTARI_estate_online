import HotelHero from "./components/HotelHero";
import HotelListingsGrid from "./components/HotelListingsGrid";
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
        <NewsletterSection />
      </Reveal>

      <LandingFooter />
    </>
  );
}
