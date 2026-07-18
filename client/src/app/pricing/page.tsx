import PricingHero from "./components/PricingHero";
import MembershipTiersSection from "./components/MembershipTiersSection";
import TransparencySection from "./components/TransparencySection";
import PricingCTASection from "./components/PricingCTASection";
import LandingFooter from "@/app/home/components/LandingFooter";
import Reveal from "@/components/motion/Reveal";

export default function PricingPage() {
  return (
    <>
      <PricingHero />
      <Reveal><MembershipTiersSection /></Reveal>
      <TransparencySection />
      <Reveal><PricingCTASection /></Reveal>
      <LandingFooter />
    </>
  );
}
