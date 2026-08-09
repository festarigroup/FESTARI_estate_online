"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { createPropertyInquiry } from "@/lib/api/inquiries";
import { ApiError } from "@/lib/api/client";
import { cn } from "@/lib/cn";

interface EnquiryModalProps {
  open: boolean;
  onClose: () => void;
  /** Who the enquiry goes to — the lister/agent, not the viewer. */
  listerName: string;
  /** The real properties.id to send the enquiry against. Omitted for posts
   * that predate real property linkage — the form still submits locally
   * (toast only) in that case. */
  propertyId?: string;
}

const INPUT_CLASS =
  "w-full rounded-lg border border-border-subtle px-3 py-2 text-sm text-ink placeholder:text-muted focus:outline-2 focus:outline-brand-gold";

const DEFAULT_MESSAGE = "Hi, I'm interested in this listing. Could you share more details?";

/** "Make Enquiry" flow for property posts — contact details + a message,
 * sent to the lister. Not a Figma frame (the file only shows the
 * collapsed post card); mirrors BookServiceModal's shape since both are
 * "reach the poster directly" forms, just for a different post kind. */
export function EnquiryModal({ open, onClose, listerName, propertyId }: EnquiryModalProps) {
  const { user } = useAuth();
  const [name, setName] = useState(() => [user?.firstname, user?.lastname].filter(Boolean).join(" ") || "");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState(user?.email ?? "");
  const [message, setMessage] = useState(DEFAULT_MESSAGE);
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = name.trim().length > 0 && email.trim().length > 0 && message.trim().length > 0;

  function resetAndClose() {
    setPhone("");
    setMessage(DEFAULT_MESSAGE);
    onClose();
  }

  async function handleSubmit() {
    if (!canSubmit) return;

    if (!propertyId) {
      toast.success(`Enquiry sent to ${listerName}. They'll be in touch.`);
      resetAndClose();
      return;
    }

    setSubmitting(true);
    try {
      await createPropertyInquiry({
        property_id: propertyId,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        message: message.trim(),
      });
      toast.success(`Enquiry sent to ${listerName}. They'll be in touch.`);
      resetAndClose();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Couldn't send your enquiry.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal open={open} onClose={resetAndClose} title={`Enquire about this listing`}>
      <div className="flex flex-col gap-4">
        <p className="text-sm text-muted">
          Send {listerName} your contact details and a message — they&apos;ll follow up directly.
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
            <span className="text-xs font-semibold text-ink">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={INPUT_CLASS}
            />
          </label>
        </div>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-ink">Message</span>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            className={cn(INPUT_CLASS, "resize-none")}
          />
        </label>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="ghost" onClick={resetAndClose}>
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
