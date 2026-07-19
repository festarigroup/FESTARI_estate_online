import type { Metadata } from "next";
import ComingSoonPage from "@/components/ComingSoonPage";

export const metadata: Metadata = {
  title: "Become a Host | Festari Estate",
  description: "List your property, hotel, or artisan service with Festari Estates.",
};

export default function BecomeHostPage() {
  return (
    <ComingSoonPage
      title="Become a Host"
      description="Our host onboarding experience is being finely tuned. Soon you'll be able to list your property, hotel, or artisan service directly with us."
    />
  );
}
