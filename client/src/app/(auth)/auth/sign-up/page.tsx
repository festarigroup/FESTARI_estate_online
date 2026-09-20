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

export default function SignUpPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdult, setIsAdult] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const { pending, run } = useHangTight();

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    run(() => showSuccessToast("Sign up is coming soon"));
  }

  const tagline = { highlight: "Join", rest: "the Built Environment" };

  if (pending) {
    return (
      <AuthScreenLayout tagline={tagline}>
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

  return (
    <AuthScreenLayout tagline={tagline}>
      <div className="flex flex-col items-center gap-3 text-center">
        <h1 className="text-[36px] font-bold leading-[40px] tracking-[-1.08px] text-black">
          Create your account
        </h1>
        <p className="text-sm leading-5 text-black">
          Takes under a minute. No role commitment requirement.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
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
          <div className="flex flex-col gap-1">
            <PasswordInput
              id="password"
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <p className="text-xs text-muted-400">
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

        <Button type="submit" variant="primary">
          Create an Account
        </Button>

        <p className="flex justify-center gap-2.5 text-sm">
          <span className="text-ink">Already have an account ?</span>
          <Link href="/auth" className="font-medium text-brand-900 underline underline-offset-2">
            Sign In
          </Link>
        </p>
      </form>
    </AuthScreenLayout>
  );
}
