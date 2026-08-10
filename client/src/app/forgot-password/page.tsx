"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { forgotPassword, resendOtp, resetPassword } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { cn } from "@/lib/cn";

const INPUT_CLASS =
  "w-full rounded-lg border border-border-subtle px-3 py-2 text-sm text-ink placeholder:text-muted focus:outline-2 focus:outline-brand-gold";

/** Two-step flow, same shape as register's form -> OTP steps:
 * 1. "email" -- ask for the account's email, POST /auth/forgot-password
 *    (emails a 6-digit password_reset OTP; same OTP mechanism email
 *    verification already uses, just a different `purpose`).
 * 2. "reset" -- OTP + new password, POST /auth/reset-password verifies the
 *    OTP and sets the password server-side in one call (no separate
 *    verify-otp step for this purpose, unlike email verification). */
export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "reset">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  // Covers both this step's own client-side check (passwords not matching)
  // and whatever the backend rejects the OTP/password for (expired, wrong,
  // too many attempts) -- one banner rather than trying to guess which
  // field a given backend message is really about.
  const [error, setError] = useState<string | null>(null);

  async function handleRequestReset(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await forgotPassword(email);
      toast.success("Check your email for a reset code.");
      setStep("reset");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Couldn't send a reset code.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setSubmitting(true);
    try {
      await resetPassword(email, otp, newPassword);
      toast.success("Password reset. You can now sign in.");
      router.push("/login");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't reset your password.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResend() {
    try {
      await resendOtp(email, "password_reset");
      toast.success("A new code is on its way.");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Couldn't resend the code.");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-sm rounded-xl bg-white p-8 shadow-[0px_4px_12px_0px_rgba(0,31,63,0.08)]">
        <div className="mb-6 flex flex-col items-center gap-2">
          <Image src="/images/logo-festari.png" alt="" width={37} height={54} className="h-10 w-auto" />
          <h1 className="font-heading text-xl text-ink">
            {step === "email" ? "Reset your password" : "Choose a new password"}
          </h1>
        </div>

        {step === "email" ? (
          <form onSubmit={handleRequestReset} className="flex flex-col gap-4">
            <p className="text-sm text-muted">
              Enter the email on your account and we&apos;ll send you a code to reset your password.
            </p>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-ink">Email</span>
              <input
                type="email"
                required
                placeholder="admin@festari.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={INPUT_CLASS}
              />
            </label>
            <Button type="submit" variant="gold" disabled={submitting} className="mt-2 w-full">
              {submitting ? "Sending code..." : "Send reset code"}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleReset} className="flex flex-col gap-4">
            <p className="text-sm text-muted">
              Enter the code we sent to <span className="font-semibold text-ink">{email}</span>, then choose a new
              password.
            </p>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-ink">Reset code</span>
              <input
                required
                placeholder="6-digit code"
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value);
                  setError(null);
                }}
                className={INPUT_CLASS}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-ink">New password</span>
              <PasswordInput
                required
                minLength={8}
                placeholder="At least 8 characters"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setError(null);
                }}
                className={INPUT_CLASS}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-ink">Confirm new password</span>
              <PasswordInput
                required
                minLength={8}
                placeholder="Re-enter your new password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setError(null);
                }}
                aria-invalid={!!error}
                className={cn(INPUT_CLASS, error && "border-brand-rust focus:outline-brand-rust")}
              />
              {error && (
                <p role="alert" className="text-xs text-brand-rust">
                  {error}
                </p>
              )}
            </label>
            <Button type="submit" variant="gold" disabled={submitting} className="w-full">
              {submitting ? "Resetting..." : "Reset password"}
            </Button>
            <div className="flex items-center justify-between text-sm">
              <button type="button" onClick={handleResend} className="font-semibold text-brand-navy hover:underline">
                Resend code
              </button>
              <button
                type="button"
                onClick={() => {
                  setStep("email");
                  setError(null);
                }}
                className="text-muted hover:underline"
              >
                Use a different email
              </button>
            </div>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-muted">
          Remembered your password?{" "}
          <Link href="/login" className="font-semibold text-brand-navy hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
