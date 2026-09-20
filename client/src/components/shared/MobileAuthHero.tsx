import Image from "next/image";
import { Logo } from "@/components/shared/Logo";
import { SiteNav } from "@/components/shared/SiteNav";

export function MobileAuthHero() {
  return (
    <div className="flex w-full flex-col items-center gap-3">
      <Logo className="h-[67px] w-[204px] dark:hidden" />
      <div className="hidden dark:block">
        <Image src="/brand/logo-wordmark-white.png" alt="Biltlinx" width={160} height={50} priority />
      </div>

      <SiteNav size="sm" tone="onLight" />
    </div>
  );
}
