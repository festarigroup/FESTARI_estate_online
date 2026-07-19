import type { Metadata } from "next";
import ComingSoonPage from "@/components/ComingSoonPage";

export const metadata: Metadata = {
  title: "Privacy Policy | Festari Estate",
  description: "Read Festari Estates' privacy policy.",
};

export default function PrivacyPage() {
  return (
    <ComingSoonPage
      title="Privacy Policy"
      description="Our full privacy policy is being finalized by our legal team. Check back soon for the complete document."
    />
  );
}
