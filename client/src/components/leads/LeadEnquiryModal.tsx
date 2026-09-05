"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { createEnquiry } from "@/lib/mocks/leads";
import type { Listing } from "@/types/listing";

const INPUT_CLASS =
  "w-full rounded-lg border border-border-subtle px-3 py-2 text-sm text-ink placeholder:text-muted focus:outline-2 focus:outline-brand-gold";

interface LeadEnquiryModalProps {
  open: boolean;
  onClose: () => void;
  listing: Listing;
}

/**
 * "Enquire / Request Viewing" on a real, published Property Details page —
 * calls the mock lead-management `createEnquiry()` (not the real
 * `EnquiryModal`/`createPropertyInquiry` used elsewhere in the feed, which
 * hits an actual backend endpoint with no lead/pipeline concept at all).
 * On success, navigates to the resulting conversation by id — this module
 * never renders a conversation itself, only ever links to Messages, per
 * this branch's own non-goals.
 *
 * Collects only the qualification fields the spec allows (budget, move-in
 * date, lease duration) alongside plain contact details — see
 * `Prospect`'s own doc comment for why nothing else belongs here.
 */
export function LeadEnquiryModal({ open, onClose, listing }: LeadEnquiryModalProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [name, setName] = useState(() => [user?.firstname, user?.lastname].filter(Boolean).join(" ") || "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState("");
  const [budget, setBudget] = useState("");
  const [moveInDate, setMoveInDate] = useState("");
  const [leaseDurationMonths, setLeaseDurationMonths] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isRentalOrLease = listing.purpose === "rent" || listing.purpose === "lease";
  const canSubmit = name.trim().length > 0 && email.trim().length > 0;

  function reset() {
    setPhone("");
    setBudget("");
    setMoveInDate("");
    setLeaseDurationMonths("");
  }

  async function handleSubmit() {
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    try {
      const { conversationId } = await createEnquiry(listing.id, listing.title || "Untitled listing", {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        budget: budget.trim() ? Number(budget) : undefined,
        moveInDate: moveInDate || undefined,
        leaseDurationMonths: isRentalOrLease && leaseDurationMonths.trim() ? Number(leaseDurationMonths) : undefined,
      });
      toast.success("Enquiry sent — opening your conversation.");
      reset();
      onClose();
      router.push(`/messages?conversation=${conversationId}`);
    } catch {
      toast.error("Couldn't send your enquiry. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Enquire / Request Viewing">
      <div className="flex flex-col gap-4">
        <p className="text-sm text-muted">
          Send the owner your details and, if you like, a budget and timeline — they&apos;ll follow up directly.
        </p>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-ink">Full name</span>
          <input value={name} onChange={(e) => setName(e.target.value)} className={INPUT_CLASS} />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-ink">Email</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={INPUT_CLASS} />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-ink">Phone (optional)</span>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 024 123 4567"
              className={INPUT_CLASS}
            />
          </label>
        </div>

        {/* Transaction-relevant qualification only — budget/move-in
            date/lease duration, per spec. Nothing else belongs here. */}
        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-ink">Budget (optional)</span>
            <input
              type="number"
              min="0"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder={`e.g. ${listing.pricing?.amount ?? ""}`}
              className={INPUT_CLASS}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-ink">Move-in date (optional)</span>
            <input type="date" value={moveInDate} onChange={(e) => setMoveInDate(e.target.value)} className={INPUT_CLASS} />
          </label>
        </div>

        {isRentalOrLease && (
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-ink">Lease duration, months (optional)</span>
            <input
              type="number"
              min="1"
              value={leaseDurationMonths}
              onChange={(e) => setLeaseDurationMonths(e.target.value)}
              placeholder="e.g. 12"
              className={INPUT_CLASS}
            />
          </label>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="gold" onClick={handleSubmit} disabled={!canSubmit || submitting} className="px-6">
            {submitting ? "Sending..." : "Send Enquiry"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
