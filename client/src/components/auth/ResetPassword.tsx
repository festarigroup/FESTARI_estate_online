"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import toast from "react-hot-toast";
import { mockForgotPassword, mockUpdatePassword, mockVerifyOtp } from "@/lib/mockApi";

const EASE = [0.22, 1, 0.36, 1] as const;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const OTP_LENGTH = 5;

type Step = "email" | "otp" | "password";

function maskEmail(email: string) {
  const [user, domain] = email.split("@");
  if (!domain || !user) return email;
  return `${user.slice(0, 1)}***@${domain}`;
}

function Spinner() {
  return (
    <svg className="h-4 w-4 animate-spin text-white" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  );
}

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
    </svg>
  ) : (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

const HEADER_COPY: Record<Step, { heading: string; subtitle: (email: string) => React.ReactNode }> = {
  email: {
    heading: "Reset your password",
    subtitle: () => "Enter your email address and we will send you password reset instructions",
  },
  otp: {
    heading: "Reset your password",
    subtitle: (email) => (
      <>
        We have shared a code to your registered email <span className="font-medium">{maskEmail(email)}.</span>{" "}
        Check your inbox to reset your password
      </>
    ),
  },
  password: {
    heading: "Update your password",
    subtitle: () => "Set your new password with a minimum of 8 characters with a combination of numbers and letters",
  },
};

export default function ResetPassword() {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();

  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [sendLoading, setSendLoading] = useState(false);

  const [digits, setDigits] = useState<string[]>(() => Array(OTP_LENGTH).fill(""));
  const [verifyLoading, setVerifyLoading] = useState(false);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);

  const code = digits.join("");
  const isComplete = code.length === OTP_LENGTH;

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!EMAIL_PATTERN.test(email.trim())) {
      setEmailError("Enter a valid email address.");
      return;
    }
    setEmailError("");
    setSendLoading(true);
    try {
      const res = await mockForgotPassword(email);
      if (res.success) {
        toast.success("Reset code sent! Check your inbox.");
        setStep("otp");
      } else {
        toast.error(res.message);
        setEmailError(res.message);
      }
    } finally {
      setSendLoading(false);
    }
  };

  const handleDigitChange = (index: number, rawValue: string) => {
    const clean = rawValue.replace(/\D/g, "");
    if (!clean) {
      setDigits((prev) => {
        const next = [...prev];
        next[index] = "";
        return next;
      });
      return;
    }
    const chars = clean.split("");
    setDigits((prev) => {
      const next = [...prev];
      let i = index;
      for (const ch of chars) {
        if (i >= OTP_LENGTH) break;
        next[i] = ch;
        i += 1;
      }
      return next;
    });
    const nextIndex = Math.min(index + chars.length, OTP_LENGTH - 1);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    if (!isComplete || verifyLoading) return;
    setVerifyLoading(true);
    try {
      const res = await mockVerifyOtp(code, OTP_LENGTH);
      if (res.success) {
        toast.success("Code verified! Set your new password.");
        setStep("password");
      } else {
        toast.error(res.message);
      }
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters.");
      return;
    }
    if (confirmPassword !== newPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }
    setPasswordError("");
    setUpdateLoading(true);
    try {
      const res = await mockUpdatePassword(newPassword);
      if (res.success) {
        toast.success("Password updated! Please sign in.");
        setTimeout(() => router.push("/login"), 1200);
      } else {
        toast.error(res.message);
        setPasswordError(res.message);
      }
    } finally {
      setUpdateLoading(false);
    }
  };

  const header = HEADER_COPY[step];

  return (
    <div className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-white p-6">
      <Image src="/reset-password-bg.png" alt="" fill priority className="object-contain" sizes="100vw" />

      <motion.div
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="relative flex w-full max-w-[420px] flex-col items-center gap-6"
      >
        <div className="flex flex-col items-center gap-[10px]">
          <div className="flex items-center gap-2">
            <div className="relative h-[clamp(2.5rem,5.5vh,4.2rem)] w-[clamp(1.94rem,4.3vh,3.25rem)] shrink-0">
              <Image
                src="/auth-logo-mark.png"
                alt=""
                fill
                className="object-contain object-bottom [filter:brightness(0)]"
              />
            </div>
            <p className="text-[clamp(1.25rem,1.6vh+0.4vw,1.5rem)] font-bold leading-tight tracking-[-0.5px] text-black">
              Festari Estates
            </p>
          </div>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={step}
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center gap-3"
            >
              <h1 className="text-center text-[clamp(1.5rem,2vh+1vw,1.875rem)] font-semibold leading-tight tracking-[-0.02em] text-[#be4d00]">
                {header.heading}
              </h1>
              <p className="text-center text-[clamp(0.9375rem,1vh+0.2vw,1.125rem)] leading-relaxed text-[#0f1621]">
                {header.subtitle(email)}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {step === "email" && (
            <motion.form
              key="email-form"
              onSubmit={handleSendCode}
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: -16 }}
              transition={{ duration: 0.25, ease: EASE }}
              className="flex w-full flex-col items-start gap-[18px]"
            >
              <div className="flex w-full flex-col gap-1.5">
                <label htmlFor="email" className="text-sm font-medium text-[#00261b]">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError("");
                  }}
                  placeholder="name@firm.com"
                  disabled={sendLoading}
                  className={`w-full rounded-lg border bg-white px-[17px] py-4 text-sm text-[#00261b] placeholder:text-[#717974] focus:outline-none focus:ring-1 focus:ring-[#be4d00] ${
                    emailError ? "border-red-500" : "border-[#c0c8c3]"
                  }`}
                />
                {emailError && <p className="text-xs text-red-500">{emailError}</p>}
              </div>

              <motion.button
                whileHover={shouldReduceMotion || sendLoading ? undefined : { y: -1 }}
                whileTap={shouldReduceMotion || sendLoading ? undefined : { scale: 0.98 }}
                type="submit"
                disabled={sendLoading}
                className="flex h-[60px] w-full items-center justify-center gap-2 rounded-xl bg-[#be4d00] text-lg text-white transition-colors hover:bg-[#a54300] disabled:opacity-70"
              >
                {sendLoading ? (
                  <>
                    <Spinner /> Sending…
                  </>
                ) : (
                  "Send reset instructions"
                )}
              </motion.button>
            </motion.form>
          )}

          {step === "otp" && (
            <motion.div
              key="otp-form"
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: -16 }}
              transition={{ duration: 0.25, ease: EASE }}
              className="flex w-full flex-col items-center gap-[18px]"
            >
              <div className="flex w-full items-center gap-[clamp(0.5rem,2vw,2.06rem)]">
                {digits.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    autoComplete={index === 0 ? "one-time-code" : "off"}
                    maxLength={OTP_LENGTH}
                    value={digit}
                    onChange={(e) => handleDigitChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    disabled={verifyLoading}
                    aria-label={`Digit ${index + 1}`}
                    className="aspect-square w-full flex-1 rounded-lg border-2 border-[#cbd5e0] text-center text-xl font-semibold text-[#0f1621] transition-colors focus:border-[#be4d00] focus:outline-none disabled:opacity-60"
                  />
                ))}
              </div>

              <motion.button
                whileHover={shouldReduceMotion || !isComplete || verifyLoading ? undefined : { y: -1 }}
                whileTap={shouldReduceMotion || !isComplete || verifyLoading ? undefined : { scale: 0.98 }}
                type="button"
                onClick={handleVerify}
                disabled={!isComplete || verifyLoading}
                className={`flex h-[60px] w-full items-center justify-center gap-2 rounded-xl text-lg text-white transition-colors ${
                  isComplete ? "bg-[#be4d00] hover:bg-[#a54300]" : "cursor-not-allowed bg-[#be4d00]/20"
                }`}
              >
                {verifyLoading ? (
                  <>
                    <Spinner /> Verifying…
                  </>
                ) : (
                  "Verify"
                )}
              </motion.button>
            </motion.div>
          )}

          {step === "password" && (
            <motion.form
              key="password-form"
              onSubmit={handleUpdatePassword}
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: -16 }}
              transition={{ duration: 0.25, ease: EASE }}
              className="flex w-full flex-col items-start gap-[18px]"
            >
              <div className="flex w-full flex-col gap-1">
                <label htmlFor="newPassword" className="text-sm text-[#111826]">
                  New password
                </label>
                <div className="relative w-full">
                  <input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      setPasswordError("");
                    }}
                    placeholder="Enter your password"
                    disabled={updateLoading}
                    className={`h-12 w-full rounded-lg border bg-white px-3 py-1.5 text-sm text-[#111826] placeholder:text-[#94a3b7] focus:outline-none focus:ring-1 focus:ring-[#be4d00] ${
                      passwordError ? "border-red-500" : "border-[#cbd5e0]"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword((v) => !v)}
                    tabIndex={-1}
                    aria-label={showNewPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#717974] transition-colors hover:text-[#00261b]"
                  >
                    <EyeIcon open={showNewPassword} />
                  </button>
                </div>
              </div>

              <div className="flex w-full flex-col gap-1">
                <label htmlFor="confirmPassword" className="text-sm text-[#111826]">
                  Confirm password
                </label>
                <div className="relative w-full">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setPasswordError("");
                    }}
                    placeholder="Enter your password"
                    disabled={updateLoading}
                    className={`h-12 w-full rounded-lg border bg-white px-3 py-1.5 text-sm text-[#111826] placeholder:text-[#94a3b7] focus:outline-none focus:ring-1 focus:ring-[#be4d00] ${
                      passwordError ? "border-red-500" : "border-[#cbd5e0]"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    tabIndex={-1}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#717974] transition-colors hover:text-[#00261b]"
                  >
                    <EyeIcon open={showConfirmPassword} />
                  </button>
                </div>
                {passwordError && <p className="text-xs text-red-500">{passwordError}</p>}
              </div>

              <motion.button
                whileHover={shouldReduceMotion || updateLoading ? undefined : { y: -1 }}
                whileTap={shouldReduceMotion || updateLoading ? undefined : { scale: 0.98 }}
                type="submit"
                disabled={updateLoading}
                className="flex h-[60px] w-full items-center justify-center gap-2 rounded-xl bg-[#be4d00] text-lg text-white transition-colors hover:bg-[#a54300] disabled:opacity-70"
              >
                {updateLoading ? (
                  <>
                    <Spinner /> Updating…
                  </>
                ) : (
                  "Confirm new password"
                )}
              </motion.button>
            </motion.form>
          )}
        </AnimatePresence>

        <Link
          href="/login"
          className="text-sm text-[#0f1621] underline decoration-from-font hover:text-[#414944]"
        >
          Back to login page
        </Link>
      </motion.div>
    </div>
  );
}
