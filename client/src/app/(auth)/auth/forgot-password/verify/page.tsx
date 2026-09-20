"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { showSuccessToast } from "@/components/shared/AppToast";
import { AuthScreenLayout } from "@/components/shared/AuthScreenLayout";
import { HangTightCard } from "@/components/shared/HangTightCard";
import { OtpInput } from "@/components/shared/OtpInput";
import { Button } from "@/components/ui/Button";
import { useHangTight } from "@/hooks/useHangTight";

function ForgotPasswordVerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const identifier = searchParams.get("identifier") || "Useraccount@gmail.com";

  const [otp, setOtp] = useState<string[]>(["", "", "", ""]);
  const { pending, run } = useHangTight();

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    run(() => showSuccessToast("Password reset is coming soon"));
  }

  return (
    <>
      {pending ? (
        <div className="flex justify-center">
          <HangTightCard
            heading="Verifying!"
            body="We are confirming your code for you!"
            footer="This won't take long..."
          />
        </div>
      ) : (
        <>
          <div className="flex flex-col items-center gap-3 text-center">
            <h1 className="text-[36px] font-bold leading-[40px] tracking-[-1.08px] text-black dark:text-white">
              Enter OTP
            </h1>
            <p className="text-lg leading-7 text-[#111826] dark:text-white">
              We have shared a code to your registered email{" "}
              <span className="font-semibold tracking-[-0.54px]">{identifier}.</span> Check your
              inbox to reset your password
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <OtpInput value={otp} onChange={setOtp} />

            <Button type="submit" variant="primary">
              Verify
            </Button>

            <div className="flex flex-col items-center gap-2 text-sm">
              <p className="text-helper">
                Didn&rsquo;t receive code?{" "}
                <button
                  type="button"
                  className="font-semibold text-brand-900"
                  onClick={() => showSuccessToast("OTP resent")}
                >
                  Resend OTP
                </button>
              </p>
              <Button type="button" variant="link" onClick={() => router.push("/auth")}>
                Back to login page
              </Button>
            </div>
          </form>
        </>
      )}
    </>
  );
}

export default function ForgotPasswordVerifyPage() {
  return (
    <AuthScreenLayout tagline={{ highlight: "Verifying", rest: "the Built Environment" }}>
      <Suspense fallback={null}>
        <ForgotPasswordVerifyContent />
      </Suspense>
    </AuthScreenLayout>
  );
}
