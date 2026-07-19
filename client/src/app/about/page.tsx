import type { Metadata } from "next";
import ComingSoonPage from "@/components/ComingSoonPage";

export const metadata: Metadata = {
  title: "About Us | Festari Estate",
  description: "Learn about Festari Estates' story, people, and mission.",
};

export default function AboutPage() {
  return (
    <ComingSoonPage
      title="About Festari Estates"
      description="We're crafting the story of our guild, our people, and our mission. Check back soon to learn what drives Festari Estates."
    />
  );
}
