"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import toast from "react-hot-toast";
import { AuthScreenLayout } from "@/components/shared/AuthScreenLayout";
import { HangTightCard } from "@/components/shared/HangTightCard";
import { OtpInput } from "@/components/shared/OtpInput";
import { Button } from "@/components/ui/Button";
import { useHangTight } from "@/hooks/useHangTight";

function ForgotPasswordVerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const method = searchParams.get("method") === "phone" ? "phone" : "email";
  const identifier = searchParams.get("identifier") || "Useraccount@gmail.com";

  const [otp, setOtp] = useState<string[]>(["", "", "", ""]);
  const { pending, run } = useHangTight();

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    run(() => toast("Password reset is coming soon", { icon: "🚧" }));
  }

  return (
    <>
      {pending ? (
        <div className="flex justify-center">
          <HangTightCard />
        </div>
      ) : (
        <>
          <div className="flex flex-col items-center gap-3 text-center">
            <h1 className="text-[36px] font-bold leading-[40px] tracking-[-1.08px] text-black">
              Enter OTP
            </h1>
            <p className="text-lg leading-7 text-[#111826]">
              We have shared a code to your registered {method}{" "}
              <span className="font-semibold tracking-[-0.54px]">{identifier}.</span> Check your{" "}
              {method === "email" ? "inbox" : "SMS"} to reset your password
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
                  onClick={() => toast("OTP resent", { icon: "📩" })}
                >
                  Resend OTP
                </button>
              </p>
              <Button type="button" variant="link" onClick={() => router.push("/auth/sign-in")}>
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
    <AuthScreenLayout>
      <Suspense fallback={null}>
        <ForgotPasswordVerifyContent />
      </Suspense>
    </AuthScreenLayout>
  );
}
