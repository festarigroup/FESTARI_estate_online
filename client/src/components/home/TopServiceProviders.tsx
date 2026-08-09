"use client";

import { useEffect, useState } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { SidebarWidgetHeader } from "@/components/home/SidebarWidgetHeader";
import { getTop } from "@/lib/api/artisans";
import { mapServiceProvider } from "@/lib/adapters";
import { TOP_SERVICE_PROVIDERS } from "@/lib/mock-data";
import type { ServiceProvider } from "@/types/home";

/** "Top Service Providers" widget — avatar/icon, name, and star rating per provider. */
export function TopServiceProviders() {
  const [providers, setProviders] = useState<ServiceProvider[]>([]);

  useEffect(() => {
    // Falls back to mock providers when the API is unreachable or empty
    // (e.g. no backend hosted yet) so this widget isn't the only one that
    // silently disappears from the sidebar rail.
    getTop()
      .then((items) => setProviders(items.length > 0 ? items.map(mapServiceProvider) : TOP_SERVICE_PROVIDERS))
      .catch(() => setProviders(TOP_SERVICE_PROVIDERS));
  }, []);

  if (providers.length === 0) return null;

  return (
    <div className="flex w-full shrink-0 flex-col gap-6 rounded-xl border border-border bg-white p-6">
      <SidebarWidgetHeader title="Top Service Providers" seeAllHref="/professionals" />
      <div className="flex w-full items-start justify-center gap-2">
        {providers.map((provider) => (
          <div key={provider.id} className="flex flex-1 flex-col items-center gap-2">
            <Avatar src={provider.avatar} icon={provider.icon} alt={provider.name} size={48} />
            <span className="text-center text-[9px] font-semibold text-ink">{provider.name}</span>
            <span className="flex items-center gap-0.5">
              <span className="text-[9px] text-brand-gold">{provider.rating}</span>
              <DynamicIcon name="Star" className="size-2 text-brand-gold" fill="currentColor" />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
