"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { DateTimeInput } from "@/components/ui/DateTimeInput";
import { createBooking } from "@/lib/api/hotels";
import { ApiError } from "@/lib/api/client";
import { cn } from "@/lib/cn";

interface ReservationModalProps {
  open: boolean;
  onClose: () => void;
  /** Who the reservation request goes to — the venue, not the viewer. */
  venueName: string;
  /** The real backend hotels.id to book against. Omitted for venue posts
   * that predate real hotel linkage — the form still submits locally
   * (toast only) in that case, same pattern as BookServiceModal/
   * EnquiryModal. Also gates the "Check-out date" field: a real booking
   * needs a check_in/check_out range (see POST /hotels/:hotelId/bookings),
   * a local-only reservation never did. */
  hotelId?: string;
}

const INPUT_CLASS =
  "w-full rounded-lg border border-border-subtle px-3 py-2 text-sm text-ink placeholder:text-muted focus:outline-2 focus:outline-brand-gold";

/** "Make a Reservation" flow for venue posts — party size, date/time, and
 * contact details, sent to the venue. Not a Figma frame (the file only
 * shows the collapsed post card); mirrors BookServiceModal/EnquiryModal's
 * shape since all three are "reach the poster directly" forms, just for a
 * different post kind. */
export function ReservationModal({ open, onClose, venueName, hotelId }: ReservationModalProps) {
  const [name, setName] = useState("Kwame");
  const [phone, setPhone] = useState("");
  const [partySize, setPartySize] = useState("");
  const [date, setDate] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const canSubmit =
    name.trim().length > 0 && phone.trim().length > 0 && date.length > 0 && (!hotelId || checkOut.length > 0);

  function resetAndClose() {
    setPhone("");
    setPartySize("");
    setDate("");
    setCheckOut("");
    setTime("");
    setNotes("");
    onClose();
  }

  async function handleSubmit() {
    if (!canSubmit) return;

    const confirmation = `Reservation request sent to ${venueName} for ${date}${time ? ` at ${time}` : ""}${
      partySize ? ` (party of ${partySize})` : ""
    }. They'll confirm availability.`;

    if (!hotelId) {
      toast.success(confirmation);
      resetAndClose();
      return;
    }

    setSubmitting(true);
    try {
      await createBooking(hotelId, { check_in: date, check_out: checkOut, guests: Number(partySize) || 1 });
      toast.success(confirmation);
      resetAndClose();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Couldn't send your reservation.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal open={open} onClose={resetAndClose} title={`Reserve at ${venueName}`}>
      <div className="flex flex-col gap-4">
        <p className="text-sm text-muted">
          Send {venueName} your party size and preferred date — they&apos;ll confirm availability directly.
        </p>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-ink">Full name</span>
          <input value={name} onChange={(e) => setName(e.target.value)} className={INPUT_CLASS} />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-ink">Phone number</span>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 024 123 4567"
              className={INPUT_CLASS}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-ink">Party size</span>
            <input
              type="number"
              min="1"
              value={partySize}
              onChange={(e) => setPartySize(e.target.value)}
              placeholder="e.g. 4"
              className={INPUT_CLASS}
            />
          </label>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-ink">{hotelId ? "Check-in date" : "Preferred date"}</span>
            <DateTimeInput type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </label>
          {hotelId ? (
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-ink">Check-out date</span>
              <DateTimeInput type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
            </label>
          ) : (
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-ink">Preferred time</span>
              <DateTimeInput type="time" value={time} onChange={(e) => setTime(e.target.value)} />
            </label>
          )}
        </div>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-ink">Anything they should know? (optional)</span>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="e.g. Occasion, seating preference, accessibility needs..."
            className={cn(INPUT_CLASS, "resize-none")}
          />
        </label>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="ghost" onClick={resetAndClose}>
            Cancel
          </Button>
          <Button variant="gold" onClick={handleSubmit} disabled={!canSubmit || submitting} className="px-6 py-2">
            {submitting ? "Sending..." : "Send Reservation"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
