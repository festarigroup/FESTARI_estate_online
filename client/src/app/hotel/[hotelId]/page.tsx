import { notFound } from "next/navigation";
import LandingNavbar from "@/app/home/components/LandingNavbar";
import NewsletterSection from "@/app/home/components/NewsletterSection";
import LandingFooter from "@/app/home/components/LandingFooter";
import Reveal from "@/components/motion/Reveal";
import { getHotelById } from "@/lib/hotels";
import HotelHeroGallery from "./components/HotelHeroGallery";
import HotelQuickStats from "./components/HotelQuickStats";
import HotelDescription from "./components/HotelDescription";
import HotelAmenities from "./components/HotelAmenities";
import HotelBookingCard from "./components/HotelBookingCard";
import HotelGuestFavorite from "./components/HotelGuestFavorite";
import HotelReviews from "./components/HotelReviews";

export default async function HotelDetailPage({
  params,
}: {
  params: Promise<{ hotelId: string }>;
}) {
  const { hotelId } = await params;
  const hotel = getHotelById(Number(hotelId));

  if (!hotel) {
    notFound();
  }

  return (
    <>
      <LandingNavbar />

      <section className="w-full bg-white px-8 py-8 md:py-12">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-12">
          <Reveal>
            <HotelHeroGallery hotel={hotel} />
          </Reveal>

          <div className="flex flex-col gap-12 lg:flex-row lg:gap-8">
            <div className="flex flex-1 flex-col gap-12">
              <Reveal>
                <HotelQuickStats hotel={hotel} />
              </Reveal>
              <Reveal>
                <HotelDescription hotel={hotel} />
              </Reveal>
              <Reveal>
                <HotelAmenities />
              </Reveal>
            </div>

            <div className="lg:w-[368px] lg:shrink-0">
              <div className="lg:sticky lg:top-28">
                <Reveal>
                  <HotelBookingCard hotel={hotel} />
                </Reveal>
              </div>
            </div>
          </div>

          <Reveal>
            <HotelGuestFavorite hotel={hotel} />
          </Reveal>

          <Reveal>
            <HotelReviews hotel={hotel} />
          </Reveal>
        </div>
      </section>

      <Reveal>
        <NewsletterSection />
      </Reveal>

      <LandingFooter />
    </>
  );
}
