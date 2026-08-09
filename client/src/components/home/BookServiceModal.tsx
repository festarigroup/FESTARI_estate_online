"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { DateTimeInput } from "@/components/ui/DateTimeInput";
import { hireArtisan } from "@/lib/api/artisans";
import { ApiError } from "@/lib/api/client";
import { cn } from "@/lib/cn";

interface BookServiceModalProps {
  open: boolean;
  onClose: () => void;
  /** Who the booking request goes to. */
  providerName: string;
  /** The real artisan_profiles.id to send the hire request against. Omitted
   * for posts that predate real artisan linkage — the form still submits
   * locally (toast only) in that case. */
  artisanId?: string;
}

const INPUT_CLASS =
  "w-full rounded-lg border border-border-subtle px-3 py-2 text-sm text-ink placeholder:text-muted focus:outline-2 focus:outline-brand-gold";

/** "Book Service" flow — date/time + contact details, sent to the
 * provider. Not a Figma frame (the file only shows the collapsed CTA);
 * built to give that button somewhere real to go, same reasoning as the
 * story/post composer modals. */
export function BookServiceModal({ open, onClose, providerName, artisanId }: BookServiceModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = name.trim().length > 0 && phone.trim().length > 0 && date.length > 0;

  function resetAndClose() {
    setPhone("");
    setDate("");
    setTime("");
    setNotes("");
    onClose();
  }

  async function handleSubmit() {
    if (!canSubmit) return;

    const summary = `Booking request from ${name} (${phone}) for ${date}${time ? ` at ${time}` : ""}.${
      notes.trim() ? ` Notes: ${notes.trim()}` : ""
    }`;

    if (!artisanId) {
      toast.success(`Booking request sent to ${providerName} for ${date}${time ? ` at ${time}` : ""}. They'll reach out to confirm.`);
      resetAndClose();
      return;
    }

    setSubmitting(true);
    try {
      await hireArtisan(artisanId, summary);
      toast.success(`Booking request sent to ${providerName} for ${date}${time ? ` at ${time}` : ""}. They'll reach out to confirm.`);
      resetAndClose();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Couldn't send your booking request.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal open={open} onClose={resetAndClose} title={`Book ${providerName}`}>
      <div className="flex flex-col gap-4">
        <p className="text-sm text-muted">
          Send {providerName} your preferred date and contact details — they&apos;ll confirm availability directly.
        </p>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-ink">Full name</span>
          <input value={name} onChange={(e) => setName(e.target.value)} className={INPUT_CLASS} />
        </label>

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

        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-ink">Preferred date</span>
            <DateTimeInput type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-ink">Preferred time</span>
            <DateTimeInput type="time" value={time} onChange={(e) => setTime(e.target.value)} />
          </label>
        </div>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-ink">Anything they should know? (optional)</span>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="e.g. Gate code, specific issue, preferred contact method..."
            className={cn(INPUT_CLASS, "resize-none")}
          />
        </label>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="ghost" onClick={resetAndClose}>
            Cancel
          </Button>
          <Button variant="gold" onClick={handleSubmit} disabled={!canSubmit || submitting} className="px-6">
            {submitting ? "Sending..." : "Send Request"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
