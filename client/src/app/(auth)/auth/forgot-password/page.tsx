"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthScreenLayout } from "@/components/shared/AuthScreenLayout";
import { IdentifierField } from "@/components/shared/IdentifierField";
import { Button } from "@/components/ui/Button";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    router.push("/auth/forgot-password/verify");
  }

  return (
    <AuthScreenLayout>
      <div className="flex flex-col items-center gap-3 text-center">
        <h1 className="text-[36px] font-bold leading-[40px] tracking-[-1.08px] text-black">
          Reset your password
        </h1>
        <p className="text-sm leading-5 text-black">
          Enter your email address and we will send you password reset instructions
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <IdentifierField value={identifier} onChange={setIdentifier} />

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
