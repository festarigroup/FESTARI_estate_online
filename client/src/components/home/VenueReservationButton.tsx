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
      <Button variant="gold" onClick={() => setOpen(true)} className="px-6 py-2">
        Make a Reservation
      </Button>
      <ReservationModal open={open} onClose={() => setOpen(false)} venueName={venueName} />
    </>
  );
}
