import StatsMarquee, { type MarqueeStat } from "./components/StatsMarquee";
import HeroSection from "./components/HeroSection";
import WhoWeAreSection from "./components/WhoWeAreSection";
import OurServicesSection from "./components/OurServicesSection";
import GettingStartedSection from "./components/GettingStartedSection";
import FeaturedPropertiesSection from "./components/FeaturedPropertiesSection";
import DashboardWorksSection from "./components/DashboardWorksSection";
import MarketplaceValueSection from "./components/MarketplaceValueSection";
import FeaturedInSection from "./components/FeaturedInSection";
import TestimonialsSection from "./components/TestimonialsSection";
import PricingSection from "./components/PricingSection";
import SuccessStoriesSection from "./components/SuccessStoriesSection";
import FAQSection from "./components/FAQSection";
import ReadyJourneySection from "./components/ReadyJourneySection";
import Reveal from "@/components/motion/Reveal";

export default function HomePage() {
  const stats: MarqueeStat[] = [
    { value: "340+", label: "Clients helped in their search" },
    { value: "500+", label: "Homes available to you" },
    { value: "500+", label: "Homes available to you" },
    { value: "340+", label: "Clients helped in their search" },
    { value: "500+", label: "Homes available to you" },
  ];

  return (
    <>
      <HeroSection />

      {/* ─── Stats Marquee Section ─── */}
      <StatsMarquee stats={stats} durationSeconds={25} repeat={2} />

      {/* ─── Who We Are Section ─── */}
      <Reveal>
        <WhoWeAreSection />
      </Reveal>

      {/* ─── Our Services Section ─── */}
      <Reveal>
        <OurServicesSection />
      </Reveal>

      {/* ─── Getting Started Section ─── */}
      <Reveal>
        <GettingStartedSection />
      </Reveal>

      {/* ─── Featured Properties Section ─── */}
      <Reveal>
        <FeaturedPropertiesSection />
      </Reveal>

      {/* ─── Dashboard Works Section ─── */}
      <Reveal>
        <DashboardWorksSection />
      </Reveal>

      {/* ─── Marketplace Value Section ─── */}
      <Reveal>
        <MarketplaceValueSection />
      </Reveal>

      {/* ─── Featured In + Testimonials + Pricing ─── */}
      <Reveal>
        <FeaturedInSection />
      </Reveal>
      <Reveal>
        <TestimonialsSection />
      </Reveal>
      <Reveal>
        <PricingSection />
      </Reveal>

      {/* ─── Success Stories + FAQ + Ready Journey ─── */}
      <Reveal>
        <SuccessStoriesSection />
      </Reveal>
      <Reveal>
        <FAQSection />
      </Reveal>
      <Reveal>
        <ReadyJourneySection />
      </Reveal>
    </>
  );
}
