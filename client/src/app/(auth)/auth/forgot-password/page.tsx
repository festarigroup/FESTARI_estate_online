"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { AuthScreenLayout } from "@/components/shared/AuthScreenLayout";
import { HangTightCard } from "@/components/shared/HangTightCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useHangTight } from "@/hooks/useHangTight";

function ForgotPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const method = searchParams.get("method") === "phone" ? "phone" : "email";

  const [identifier, setIdentifier] = useState("");
  const { pending, run } = useHangTight();

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    run(() => {
      const params = new URLSearchParams({ identifier, method });
      router.push(`/auth/forgot-password/verify?${params.toString()}`);
    });
  }

  if (pending) {
    return (
      <div className="flex justify-center">
        <HangTightCard
          heading="Sending reset link!"
          body={`We are sending instructions to your ${method === "phone" ? "phone" : "email"}!`}
          footer="This won't take long..."
        />
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col items-center gap-3 text-center">
        <h1 className="text-[36px] font-bold leading-[40px] tracking-[-1.08px] text-black dark:text-white">
          Reset your password
        </h1>
        <p className="text-sm leading-5 text-black dark:text-white">
          Enter your {method === "phone" ? "phone number" : "email address"} and we will send you
          password reset instructions
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {method === "phone" ? (
          <Input
            id="phone-number"
            label="Phone Number"
            type="tel"
            placeholder="0208 000 000"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />
        ) : (
          <Input
            id="email"
            label="Email Address"
            type="email"
            placeholder="Useraccount@gmail.com"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />
        )}

        <Button type="submit" variant="primary">
          Send reset link
        </Button>

        <div className="flex justify-center">
          <Button type="button" variant="link" onClick={() => router.push("/auth")}>
            Back to login page
          </Button>
        </div>
      </form>
    </>
  );
}

export default function ForgotPasswordPage() {
  const tagline = { highlight: "Securing", rest: "the Built Environment" };

  return (
    <AuthScreenLayout tagline={tagline}>
      <Suspense fallback={null}>
        <ForgotPasswordContent />
      </Suspense>
    </AuthScreenLayout>
  );
}
