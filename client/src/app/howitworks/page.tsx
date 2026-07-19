import type { Metadata } from "next";
import ComingSoonPage from "@/components/ComingSoonPage";

export const metadata: Metadata = {
  title: "How It Works | Festari Estate",
  description: "See how Festari Estates works, from inquiry to acquisition.",
};

export default function HowItWorksPage() {
  return (
    <ComingSoonPage
      title="How It Works"
      description="We're putting together a clear walkthrough of how Festari Estates works, from inquiry to acquisition. Check back soon."
    />
  );
}
