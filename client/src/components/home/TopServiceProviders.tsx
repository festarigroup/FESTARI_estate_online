import { Avatar } from "@/components/ui/Avatar";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { SidebarWidgetHeader } from "@/components/home/SidebarWidgetHeader";
import { TOP_SERVICE_PROVIDERS } from "@/lib/mock-data";

/** "Top Service Providers" widget — avatar/icon, name, and star rating per provider. */
export function TopServiceProviders() {
  return (
    <div className="flex w-full shrink-0 flex-col gap-6 rounded-xl border border-border bg-white p-6">
      <SidebarWidgetHeader title="Top Service Providers" seeAllHref="/professionals" />
      <div className="flex w-full items-start justify-center gap-2">
        {TOP_SERVICE_PROVIDERS.map((provider) => (
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
