"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { EnquiryModal } from "@/components/home/EnquiryModal";

/** The "Make Enquiry" CTA a property post's engagement bar renders on the
 * right — self-contained so PropertyPostCard/GeneralPostCard just drop it
 * in as PostEngagementBar's `cta` prop without owning any modal state
 * themselves. */
export function PropertyEnquiryButton({ listerName }: { listerName: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* navy to match Book Service and Make a Reservation — every post's
          "primary action" CTA shares the same color now, not just the same
          footprint. */}
      <Button variant="navy" onClick={() => setOpen(true)} className="rounded-lg">
        Make Enquiry
      </Button>
      <EnquiryModal open={open} onClose={() => setOpen(false)} listerName={listerName} />
    </>
  );
}
