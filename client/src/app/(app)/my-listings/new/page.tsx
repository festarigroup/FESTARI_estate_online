"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { WizardShell, WIZARD_STEP_COUNT } from "@/components/listings/wizard/WizardShell";
import { StepPurpose } from "@/components/listings/wizard/steps/StepPurpose";
import { StepIdentity } from "@/components/listings/wizard/steps/StepIdentity";
import { StepLocation } from "@/components/listings/wizard/steps/StepLocation";
import { StepDetails } from "@/components/listings/wizard/steps/StepDetails";
import { StepPricing } from "@/components/listings/wizard/steps/StepPricing";
import { StepFeatures } from "@/components/listings/wizard/steps/StepFeatures";
import { StepDescription } from "@/components/listings/wizard/steps/StepDescription";
import { StepMedia } from "@/components/listings/wizard/steps/StepMedia";
import { StepViewingContact } from "@/components/listings/wizard/steps/StepViewingContact";
import { StepAuthority } from "@/components/listings/wizard/steps/StepAuthority";
import { StepPreview } from "@/components/listings/wizard/steps/StepPreview";
import { createListing, findDuplicateListing, getListing, submitListing, updateListing } from "@/lib/mocks/listings";
import type { Listing } from "@/types/listing";

function clampStep(value: number): number {
  return Math.min(WIZARD_STEP_COUNT, Math.max(1, value));
}

/** Minimal per-step "can I move on" gates — not the same thing as the
 * Preview step's completion checklist (which is about publish-readiness,
 * runs only on step 11, and never blocks navigation, only submission). */
function isStepValid(step: number, draft: Listing): boolean {
  switch (step) {
    case 1:
      return draft.purpose !== null && draft.category !== null;
    case 2:
      return draft.title.trim().length > 0 && draft.propertyType.trim().length > 0;
    case 3:
      return draft.location.address.trim().length > 0 && draft.location.city.trim().length > 0;
    case 5:
      return !!draft.pricing && draft.pricing.amount > 0;
    case 9:
      return !!draft.viewingContact && draft.viewingContact.contactName.trim().length > 0 && draft.viewingContact.contactPhone.trim().length > 0;
    default:
      return true;
  }
}

function WizardStep({ step, draft, onChange, duplicate }: { step: number; draft: Listing; onChange: (patch: Partial<Listing>) => void; duplicate: Listing | null }) {
  switch (step) {
    case 1:
      return <StepPurpose draft={draft} onChange={onChange} />;
    case 2:
      return <StepIdentity draft={draft} onChange={onChange} />;
    case 3:
      return <StepLocation draft={draft} onChange={onChange} duplicate={duplicate} />;
    case 4:
      return <StepDetails draft={draft} onChange={onChange} />;
    case 5:
      return <StepPricing draft={draft} onChange={onChange} />;
    case 6:
      return <StepFeatures draft={draft} onChange={onChange} />;
    case 7:
      return <StepDescription draft={draft} onChange={onChange} />;
    case 8:
      return <StepMedia draft={draft} onChange={onChange} />;
    case 9:
      return <StepViewingContact draft={draft} onChange={onChange} />;
    case 10:
      return <StepAuthority />;
    default:
      return <StepPreview draft={draft} duplicate={duplicate} />;
  }
}

/** The 11-step Create/Edit Property Listing wizard. Step lives in the URL
 * (`?step=`), so Back/Forward and a refresh both land on the right step;
 * `?id=` resumes an existing draft (e.g. "Continue editing" from My
 * Listings) — omitted on first entry, at which point this creates a fresh
 * draft immediately via createListing() and writes its id into the URL, so
 * the draft already exists (and shows up on My Listings as "Draft") from
 * the very first step, not just once the wizard is fully completed. */
function ListingWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const step = clampStep(Number(searchParams.get("step")) || 1);
  const listingId = searchParams.get("id");

  const [draft, setDraft] = useState<Listing | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [saving, setSaving] = useState(false);
  // Caches the in-flight createListing() call across React 19 Strict
  // Mode's dev-only mount -> cleanup -> mount cycle. A plain `cancelled`
  // flag alone isn't enough here: it stops the FIRST invocation's own
  // setState from landing, but by the time that guard matters the
  // underlying POST-like side effect has already run — so without this,
  // the remount's second invocation would call createListing() again and
  // orphan an extra draft. Stashing the promise itself (not just a "did
  // this run" boolean) means both invocations await the exact same
  // creation instead of the second one starting a new one — the boolean
  // form of this guard fixes the double-create but then neither
  // invocation is left to actually resolve the state, since the first
  // one's own result gets thrown away by its own (already-true) cancelled
  // flag.
  const creationRef = useRef<Promise<Listing> | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      if (listingId) {
        const existing = await getListing(listingId);
        if (!cancelled) {
          setDraft(existing);
          setInitializing(false);
        }
        return;
      }
      if (!creationRef.current) {
        creationRef.current = createListing();
      }
      const created = await creationRef.current;
      if (cancelled) return;
      setDraft(created);
      setInitializing(false);
      router.replace(`/my-listings/new?id=${created.id}&step=1`);
    }

    init();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only re-run when the id in the URL itself changes
  }, [listingId]);

  const duplicate = useMemo(() => {
    if (!draft) return null;
    return (
      findDuplicateListing({
        address: draft.location.address,
        city: draft.location.city,
        category: draft.category,
        excludeId: draft.id,
      }) ?? null
    );
  }, [draft]);

  function handleChange(patch: Partial<Listing>) {
    setDraft((prev) => (prev ? { ...prev, ...patch } : prev));
  }

  function goToStep(next: number) {
    router.replace(`/my-listings/new?id=${listingId}&step=${next}`);
  }

  async function handleNext() {
    if (!draft) return;
    setSaving(true);
    try {
      const saved = await updateListing(draft.id, draft);
      setDraft(saved);
      if (step < WIZARD_STEP_COUNT) {
        goToStep(step + 1);
        return;
      }
      // Final step — submit for review rather than publish directly: per
      // spec, Authority & Verification is stubbed with no real check to
      // gate on, so a listing goes Draft -> Pending Review here, and an
      // owner can then Publish it themselves from My Listings (standing in
      // for what a real review process would otherwise trigger).
      const submitted = await submitListing(draft.id);
      setDraft(submitted);
      toast.success("Submitted for review.");
      router.push("/my-listings?status=pending_review");
    } catch {
      toast.error("Couldn't save this step. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  function handleBack() {
    if (step > 1) goToStep(step - 1);
  }

  if (initializing || !draft) {
    return <p className="py-20 text-center text-sm text-muted">Loading...</p>;
  }

  return (
    <WizardShell
      step={step}
      onBack={handleBack}
      onNext={handleNext}
      nextLabel={step === WIZARD_STEP_COUNT ? "Submit for Review" : "Next"}
      nextDisabled={!isStepValid(step, draft)}
      busy={saving}
    >
      <WizardStep step={step} draft={draft} onChange={handleChange} duplicate={duplicate} />
    </WizardShell>
  );
}

export default function NewListingPage() {
  return (
    <Suspense fallback={<p className="py-20 text-center text-sm text-muted">Loading...</p>}>
      <ListingWizard />
    </Suspense>
  );
}
