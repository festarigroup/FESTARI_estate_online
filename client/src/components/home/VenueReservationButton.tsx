"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ReservationModal } from "@/components/home/ReservationModal";

interface VenueReservationButtonProps {
  venueName: string;
  /** Defaults to the Figma "Book Service" outline-pill style (node
   * 3340:1102), matching every other post's "primary action" CTA. The
   * Stay listing page's own card (node 3387:8909) instead uses a filled
   * gold pill labeled "Reserve" — same modal, different button chrome. */
  variant?: "outline-gold" | "gold-pill";
  label?: string;
}

/** The "Make a Reservation" / "Reserve" CTA a venue post renders — self-
 * contained so callers just drop it in without owning any modal state
 * themselves. Same shape as PropertyEnquiryButton, just for venues. */
export function VenueReservationButton({
  venueName,
  variant = "outline-gold",
  label = "Make a Reservation",
}: VenueReservationButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant={variant} onClick={() => setOpen(true)}>
        {label}
      </Button>
      <ReservationModal open={open} onClose={() => setOpen(false)} venueName={venueName} />
    </>
  );
}
