import Image from "next/image";
import { SiteNav } from "@/components/shared/SiteNav";

export function MobileAuthHero() {
  return (
    <div className="flex aspect-[374/287] w-full flex-col items-center justify-between overflow-hidden rounded-[38px] bg-gradient-to-r from-brand-gradient-from to-brand-gradient-to px-6 py-6 lg:hidden">
      <div className="relative h-[50px] w-full flex-1">
        <Image
          src="/brand/logo-wordmark-white.png"
          alt="Biltlinx"
          fill
          className="object-contain object-bottom"
          priority
        />
      </div>
      <SiteNav size="sm" />
    </div>
  );
}
