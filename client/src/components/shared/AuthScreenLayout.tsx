import Image from "next/image";
import type { ReactNode } from "react";
import { AuthBrandPanel, type AuthBrandTagline } from "@/components/shared/AuthBrandPanel";
import { Logo } from "@/components/shared/Logo";
import { FadeIn } from "@/components/motion/FadeIn";

interface AuthScreenLayoutProps {
  children: ReactNode;
  tagline?: AuthBrandTagline;
}

export function AuthScreenLayout({ children, tagline }: AuthScreenLayoutProps) {
  return (
    <div className="flex h-screen items-center justify-center overflow-hidden bg-white dark:bg-night-900">
      <div className="grid h-full w-full max-w-[1440px] lg:grid-cols-2">
        <div className="flex min-h-0 flex-col items-center overflow-y-auto px-6 py-6 sm:px-16 lg:justify-center lg:px-[104px] lg:py-0">
          <div className="mb-6 lg:hidden">
            <Logo className="h-10 w-auto dark:hidden" />
            <Image
              src="/brand/hero-illustration.png"
              alt="Biltlinx"
              width={100}
              height={50}
              priority
              className="hidden dark:block"
            />
          </div>
          <FadeIn className="flex w-full max-w-[512px] flex-1 flex-col justify-center gap-8 lg:flex-none">
            {children}
          </FadeIn>
        </div>

        <div className="hidden p-4 lg:block">
          <AuthBrandPanel tagline={tagline} />
        </div>
      </div>
    </div>
  );
}
