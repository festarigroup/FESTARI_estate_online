"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ReservationModal } from "@/components/home/ReservationModal";

/** The "Make a Reservation" CTA a venue post's engagement bar renders on
 * the right — self-contained so PropertyPostCard/GeneralPostCard just drop
 * it in as PostEngagementBar's `cta` prop without owning any modal state
 * themselves. Same shape as PropertyEnquiryButton, just for venues. */
export function VenueReservationButton({ venueName }: { venueName: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* navy to match Book Service and Make Enquiry — every post's
          "primary action" CTA shares the same color now, not just the same
          footprint. */}
      <Button variant="navy" onClick={() => setOpen(true)} className="rounded-lg">
        Make a Reservation
      </Button>
      <ReservationModal open={open} onClose={() => setOpen(false)} venueName={venueName} />
    </>
  );
}
