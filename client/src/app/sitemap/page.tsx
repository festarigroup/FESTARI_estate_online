import type { Metadata } from "next";
import ComingSoonPage from "@/components/ComingSoonPage";

export const metadata: Metadata = {
  title: "Site Map | Festari Estate",
  description: "Browse a full map of the Festari Estates site.",
};

export default function SiteMapPage() {
  return (
    <ComingSoonPage
      title="Site Map"
      description="A full site map is on its way. In the meantime, use the navigation above to explore Festari Estates."
    />
  );
}
