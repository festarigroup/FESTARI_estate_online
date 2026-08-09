"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { BookServiceModal } from "@/components/home/BookServiceModal";

/** The "Book Service" CTA a service post's action bar renders on the
 * right — self-contained so ServiceActionsBar just drops it into its `cta`
 * slot without owning any modal state itself, the same shape as
 * PropertyEnquiryButton/VenueReservationButton. Pulled out of
 * ServiceActionsBar once that bar needed to render a *different* CTA for
 * venue posts (VenueReservationButton) — the bar itself doesn't know or
 * care which one it's holding. */
export function BookServiceButton({ providerName }: { providerName: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* outline-gold matches the Figma "Book Service" button (node
          3340:1102) exactly -- a transparent pill, not a filled color. */}
      <Button variant="outline-gold" onClick={() => setOpen(true)}>
        Book Service
      </Button>
      <BookServiceModal open={open} onClose={() => setOpen(false)} providerName={providerName} />
    </>
  );
}
