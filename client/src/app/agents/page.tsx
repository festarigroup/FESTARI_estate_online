import type { Metadata } from "next";
import ComingSoonPage from "@/components/ComingSoonPage";

export const metadata: Metadata = {
  title: "Our Agents | Festari Estate",
  description: "Browse Festari Estates' network of verified real estate agents.",
};

export default function AgentsPage() {
  return (
    <ComingSoonPage
      title="Our Agents Network"
      description="A dedicated space for our network of real estate agents is coming. Soon you'll be able to browse verified agents and their portfolios."
    />
  );
}
