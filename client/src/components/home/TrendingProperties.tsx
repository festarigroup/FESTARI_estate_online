"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { SidebarWidgetHeader } from "@/components/home/SidebarWidgetHeader";
import { getTrending } from "@/lib/api/properties";
import { mapTrendingProperty } from "@/lib/adapters";
import { TRENDING_PROPERTIES } from "@/lib/mock-data";
import type { TrendingProperty } from "@/types/home";

/** "Trending Properties" widget — thumbnail + price + stats for each listing. */
export function TrendingProperties() {
  const [properties, setProperties] = useState<TrendingProperty[]>([]);

  useEffect(() => {
    // Falls back to mock listings when the API is unreachable or empty
    // (e.g. no backend hosted yet) so this widget isn't the only one that
    // silently disappears from the sidebar rail.
    getTrending()
      .then((items) => setProperties(items.length > 0 ? items.map(mapTrendingProperty) : TRENDING_PROPERTIES))
      .catch(() => setProperties(TRENDING_PROPERTIES));
  }, []);

  if (properties.length === 0) return null;

  return (
    <div className="flex w-full shrink-0 flex-col gap-6 rounded-xl border border-border bg-white p-6">
      <SidebarWidgetHeader title="Trending Properties" seeAllHref="/properties" />
      <div className="flex w-full flex-col gap-4">
        {properties.map((property) => (
          <Link
            key={property.id}
            href={`/properties/${property.id}`}
            className="flex w-full items-start gap-4"
          >
            <div className="relative size-24 shrink-0 overflow-hidden rounded-lg">
              <Image src={property.image} alt={property.title} fill className="object-cover" />
              <Badge
                variant={property.listingType === "For Sale" ? "listing-sale" : "listing-rent"}
                className="absolute top-1 left-1"
              >
                {property.listingType}
              </Badge>
            </div>
            <div className="flex flex-col justify-center gap-1">
              <h4 className="text-sm font-semibold text-ink">{property.title}</h4>
              <p className="text-[10px] text-muted">{property.location}</p>
              <p className="text-sm font-semibold text-brand-navy">{property.price}</p>
              <div className="flex items-center gap-3 text-[10px] text-muted">
                <span className="flex items-center gap-1">
                  <DynamicIcon name="BedDouble" className="size-2.5" />
                  {property.beds}
                </span>
                <span className="flex items-center gap-1">
                  <DynamicIcon name="Bath" className="size-2.5" />
                  {property.baths}
                </span>
                <span className="flex items-center gap-1">
                  <DynamicIcon name="Ruler" className="size-2.5" />
                  {property.areaSqm} sqm
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
