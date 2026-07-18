import PropertyHero from "./components/PropertyHero";
import PropertyListingsGrid from "./components/PropertyListingsGrid";
import NewsletterSection from "@/app/home/components/NewsletterSection";
import LandingFooter from "@/app/home/components/LandingFooter";
import Reveal from "@/components/motion/Reveal";

export default function PropertyPage() {
  return (
    <>
      <PropertyHero />

      <Reveal>
        <PropertyListingsGrid />
      </Reveal>

      <Reveal>
        <NewsletterSection />
      </Reveal>

      <LandingFooter />
    </>
  );
}
