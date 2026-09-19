"use client";

import Link from "next/link";
import { useState } from "react";
import { showSuccessToast } from "@/components/shared/AppToast";
import { AuthScreenLayout } from "@/components/shared/AuthScreenLayout";
import { HangTightCard } from "@/components/shared/HangTightCard";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { useHangTight } from "@/hooks/useHangTight";

export default function SignInPage() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const { pending, run } = useHangTight();

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    run(() => showSuccessToast("Sign in is coming soon"));
  }

  if (pending) {
    return (
      <AuthScreenLayout>
        <div className="flex justify-center">
          <HangTightCard
            heading="Signing you in!"
            body="We are verifying your details for you!"
            footer="You'll be allowed in soon..."
          />
        </div>
      </AuthScreenLayout>
    );
  }

  return (
    <AuthScreenLayout>
      <div className="flex flex-col items-center gap-3 text-center">
        <h1 className="text-[36px] font-bold leading-[40px] tracking-[-1.08px] text-black">
          Let&rsquo;s Get In
        </h1>
        <p className="text-sm leading-5 text-black">Continue with your phone number</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <Input
            id="phone-number"
            label="Phone Number"
            type="tel"
            placeholder="0208 000 000"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <PasswordInput
            id="password"
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="flex items-center justify-between">
            <Checkbox id="remember-me" label="Remember me" />
            <Link href="/auth/forgot-password" className="text-xs text-ink hover:underline">
              Forgot password?
            </Link>
          </div>
        </div>

        <Button type="submit" variant="primary">
          Sign in
        </Button>

        <p className="flex justify-center gap-2.5 text-sm">
          <span className="text-ink">Don&rsquo;t have an account ?</span>
          <Link href="/auth/sign-up" className="font-medium text-brand-900 underline underline-offset-2">
            Sign up
          </Link>
        </p>
      </form>
    </AuthScreenLayout>
  );
}
