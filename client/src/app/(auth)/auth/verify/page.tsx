"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { showSuccessToast } from "@/components/shared/AppToast";
import { AuthScreenLayout } from "@/components/shared/AuthScreenLayout";
import { HangTightCard } from "@/components/shared/HangTightCard";
import { OtpInput } from "@/components/shared/OtpInput";
import { Button } from "@/components/ui/Button";
import { useHangTight } from "@/hooks/useHangTight";

function VerifyContent() {
  const searchParams = useSearchParams();
  const identifier = searchParams.get("identifier") || "Useraccount@gmail.com";
  const channel = searchParams.get("channel") === "phone" ? "phone" : "email";
  const isSignup = searchParams.get("context") === "signup";

  const [otp, setOtp] = useState<string[]>(["", "", "", ""]);
  const { pending, run } = useHangTight();

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    run(() =>
      showSuccessToast(
        isSignup ? "Account created! Welcome to Biltlinx" : "You're verified! Full sign-in is coming soon",
      ),
    );
  }

  if (pending) {
    return (
      <div className="flex justify-center">
        <HangTightCard />
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col items-center gap-3 text-center">
        <h1 className="text-[36px] font-bold leading-[40px] tracking-[-1.08px] text-black dark:text-white">
          Enter OTP
        </h1>
        <p className="text-lg leading-7 text-[#111826] dark:text-white">
          We have shared a code to your registered {channel === "phone" ? "phone number" : "email"}
          {" "}
          <span className="font-semibold tracking-[-0.54px]">{identifier}.</span>{" "}
          {channel === "phone" ? "Check your messages" : "Check your inbox"} to verify your account
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        <OtpInput value={otp} onChange={setOtp} />

        <Button type="submit" variant="primary">
          Verify
        </Button>

        <p className="text-center text-base text-helper">
          Didn&rsquo;t receive code?{" "}
          <button
            type="button"
            className="font-semibold text-brand-900"
            onClick={() => showSuccessToast("OTP resent")}
          >
            Resend OTP
          </button>
        </p>
      </form>
    </>
  );
}

export default function VerifyPage() {
  return (
    <AuthScreenLayout tagline={{ highlight: "Confirming", rest: "the Built Environment" }}>
      <Suspense fallback={null}>
        <VerifyContent />
      </Suspense>
    </AuthScreenLayout>
  );
}
