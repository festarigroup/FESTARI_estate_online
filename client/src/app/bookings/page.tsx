import type { Metadata } from "next";
import ComingSoonPage from "@/components/ComingSoonPage";

export const metadata: Metadata = {
  title: "Artisan Bookings | Festari Estate",
  description: "Manage your Festari Estates artisan commission bookings.",
};

export default function BookingsPage() {
  return (
    <ComingSoonPage
      title="Artisan Bookings"
      description="Booking management for artisan commissions is coming soon. We'll notify you the moment it's ready."
    />
  );
}
