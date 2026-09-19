"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthScreenLayout } from "@/components/shared/AuthScreenLayout";
import { HangTightCard } from "@/components/shared/HangTightCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useHangTight } from "@/hooks/useHangTight";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const { pending, run } = useHangTight();

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    run(() => {
      const params = new URLSearchParams({ identifier: email });
      router.push(`/auth/forgot-password/verify?${params.toString()}`);
    });
  }

  const tagline = { highlight: "Securing", rest: "the Built Environment" };

  if (pending) {
    return (
      <AuthScreenLayout tagline={tagline}>
        <div className="flex justify-center">
          <HangTightCard
            heading="Sending reset link!"
            body="We are sending instructions to your email!"
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
          Reset your password
        </h1>
        <p className="text-sm leading-5 text-black">
          Enter your email address and we will send you password reset instructions
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <Input
          id="email"
          label="Email Address"
          type="email"
          placeholder="Useraccount@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Button type="submit" variant="primary">
          Send reset link
        </Button>

        <div className="flex justify-center">
          <Button type="button" variant="link" onClick={() => router.push("/auth/sign-in")}>
            Back to login page
          </Button>
        </div>
      </form>
    </AuthScreenLayout>
  );
}
