"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { showSuccessToast } from "@/components/shared/AppToast";
import { AuthScreenLayout } from "@/components/shared/AuthScreenLayout";
import { HangTightCard } from "@/components/shared/HangTightCard";
import { OtpInput } from "@/components/shared/OtpInput";
import { Button } from "@/components/ui/Button";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { useHangTight } from "@/hooks/useHangTight";
import { useResendCountdown } from "@/hooks/useResendCountdown";
import { cn } from "@/lib/utils";

function BackToLoginLink({ router }: { router: ReturnType<typeof useRouter> }) {
  return (
    <Button type="button" variant="link" onClick={() => router.push("/auth")}>
      Back to login page
    </Button>
  );
}

function ForgotPasswordVerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const identifier = searchParams.get("identifier") || "Useraccount@gmail.com";
  const method = searchParams.get("method") === "phone" ? "phone" : "email";

  const [step, setStep] = useState<"otp" | "newPassword">("otp");
  const [otp, setOtp] = useState<string[]>(["", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { pending, run } = useHangTight();
  const { secondsLeft, canResend, restart } = useResendCountdown();

  function handleVerify(event: React.FormEvent) {
    event.preventDefault();
    run(() => setStep("newPassword"));
  }

  function handleResend() {
    if (!canResend) return;
    showSuccessToast("OTP resent");
    restart();
  }

  function handleResetPassword(event: React.FormEvent) {
    event.preventDefault();
    run(() => {
      showSuccessToast("Password reset successful");
      router.push("/auth");
    });
  }

  if (pending) {
    return (
      <div className="flex justify-center">
        <HangTightCard
          heading={step === "otp" ? "Verifying!" : "Resetting your password!"}
          body={
            step === "otp"
              ? "We are confirming your code for you!"
              : "We are saving your new password!"
          }
          footer="This won't take long..."
        />
      </div>
    );
  }

  if (step === "newPassword") {
    return (
      <>
        <div className="flex flex-col items-center gap-3 text-center">
          <h1 className="text-[36px] font-bold leading-[40px] tracking-[-1.08px] text-black dark:text-white">
            Create new password
          </h1>
          <p className="text-sm leading-5 text-black dark:text-white">
            Your new password must be different from previously used passwords
          </p>
        </div>

        <form onSubmit={handleResetPassword} className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <PasswordInput
                id="new-password"
                label="New Password"
                placeholder="Enter your new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <p className="text-xs text-muted-400 dark:text-muted-300">
                Use 8 or more characters with a mix of letters and numbers
              </p>
            </div>
            <PasswordInput
              id="confirm-password"
              label="Confirm Password"
              placeholder="Re-enter your new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <Button type="submit" variant="primary">
            Reset Password
          </Button>

          <div className="flex justify-center">
            <BackToLoginLink router={router} />
          </div>
        </form>
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col items-center gap-3 text-center">
        <h1 className="text-[36px] font-bold leading-[40px] tracking-[-1.08px] text-black dark:text-white">
          Enter OTP
        </h1>
        <p className="text-sm leading-5 text-[#111826] dark:text-white">
          We have shared a code to your registered {method === "phone" ? "phone number" : "email"}
          {" "}
          <span className="font-semibold tracking-[-0.42px]">{identifier}.</span>{" "}
          {method === "phone" ? "Check your messages" : "Check your inbox"} to reset your password
        </p>
      </div>

      <form onSubmit={handleVerify} className="flex flex-col gap-6">
        <OtpInput value={otp} onChange={setOtp} />

        <Button type="submit" variant="primary">
          Verify
        </Button>

        <div className="flex flex-col items-center gap-2 text-sm">
          <p className="text-helper">
            Didn&rsquo;t receive code?{" "}
            <button
              type="button"
              disabled={!canResend}
              className={cn(
                "font-semibold",
                canResend ? "text-brand-900" : "cursor-not-allowed text-muted-400",
              )}
              onClick={handleResend}
            >
              {canResend ? "Resend OTP" : `Resend OTP in ${secondsLeft}s`}
            </button>
          </p>
          <BackToLoginLink router={router} />
        </div>
      </form>
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
