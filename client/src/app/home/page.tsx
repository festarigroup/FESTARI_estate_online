import LandingHero from "./components/LandingHero";
import TrustStatsSection from "./components/TrustStatsSection";
import FeaturedEstatesSection from "./components/FeaturedEstatesSection";
import WhoWeAreSection from "./components/WhoWeAreSection";
import HolisticServicesSection from "./components/HolisticServicesSection";
import TestimonialsSection from "./components/TestimonialsSection";
import GlobalPortfolioSection from "./components/GlobalPortfolioSection";
import NewsletterSection from "./components/NewsletterSection";
import LandingFooter from "./components/LandingFooter";
import Reveal from "@/components/motion/Reveal";

export default function HomePage() {
  return (
    <>
      <LandingHero />

      <Reveal>
        <TrustStatsSection />
      </Reveal>

      <Reveal>
        <FeaturedEstatesSection />
      </Reveal>

      <Reveal>
        <WhoWeAreSection />
      </Reveal>

      <Reveal>
        <HolisticServicesSection />
      </Reveal>

      <Reveal>
        <TestimonialsSection />
      </Reveal>

      <Reveal>
        <GlobalPortfolioSection />
      </Reveal>

      <Reveal>
        <NewsletterSection />
      </Reveal>

      <LandingFooter />
    </>
  );
}
