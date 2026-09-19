"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { AuthScreenLayout } from "@/components/shared/AuthScreenLayout";
import { HangTightCard } from "@/components/shared/HangTightCard";
import { IdentifierField, type IdentifierMethod } from "@/components/shared/IdentifierField";
import { Button } from "@/components/ui/Button";
import { useHangTight } from "@/hooks/useHangTight";

function ForgotPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedMethod = searchParams.get("method");
  const lockedMethod = requestedMethod === "email" || requestedMethod === "phone" ? requestedMethod : null;

  const [method, setMethod] = useState<IdentifierMethod>(lockedMethod ?? "email");
  const [identifier, setIdentifier] = useState("");
  const { pending, run } = useHangTight();

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    run(() => {
      const params = new URLSearchParams({ method, identifier });
      router.push(`/auth/forgot-password/verify?${params.toString()}`);
    });
  }

  if (pending) {
    return (
      <div className="flex justify-center">
        <HangTightCard
          heading="Sending reset link!"
          body={`We are sending instructions to your ${method === "email" ? "email" : "phone"}!`}
          footer="This won't take long..."
        />
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col items-center gap-3 text-center">
        <h1 className="text-[36px] font-bold leading-[40px] tracking-[-1.08px] text-black">
          Reset your password
        </h1>
        <p className="text-sm leading-5 text-black">
          Enter your {method === "email" ? "email address" : "phone number"} and we will send you
          password reset instructions
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <IdentifierField
          method={method}
          onMethodChange={setMethod}
          value={identifier}
          onChange={setIdentifier}
          showSwitcher={!lockedMethod}
        />

        <Button type="submit" variant="primary">
          Send reset link
        </Button>

        <div className="flex justify-center">
          <Button
            type="button"
            variant="link"
            onClick={() =>
              router.push(lockedMethod ? `/auth/sign-in?method=${lockedMethod}` : "/auth/sign-in")
            }
          >
            Back to login page
          </Button>
        </div>
      </form>
    </>
  );
}

export default function ForgotPasswordPage() {
  return (
    <AuthScreenLayout>
      <Suspense fallback={null}>
        <ForgotPasswordContent />
      </Suspense>
    </AuthScreenLayout>
  );
}
