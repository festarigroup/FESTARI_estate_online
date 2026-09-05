"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { ComingSoonPage } from "@/components/ComingSoonPage";
import { PropertyDetailsView } from "@/components/properties/PropertyDetailsView";
import { getProperty } from "@/lib/api/properties";
import { mapApiPropertyToListing } from "@/lib/adapters";
import type { Listing } from "@/types/listing";

/** A real property's public detail page — fetches by id and renders it
 * through PropertyDetailsView, the same component the My Listings wizard's
 * Preview step uses (see that component's own doc comment). Photo
 * lightbox/floor-plan/inquiry-form polish is still its own separate future
 * work (per the previous stub's own copy) — this just makes "View Details"
 * actually show the listing instead of a permanent "Coming Soon". */
export default function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getProperty(id)
      .then((property) => {
        if (!cancelled) setListing(mapApiPropertyToListing(property));
      })
      .catch(() => {
        // A 404 (unknown/deleted id) and any other fetch failure both land
        // on the same "not found" state — there's no separate "couldn't
        // load, try again" UI here yet, so there's nothing more specific
        // to tell the user in either case.
        if (!cancelled) setNotFound(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return <p className="py-20 text-center text-sm text-muted">Loading property...</p>;
  }

  if (notFound || !listing) {
    return (
      <ComingSoonPage
        icon="Building2"
        title="Property not found"
        description={`We couldn't find a property listing at #${id} — it may have been removed or the link is incorrect.`}
      />
    );
  }

  return (
    <div className="mx-auto flex max-w-[900px] flex-col gap-4 px-4 py-6 sm:px-6 lg:px-0">
      <Link href="/properties" className="flex items-center gap-1 text-sm font-semibold text-brand-navy hover:underline">
        ← Back to Properties
      </Link>
      <PropertyDetailsView listing={listing} />
    </div>
  );
}
