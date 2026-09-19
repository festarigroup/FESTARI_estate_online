"use client";

import toast from "react-hot-toast";
import { AuthBrandPanel } from "@/components/shared/AuthBrandPanel";
import { SocialAuthButton } from "@/components/shared/SocialAuthButton";
import { Button } from "@/components/ui/Button";
import { Divider } from "@/components/ui/Divider";
import { FadeIn } from "@/components/motion/FadeIn";

const PROVIDERS = [
  { id: "google", label: "Continue with Google", iconSrc: "/brand/google-icon.svg" },
  { id: "apple", label: "Continue with Apple", iconSrc: "/brand/apple-icon.svg" },
] as const;

const CONTACT_PROVIDERS = [
  { id: "email", label: "Continue with  Email", iconSrc: "/brand/mail-icon.svg" },
  { id: "phone", label: "Continue with Phone", iconSrc: "/brand/phone-icon.svg" },
] as const;

function handleStubAuth(provider: string) {
  toast(`${provider} sign-in is coming soon`, { icon: "🚧" });
}

export default function AuthPage() {
  return (
    <div className="flex h-screen items-center justify-center overflow-hidden bg-white p-4 lg:p-6">
      <div className="grid h-full w-full max-w-[1440px] gap-4 lg:grid-cols-2">
        <div className="flex min-h-0 flex-col items-center justify-center overflow-y-auto px-6 sm:px-16 lg:px-[104px]">
          <FadeIn className="flex w-full max-w-[512px] flex-col gap-8">
            <div className="flex flex-col items-center gap-3 text-center">
              <h1 className="text-[36px] font-bold leading-[40px] tracking-[-1.08px] text-black">
                Welcome!
              </h1>
              <p className="text-sm leading-5 text-black">get into your account</p>
            </div>

            <div className="flex flex-col gap-3">
              {PROVIDERS.map((provider) => (
                <SocialAuthButton
                  key={provider.id}
                  label={provider.label}
                  iconSrc={provider.iconSrc}
                  iconAlt={provider.id}
                  onClick={() => handleStubAuth(provider.label)}
                />
              ))}

              <Divider label="or" />

              {CONTACT_PROVIDERS.map((provider) => (
                <SocialAuthButton
                  key={provider.id}
                  label={provider.label}
                  iconSrc={provider.iconSrc}
                  iconAlt={provider.id}
                  onClick={() => handleStubAuth(provider.label)}
                />
              ))}

              <Divider />

              <p className="flex justify-center gap-2.5 text-sm">
                <span className="text-ink">Don&rsquo;t have an account ?</span>
                <Button
                  type="button"
                  variant="link"
                  onClick={() => handleStubAuth("Sign up")}
                >
                  Sign up
                </Button>
              </p>
            </div>
          </FadeIn>
        </div>

        <div className="p-2">
          <AuthBrandPanel />
        </div>
      </div>
    </div>
  );
}
