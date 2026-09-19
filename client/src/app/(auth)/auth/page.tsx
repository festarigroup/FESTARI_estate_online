"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { showSuccessToast } from "@/components/shared/AppToast";
import { AuthScreenLayout } from "@/components/shared/AuthScreenLayout";
import { SocialAuthButton } from "@/components/shared/SocialAuthButton";
import { Divider } from "@/components/ui/Divider";

const PROVIDERS = [
  { id: "google", label: "Continue with Google", iconSrc: "/brand/google-icon.svg" },
  { id: "apple", label: "Continue with Apple", iconSrc: "/brand/apple-icon.svg" },
] as const;

const CONTACT_PROVIDERS = [
  { id: "email", label: "Continue with  Email", iconSrc: "/brand/mail-icon.svg", method: "email" },
  { id: "phone", label: "Continue with Phone", iconSrc: "/brand/phone-icon.svg", method: "phone" },
] as const;

function handleStubAuth(provider: string) {
  showSuccessToast(`${provider} sign-in is coming soon`);
}

export default function AuthPage() {
  const router = useRouter();

  return (
    <AuthScreenLayout>
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
            onClick={() => router.push(`/auth/sign-in?method=${provider.method}`)}
          />
        ))}

        <Divider />

        <p className="flex justify-center gap-2.5 text-sm">
          <span className="text-ink">Don&rsquo;t have an account ?</span>
          <Link
            href="/auth/sign-up"
            className="font-medium text-brand-900 underline underline-offset-2"
          >
            Sign up
          </Link>
        </p>
      </div>
    </AuthScreenLayout>
  );
}
