import type { Metadata } from "next";
import ComingSoonPage from "@/components/ComingSoonPage";

export const metadata: Metadata = {
  title: "Seller Sign In | Festari Estate",
  description: "Sign in to your Festari Estates seller dashboard.",
};

export default function SignInPage() {
  return (
    <ComingSoonPage
      title="Seller Sign In"
      description="A dedicated seller sign-in experience is in progress. Use the main login for now while we finish this."
    />
  );
}
