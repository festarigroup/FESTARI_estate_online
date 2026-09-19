"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { AuthScreenLayout } from "@/components/shared/AuthScreenLayout";
import { HangTightCard } from "@/components/shared/HangTightCard";
import { OtpInput } from "@/components/shared/OtpInput";
import { Button } from "@/components/ui/Button";
import { useHangTight } from "@/hooks/useHangTight";

export default function VerifyPage() {
  const [otp, setOtp] = useState<string[]>(["", "", "", ""]);
  const { pending, run } = useHangTight();

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    run(() => toast.success("You're verified! Full sign-in is coming soon"));
  }

  return (
    <AuthScreenLayout>
      {pending ? (
        <div className="flex justify-center">
          <HangTightCard />
        </div>
      ) : (
        <>
          <div className="flex flex-col items-center gap-3 text-center">
            <h1 className="text-[36px] font-bold leading-[40px] tracking-[-1.08px] text-black">
              Almost there!
            </h1>
            <p className="text-sm leading-5 text-black">
              we sent a temporary login code to Useraccount@gmail.com
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
                onClick={() => toast.success("OTP resent")}
              >
                Resend OTP
              </button>
            </p>
          </form>
        </>
      )}
    </AuthScreenLayout>
  );
}
