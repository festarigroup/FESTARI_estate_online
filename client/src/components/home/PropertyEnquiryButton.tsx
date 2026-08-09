"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { EnquiryModal } from "@/components/home/EnquiryModal";

/** The "Make Enquiry" CTA a property post's engagement bar renders on the
 * right — self-contained so PropertyPostCard/GeneralPostCard just drop it
 * in as PostEngagementBar's `cta` prop without owning any modal state
 * themselves. */
export function PropertyEnquiryButton({ listerName, propertyId }: { listerName: string; propertyId?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* outline-gold matches the Figma "Book Service" button (node
          3340:1102) — every post's "primary action" CTA now shares that
          same transparent-pill style, not an invented solid navy. */}
      <Button variant="outline-gold" onClick={() => setOpen(true)}>
        Make Enquiry
      </Button>
      <EnquiryModal open={open} onClose={() => setOpen(false)} listerName={listerName} propertyId={propertyId} />
    </>
  );
}
