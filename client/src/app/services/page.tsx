import ArtisanHero from "./components/ArtisanHero";
import ArtisanPortfolioGrid from "./components/ArtisanPortfolioGrid";
import MaterialShowcaseSection from "./components/MaterialShowcaseSection";
import ArtisanCTASection from "./components/ArtisanCTASection";
import LandingFooter from "@/app/home/components/LandingFooter";
import Reveal from "@/components/motion/Reveal";

export default function ServicesPage() {
  return (
    <>
      <ArtisanHero />
      <Reveal><ArtisanPortfolioGrid /></Reveal>
      <Reveal><MaterialShowcaseSection /></Reveal>
      <Reveal><ArtisanCTASection /></Reveal>
      <LandingFooter />
    </>
  );
}
