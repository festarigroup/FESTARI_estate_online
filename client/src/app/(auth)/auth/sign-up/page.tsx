"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { showSuccessToast } from "@/components/shared/AppToast";
import { AuthScreenLayout } from "@/components/shared/AuthScreenLayout";
import { HangTightCard } from "@/components/shared/HangTightCard";
import { SocialAuthButton } from "@/components/shared/SocialAuthButton";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Divider } from "@/components/ui/Divider";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { useHangTight } from "@/hooks/useHangTight";

const PROVIDERS = [
  { id: "google", label: "Sign Up with Google", iconSrc: "/brand/google-icon.svg", invertOnDark: false },
  { id: "apple", label: "Sign Up with Apple", iconSrc: "/brand/apple-icon.svg", invertOnDark: true },
] as const;

const STEP_ONE_TAGLINE = { highlight: "One account .", rest: "Every part of the built environment ." };
const STEP_ONE_FOOTER =
  "you start as a Seeker. Add landlord, Professional, Artisan, Developer or Business capabilities anytime from your profile.";
const STEP_TWO_TAGLINE = { highlight: "Join", rest: "the Built Environment" };

function handleStubAuth(provider: string) {
  showSuccessToast(`${provider} sign-up is coming soon`);
}

export default function SignUpPage() {
  const router = useRouter();
  const [step, setStep] = useState<"profile" | "security">("profile");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isAdult, setIsAdult] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const { pending, run } = useHangTight();

  function handleContinue(event: React.FormEvent) {
    event.preventDefault();
    setStep("security");
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    run(() => showSuccessToast("Sign up is coming soon"));
  }

  if (pending) {
    return (
      <AuthScreenLayout tagline={STEP_TWO_TAGLINE}>
        <div className="flex justify-center">
          <HangTightCard
            heading="Creating your account!"
            body="We are setting things up for you!"
            footer="This won't take long..."
          />
        </div>
      </AuthScreenLayout>
    );
  }

  if (step === "profile") {
    return (
      <AuthScreenLayout tagline={STEP_ONE_TAGLINE} footerText={STEP_ONE_FOOTER}>
        <div className="flex flex-col items-center gap-3 text-center">
          <h1 className="text-[36px] font-bold leading-[40px] tracking-[-1.08px] text-black dark:text-white">
            Create your account
          </h1>
          <p className="text-sm leading-5 text-black dark:text-white">
            Takes under a minute. No role commitment requirement.
          </p>
        </div>

        <form onSubmit={handleContinue} className="flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            {PROVIDERS.map((provider) => (
              <SocialAuthButton
                key={provider.id}
                label={provider.label}
                iconSrc={provider.iconSrc}
                iconAlt={provider.id}
                invertOnDark={provider.invertOnDark}
                onClick={() => handleStubAuth(provider.label)}
              />
            ))}
          </div>

          <Divider label="or" />

          <div className="flex flex-col gap-3">
            <Input
              id="full-name"
              label="Full Name"
              placeholder="Username"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <Input
              id="email"
              label="Email Address"
              type="email"
              placeholder="Useraccount@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="flex gap-2.5">
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={() => router.push("/auth")}
            >
              Back
            </Button>
            <Button type="submit" variant="primary" className="flex-1">
              Continue
            </Button>
          </div>

          <p className="flex justify-center gap-2.5 text-sm">
            <span className="text-ink dark:text-white">Already have an account ?</span>
            <Link href="/auth" className="font-medium text-brand-900 underline underline-offset-2">
              Sign In
            </Link>
          </p>
        </form>
      </AuthScreenLayout>
    );
  }

  return (
    <AuthScreenLayout tagline={STEP_TWO_TAGLINE}>
      <div className="flex flex-col items-center gap-3 text-center">
        <h1 className="text-[36px] font-bold leading-[40px] tracking-[-1.08px] text-black dark:text-white">
          Secure your account
        </h1>
        <p className="text-sm leading-5 text-black dark:text-white">
          Add a phone number and password to finish up.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          {PROVIDERS.map((provider) => (
            <SocialAuthButton
              key={provider.id}
              label={provider.label}
              iconSrc={provider.iconSrc}
              iconAlt={provider.id}
              invertOnDark={provider.invertOnDark}
              onClick={() => handleStubAuth(provider.label)}
            />
          ))}
        </div>

        <Divider label="or" />

        <div className="flex flex-col gap-3">
          <Input
            id="phone-number"
            label="Phone Number"
            type="tel"
            placeholder="0208 000 000"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <div className="flex flex-col gap-1">
            <PasswordInput
              id="password"
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <p className="text-xs text-muted-400 dark:text-muted-300">
              Use 8 or more characters with a mix of letters and numbers
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Checkbox
            id="confirm-adult"
            label="I confirm I am 18 years or older"
            checked={isAdult}
            onChange={(e) => setIsAdult(e.target.checked)}
          />
          <Checkbox
            id="agree-terms"
            label={
              <>
                I agree to the <span className="underline">Terms of Service</span> and{" "}
                <span className="underline">Privacy Policy</span>
              </>
            }
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
          />
        </div>

        <div className="flex gap-2.5">
          <Button
            type="button"
            variant="primary"
            className="flex-1"
            onClick={() => setStep("profile")}
          >
            Back
          </Button>
          <Button type="submit" variant="primary" className="flex-1">
            Create an Account
          </Button>
        </div>

        <p className="flex justify-center gap-2.5 text-sm">
          <span className="text-ink dark:text-white">Already have an account ?</span>
          <Link href="/auth" className="font-medium text-brand-900 underline underline-offset-2">
            Sign In
          </Link>
        </p>
      </form>
    </AuthScreenLayout>
  );
}
