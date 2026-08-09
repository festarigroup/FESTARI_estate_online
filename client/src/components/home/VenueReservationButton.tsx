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
      {/* outline-gold matches the Figma "Book Service" button (node
          3340:1102) — every post's "primary action" CTA now shares that
          same transparent-pill style, not an invented solid navy. */}
      <Button variant="outline-gold" onClick={() => setOpen(true)}>
        Make a Reservation
      </Button>
      <ReservationModal open={open} onClose={() => setOpen(false)} venueName={venueName} />
    </>
  );
}
