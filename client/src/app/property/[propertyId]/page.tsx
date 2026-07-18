import { notFound } from "next/navigation";
import LandingNavbar from "@/app/home/components/LandingNavbar";
import NewsletterSection from "@/app/home/components/NewsletterSection";
import LandingFooter from "@/app/home/components/LandingFooter";
import Reveal from "@/components/motion/Reveal";
import { getPropertyById } from "@/lib/properties";
import PropertyHeroGallery from "./components/PropertyHeroGallery";
import PropertyQuickStats from "./components/PropertyQuickStats";
import PropertyDescription from "./components/PropertyDescription";
import PropertyAmenities from "./components/PropertyAmenities";
import PropertyNeighborhoodMap from "./components/PropertyNeighborhoodMap";
import PropertyFinancialPlanning from "./components/PropertyFinancialPlanning";
import PropertyReviews from "./components/PropertyReviews";
import PropertyAgentCard from "./components/PropertyAgentCard";

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ propertyId: string }>;
}) {
  const { propertyId } = await params;
  const property = getPropertyById(Number(propertyId));

  if (!property) {
    notFound();
  }

  return (
    <>
      <LandingNavbar />

      <section className="w-full bg-white px-8 py-8 md:py-12">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-12">
          <Reveal>
            <PropertyHeroGallery property={property} />
          </Reveal>

          <div className="flex flex-col gap-12 lg:flex-row lg:gap-8">
            <div className="flex flex-1 flex-col gap-12">
              <Reveal>
                <PropertyQuickStats property={property} />
              </Reveal>
              <Reveal>
                <PropertyDescription property={property} />
              </Reveal>
              <Reveal>
                <PropertyAmenities />
              </Reveal>
              <Reveal>
                <PropertyNeighborhoodMap property={property} />
              </Reveal>
              <Reveal>
                <PropertyFinancialPlanning property={property} />
              </Reveal>
              <Reveal>
                <PropertyReviews />
              </Reveal>
            </div>

            <div className="lg:w-[368px] lg:shrink-0">
              <div className="lg:sticky lg:top-28">
                <Reveal>
                  <PropertyAgentCard />
                </Reveal>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Reveal>
        <NewsletterSection />
      </Reveal>

      <LandingFooter />
    </>
  );
}
