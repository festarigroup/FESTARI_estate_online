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
      {/* gold's variant styles carry no horizontal padding by default (every
          other gold button in the app adds its own px-* for that reason) —
          px-6 py-2 here matches Book Service's navy button exactly, so the
          two CTAs share the same footprint and only differ by color. */}
      <Button variant="gold" onClick={() => setOpen(true)} className="px-6 py-2">
        Make Enquiry
      </Button>
      <EnquiryModal open={open} onClose={() => setOpen(false)} listerName={listerName} />
    </>
  );
}
