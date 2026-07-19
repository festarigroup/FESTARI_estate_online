import type { Metadata } from "next";
import ComingSoonPage from "@/components/ComingSoonPage";

export const metadata: Metadata = {
  title: "Artisan Directory | Festari Estate",
  description: "Browse the Festari Estates artisan directory by craft and region.",
};

export default function ArtisansPage() {
  return (
    <ComingSoonPage
      title="The Artisan Directory"
      description="We're building a dedicated directory for browsing artisans by craft and region. Meanwhile, meet our featured guild members on the Artisans page."
    />
  );
}
