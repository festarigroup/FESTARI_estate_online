"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { showErrorToast } from "@/components/shared/AppToast";
import { AuthScreenLayout } from "@/components/shared/AuthScreenLayout";
import { HangTightCard } from "@/components/shared/HangTightCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useHangTight } from "@/hooks/useHangTight";
import { ApiError } from "@/lib/api";
import { forgotPassword } from "@/lib/auth-api";
import { validateIdentifier } from "@/lib/validation";

function ForgotPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const method = searchParams.get("method") === "phone" ? "phone" : "email";

  const [identifier, setIdentifier] = useState("");
  const [error, setError] = useState<string>();
  const { pending, runAsync } = useHangTight();

  const otherMethod = method === "phone" ? "email" : "phone";

  function switchMethod() {
    setIdentifier("");
    setError(undefined);
    router.replace(`/auth/forgot-password?method=${otherMethod}`);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const identifierError = validateIdentifier(identifier, method);
    setError(identifierError);
    if (identifierError) return;

    try {
      await runAsync(() => forgotPassword({ [method]: identifier }));
      const params = new URLSearchParams({ identifier, method });
      router.push(`/auth/forgot-password/verify?${params.toString()}`);
    } catch (error) {
      showErrorToast(error instanceof ApiError ? error.message : "Unable to send reset code");
    }
  }

  if (pending) {
    return (
      <div className="flex justify-center">
        <HangTightCard
          heading="Sending your code!"
          body={`We are sending a reset code to your ${method === "phone" ? "phone" : "email"}!`}
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
          Enter your {method === "phone" ? "phone number" : "email address"} and we will send you a
          code to reset your password
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
            error={error}
          />
        ) : (
          <Input
            id="email"
            label="Email Address"
            type="email"
            placeholder="Useraccount@gmail.com"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            error={error}
          />
        )}

        <Button type="submit" variant="primary">
          Send code
        </Button>

        <div className="flex justify-center">
          <Button type="button" variant="link" onClick={() => router.push("/auth")}>
            Back to login page
          </Button>
        </div>

        <div className="flex justify-center">
          <button
            type="button"
            onClick={switchMethod}
            className="text-xs font-medium text-brand-900 hover:underline"
          >
            Use {otherMethod === "phone" ? "phone number" : "email address"} instead
          </button>
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
