import type { ReactNode } from "react";
import { AuthBrandPanel } from "@/components/shared/AuthBrandPanel";
import { FadeIn } from "@/components/motion/FadeIn";

interface AuthScreenLayoutProps {
  children: ReactNode;
}

export function AuthScreenLayout({ children }: AuthScreenLayoutProps) {
  return (
    <div className="flex h-screen items-center justify-center overflow-hidden bg-white">
      <div className="grid h-full w-full max-w-[1440px] lg:grid-cols-2">
        <div className="flex min-h-0 flex-col items-center justify-center overflow-y-auto px-6 sm:px-16 lg:px-[104px]">
          <FadeIn className="flex w-full max-w-[512px] flex-col gap-8">{children}</FadeIn>
        </div>

        <div className="p-4">
          <AuthBrandPanel />
        </div>
      </div>
    </div>
  );
}
