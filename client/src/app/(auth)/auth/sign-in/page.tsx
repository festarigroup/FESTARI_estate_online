"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import toast from "react-hot-toast";
import { AuthScreenLayout } from "@/components/shared/AuthScreenLayout";
import { IdentifierField, type IdentifierMethod } from "@/components/shared/IdentifierField";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { PasswordInput } from "@/components/ui/PasswordInput";

function SignInContent() {
  const searchParams = useSearchParams();
  const requestedMethod = searchParams.get("method");
  const lockedMethod = requestedMethod === "email" || requestedMethod === "phone" ? requestedMethod : null;

  const [method, setMethod] = useState<IdentifierMethod>(lockedMethod ?? "email");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    toast("Sign in is coming soon", { icon: "🚧" });
  }

  return (
    <>
      <div className="flex flex-col items-center gap-3 text-center">
        <h1 className="text-[36px] font-bold leading-[40px] tracking-[-1.08px] text-black">
          Let&rsquo;s Get In
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
          <Button
            type="button"
            variant="link"
            onClick={() => toast("Sign up is coming soon", { icon: "🚧" })}
          >
            Sign up
          </Button>
        </p>
      </form>
    </>
  );
}

export default function SignInPage() {
  return (
    <AuthScreenLayout>
      <Suspense fallback={null}>
        <SignInContent />
      </Suspense>
    </AuthScreenLayout>
  );
}
