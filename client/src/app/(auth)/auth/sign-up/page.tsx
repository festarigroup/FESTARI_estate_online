"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import toast from "react-hot-toast";
import { AuthScreenLayout } from "@/components/shared/AuthScreenLayout";
import { HangTightCard } from "@/components/shared/HangTightCard";
import { IdentifierField, type IdentifierMethod } from "@/components/shared/IdentifierField";
import { Button } from "@/components/ui/Button";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { useHangTight } from "@/hooks/useHangTight";

function SignUpContent() {
  const searchParams = useSearchParams();
  const requestedMethod = searchParams.get("method");
  const lockedMethod = requestedMethod === "email" || requestedMethod === "phone" ? requestedMethod : null;

  const [method, setMethod] = useState<IdentifierMethod>(lockedMethod ?? "email");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const { pending, run } = useHangTight();

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    run(() => toast("Sign up is coming soon", { icon: "🚧" }));
  }

  if (pending) {
    return (
      <div className="flex justify-center">
        <HangTightCard
          heading="Creating your account!"
          body="We are setting things up for you!"
          footer="This won't take long..."
        />
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col items-center gap-3 text-center">
        <h1 className="text-[36px] font-bold leading-[40px] tracking-[-1.08px] text-black">
          Create an account
        </h1>
        <p className="text-sm leading-5 text-black">
          Continue with your {method === "email" ? "email address" : "phone number"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <IdentifierField
            method={method}
            onMethodChange={setMethod}
            value={identifier}
            onChange={setIdentifier}
            showSwitcher={!lockedMethod}
          />
          <PasswordInput
            id="password"
            label="Password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <Button type="submit" variant="primary">
          Sign up
        </Button>

        <p className="flex justify-center gap-2.5 text-sm">
          <span className="text-ink">Already have an account ?</span>
          <Link
            href={lockedMethod ? `/auth/sign-in?method=${lockedMethod}` : "/auth/sign-in"}
            className="font-medium text-brand-900 underline underline-offset-2"
          >
            Sign in
          </Link>
        </p>
      </form>
    </>
  );
}

export default function SignUpPage() {
  return (
    <AuthScreenLayout>
      <Suspense fallback={null}>
        <SignUpContent />
      </Suspense>
    </AuthScreenLayout>
  );
}
