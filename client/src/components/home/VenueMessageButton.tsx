"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { EnquiryModal } from "@/components/home/EnquiryModal";

/** "Message" CTA on a venue's Stay listing card (Figma node 3384:8345) —
 * reuses EnquiryModal's own "reach the poster directly" flow rather than
 * forking a near-identical modal. EnquiryModal already degrades to a
 * local-only toast when there's no linked backend id, which every venue
 * post is, since venues have no backend counterpart yet (see
 * CreatePostModal). */
export function VenueMessageButton({ venueName }: { venueName: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="outline-gold" onClick={() => setOpen(true)}>
        Message
      </Button>
      <EnquiryModal open={open} onClose={() => setOpen(false)} listerName={venueName} />
    </>
  );
}
