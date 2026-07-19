import { notFound } from "next/navigation";
import { getArtisanById } from "@/lib/artisanShowcase";
import ArtisanDetailHero from "./components/ArtisanDetailHero";
import ArtisanReviewsSection from "./components/ArtisanReviewsSection";
import ArtisanHostCard from "./components/ArtisanHostCard";
import ArtisanCTASection from "@/app/services/components/ArtisanCTASection";
import LandingFooter from "@/app/home/components/LandingFooter";
import Reveal from "@/components/motion/Reveal";

export default async function ArtisanDetailPage({ params }: { params: Promise<{ artisanId: string }> }) {
  const { artisanId } = await params;
  const artisan = getArtisanById(Number(artisanId));

  if (!artisan) notFound();

  return (
    <>
      <ArtisanDetailHero artisan={artisan} />
      <Reveal>
        <ArtisanReviewsSection />
      </Reveal>
      <Reveal>
        <ArtisanHostCard artisan={artisan} />
      </Reveal>
      <Reveal>
        <ArtisanCTASection />
      </Reveal>
      <LandingFooter />
    </>
  );
}
