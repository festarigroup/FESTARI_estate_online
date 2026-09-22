import type { ReactNode } from "react";
import { AuthBrandPanel, type AuthBrandTagline } from "@/components/shared/AuthBrandPanel";
import { MobileAuthHero } from "@/components/shared/MobileAuthHero";
import { FadeIn } from "@/components/motion/FadeIn";

interface AuthScreenLayoutProps {
  children: ReactNode;
  tagline?: AuthBrandTagline;
  footerText?: string;
}

export function AuthScreenLayout({ children, tagline, footerText }: AuthScreenLayoutProps) {
  return (
    <div className="relative flex h-screen items-center justify-center overflow-hidden bg-white dark:bg-night-900">
      <div className="pointer-events-none absolute inset-2 rounded-[38px] border-2 border-[#e2e8f0] dark:border-night-700 lg:hidden" />
      <div className="grid h-full w-full max-w-[1440px] lg:grid-cols-2 4xl:max-w-[1720px] 5xl:max-w-[2200px]">
        <div className="flex min-h-0 flex-col items-center overflow-y-auto px-6 py-6 sm:px-16 lg:justify-center lg:px-[104px] lg:py-0">
          <div className="mb-6 w-full lg:hidden">
            <MobileAuthHero />
          </div>
          <FadeIn className="flex w-full max-w-[512px] flex-1 flex-col justify-center gap-8 lg:flex-none">
            {children}
          </FadeIn>
        </div>

        <div className="hidden p-4 lg:block">
          <AuthBrandPanel tagline={tagline} footerText={footerText} />
        </div>
      </div>
    </div>
  );
}
