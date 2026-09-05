import { FIELD_CLASS, FieldLabel } from "@/components/listings/wizard/WizardShell";
import { cn } from "@/lib/cn";
import { VIEWING_MODES, type Listing, type ViewingContact } from "@/types/listing";

interface StepProps {
  draft: Listing;
  onChange: (patch: Partial<Listing>) => void;
}

const CONTACT_METHODS: { id: ViewingContact["preferredContactMethod"]; label: string }[] = [
  { id: "phone", label: "Phone" },
  { id: "email", label: "Email" },
  { id: "whatsapp", label: "WhatsApp" },
];

/** Step 9 — Viewing & Contact preferences: how (and by whom) an enquiry
 * gets handled once this listing is live. Feeds PropertyDetailsView's own
 * "Enquire / Request Viewing" block directly. */
export function StepViewingContact({ draft, onChange }: StepProps) {
  const contact: ViewingContact = draft.viewingContact ?? {
    contactName: "",
    contactPhone: "",
    contactEmail: "",
    viewingMode: "by_appointment",
    preferredContactMethod: "phone",
  };

  function updateContact(patch: Partial<ViewingContact>) {
    onChange({ viewingContact: { ...contact, ...patch } });
  }

  return (
    <div className="flex flex-col gap-4">
      <label className="flex flex-col gap-1.5">
        <FieldLabel>Contact name</FieldLabel>
        <input value={contact.contactName} onChange={(e) => updateContact({ contactName: e.target.value })} className={FIELD_CLASS} />
      </label>
      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col gap-1.5">
          <FieldLabel>Phone</FieldLabel>
          <input
            value={contact.contactPhone}
            onChange={(e) => updateContact({ contactPhone: e.target.value })}
            placeholder="+233 20 000 0000"
            className={FIELD_CLASS}
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <FieldLabel>Email</FieldLabel>
          <input
            type="email"
            value={contact.contactEmail}
            onChange={(e) => updateContact({ contactEmail: e.target.value })}
            className={FIELD_CLASS}
          />
        </label>
      </div>

      <div className="flex flex-col gap-1.5">
        <FieldLabel>Viewing mode</FieldLabel>
        <div className="grid grid-cols-3 gap-2">
          {VIEWING_MODES.map((mode) => (
            <button
              key={mode.id}
              type="button"
              onClick={() => updateContact({ viewingMode: mode.id })}
              className={cn(
                "rounded-lg border px-3 py-2 text-xs font-semibold",
                contact.viewingMode === mode.id
                  ? "border-brand-navy bg-brand-navy text-white"
                  : "border-border-subtle text-ink hover:bg-surface-muted",
              )}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <FieldLabel>Preferred contact method</FieldLabel>
        <div className="grid grid-cols-3 gap-2">
          {CONTACT_METHODS.map((method) => (
            <button
              key={method.id}
              type="button"
              onClick={() => updateContact({ preferredContactMethod: method.id })}
              className={cn(
                "rounded-lg border px-3 py-2 text-xs font-semibold",
                contact.preferredContactMethod === method.id
                  ? "border-brand-navy bg-brand-navy text-white"
                  : "border-border-subtle text-ink hover:bg-surface-muted",
              )}
            >
              {method.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
