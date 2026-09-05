"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { submitVerification } from "@/lib/mocks/verification";
import { DOMAIN_META, type VerificationDomain } from "@/types/verification";

interface SubmitVerificationModalProps {
  domain: VerificationDomain;
  open: boolean;
  onClose: () => void;
  onSubmitted: () => void;
}

/**
 * The (re)submission flow for one domain — a file input that "submits" to
 * the mock is enough here, per this branch's own non-goals (no real
 * upload/storage logic). Picking a file just proves the button out;
 * nothing is actually read from or uploaded anywhere.
 */
export function SubmitVerificationModal({ domain, open, onClose, onSubmitted }: SubmitVerificationModalProps) {
  const [fileName, setFileName] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const meta = DOMAIN_META[domain];

  function reset() {
    setFileName(null);
  }

  async function handleSubmit() {
    if (!fileName || submitting) return;
    setSubmitting(true);
    try {
      await submitVerification(domain);
      toast.success(`${meta.label} document submitted for review.`);
      reset();
      onSubmitted();
      onClose();
    } catch {
      toast.error("Couldn't submit — please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={() => {
        reset();
        onClose();
      }}
      title={`Submit ${meta.label} document`}
    >
      <div className="flex flex-col gap-4">
        <p className="text-sm text-muted">{meta.description}</p>

        <label className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed border-border-subtle p-6 text-center hover:border-brand-gold">
          <input
            type="file"
            className="hidden"
            onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
          />
          <DynamicIcon name="Upload" className="size-6 text-muted" />
          <span className="text-sm font-semibold text-ink">{fileName ?? "Choose a document to upload"}</span>
          <span className="text-xs text-muted">PDF, JPG, or PNG</span>
        </label>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="gold" onClick={handleSubmit} disabled={!fileName || submitting} className="px-6">
            {submitting ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
