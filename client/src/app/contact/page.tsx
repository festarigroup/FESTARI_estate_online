import ContactHero from "./components/ContactHero";
import ContactFormSection from "./components/ContactFormSection";
import ContactFAQSection from "./components/ContactFAQSection";
import ContactLocationSection from "./components/ContactLocationSection";
import PricingCTASection from "@/app/pricing/components/PricingCTASection";
import LandingFooter from "@/app/home/components/LandingFooter";
import Reveal from "@/components/motion/Reveal";

export default function ContactPage() {
  return (
    <>
      <ContactHero />
      <ContactFormSection />
      <Reveal>
        <ContactFAQSection />
      </Reveal>
      <ContactLocationSection />
      <Reveal>
        <PricingCTASection />
      </Reveal>
      <LandingFooter />
    </>
  );
}
