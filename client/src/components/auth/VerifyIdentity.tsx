"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { motion, useReducedMotion } from "framer-motion";
import { mockResendOtp, mockVerifyOtp } from "@/lib/mockApi";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 60;
const EASE = [0.22, 1, 0.36, 1] as const;

function maskEmail(email: string) {
  const [user, domain] = email.split("@");
  if (!domain) return null;
  return `${user.slice(0, 1)}***@${domain}`;
}

function maskPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 4 ? `••••${digits.slice(-4)}` : null;
}

function Spinner() {
  return (
    <svg className="h-4 w-4 animate-spin text-white" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="24" height="32" viewBox="0 0 24 31.5" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M3 31.5C2.175 31.5 1.46875 31.2062 0.88125 30.6187C0.29375 30.0312 0 29.325 0 28.5V13.5C0 12.675 0.29375 11.9688 0.88125 11.3813C1.46875 10.7938 2.175 10.5 3 10.5H4.5V7.5C4.5 5.425 5.23125 3.65625 6.69375 2.19375C8.15625 0.73125 9.925 0 12 0C14.075 0 15.8437 0.73125 17.3062 2.19375C18.7687 3.65625 19.5 5.425 19.5 7.5V10.5H21C21.825 10.5 22.5312 10.7938 23.1187 11.3813C23.7062 11.9688 24 12.675 24 13.5V28.5C24 29.325 23.7062 30.0312 23.1187 30.6187C22.5312 31.2062 21.825 31.5 21 31.5H3M3 28.5H21V13.5H3V28.5M12 24C12.825 24 13.5312 23.7062 14.1187 23.1187C14.7062 22.5312 15 21.825 15 21C15 20.175 14.7062 19.4688 14.1187 18.8813C13.5312 18.2938 12.825 18 12 18C11.175 18 10.4688 18.2938 9.88125 18.8813C9.29375 19.4688 9 20.175 9 21C9 21.825 9.29375 22.5312 9.88125 23.1187C10.4688 23.7062 11.175 24 12 24M7.5 10.5H16.5V7.5C16.5 6.25 16.0625 5.1875 15.1875 4.3125C14.3125 3.4375 13.25 3 12 3C10.75 3 9.6875 3.4375 8.8125 4.3125C7.9375 5.1875 7.5 6.25 7.5 7.5V10.5Z"
        fill="#FFE088"
      />
    </svg>
  );
}

export default function VerifyIdentity() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const shouldReduceMotion = useReducedMotion();

  const email = searchParams.get("email") ?? "";
  const phone = searchParams.get("phone") ?? "";
  const maskedEmail = maskEmail(email);
  const maskedPhone = maskPhone(phone);
  const changeContactHref = `/verify-otp/change-contact?${new URLSearchParams({ email, phone }).toString()}`;

  const [digits, setDigits] = useState<string[]>(() => Array(OTP_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  const code = digits.join("");
  const isComplete = code.length === OTP_LENGTH;

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
    if (!isComplete || loading) return;
    setLoading(true);
    try {
      const res = await mockVerifyOtp(code);
      if (res.success) {
        toast.success("Identity verified! Redirecting…");
        setTimeout(() => router.push("/home"), 1000);
      } else {
        toast.error(res.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (secondsLeft > 0 || resendLoading) return;
    setResendLoading(true);
    try {
      const res = await mockResendOtp();
      if (res.success) {
        toast.success("A new code has been sent.");
        setSecondsLeft(RESEND_SECONDS);
        setDigits(Array(OTP_LENGTH).fill(""));
        inputRefs.current[0]?.focus();
      } else {
        toast.error(res.message);
      }
    } finally {
      setResendLoading(false);
    }
  };

  const timerLabel = `${Math.floor(secondsLeft / 60)}:${(secondsLeft % 60).toString().padStart(2, "0")}`;

  const fadeUp = (delay = 0) =>
    shouldReduceMotion
      ? { initial: { opacity: 1 }, animate: { opacity: 1 }, transition: { duration: 0 } }
      : {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay, ease: EASE },
        };

  return (
    <div className="grid h-screen w-full grid-cols-2 overflow-hidden bg-[#fcf9f8]">
      {/* Left: Immersive imagery */}
      <div className="relative flex items-center justify-center overflow-hidden p-[clamp(1.5rem,4vh,4rem)]">
        <div className="relative h-full w-full overflow-hidden rounded-2xl">
          <motion.div
            initial={shouldReduceMotion ? { scale: 1 } : { scale: 1.08 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.6, ease: EASE }}
            className="absolute inset-0"
          >
            <Image
              src="/verify-hero.jpg"
              alt="Modern luxury villa with an infinity pool"
              fill
              priority
              className="object-cover"
              sizes="50vw"
            />
          </motion.div>
          <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-black/30 to-transparent" />

          <motion.div
            {...fadeUp(0)}
            className="absolute left-[clamp(1.5rem,3vw,3.3rem)] top-[clamp(1.5rem,3vh,3rem)] flex items-center gap-2"
          >
            <div className="relative h-[clamp(2.25rem,5vh,3.3rem)] w-[clamp(1.75rem,3.9vh,2.56rem)] shrink-0">
              <Image
                src="/auth-logo-mark.png"
                alt=""
                fill
                className="object-contain object-bottom [filter:brightness(0)_invert(1)]"
              />
            </div>
            <p className="text-[clamp(1rem,1.6vh+0.3vw,1.25rem)] font-bold leading-tight tracking-[-0.5px] text-white">
              Festari Estates
            </p>
          </motion.div>

          <motion.div
            {...fadeUp(0.15)}
            className="absolute left-[clamp(1.25rem,3vw,3.3rem)] top-1/2 max-w-[512px] -translate-y-1/2 rounded-xl border border-white/20 bg-white/10 p-[clamp(1.5rem,3.5vw,3.06rem)] backdrop-blur-[10px]"
          >
            <div className="flex flex-col gap-[clamp(1rem,2vh,1.47rem)]">
              <LockIcon />
              <h2 className="text-[clamp(1.5rem,2vw+1.6vh,2.5rem)] font-semibold leading-[1.2] text-white">
                Uncompromising Security for Your Legacy
              </h2>
              <p className="text-[clamp(0.875rem,1vh+0.3vw,1.125rem)] italic leading-relaxed text-white/90">
                &quot;At FEO Estates, we believe that true luxury is peace of mind. Your assets and identity are
                guarded by the same precision that defines our architecture.&quot;
              </p>
              <div className="flex items-center gap-4">
                <div className="h-px w-12 bg-[#ffe088]" />
                <p className="text-[clamp(0.6875rem,0.8vh,0.875rem)] font-semibold uppercase tracking-[1.4px] text-[#ffe088]">
                  Festari Security Protocol
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right: Verification card */}
      <div className="flex items-center justify-center overflow-y-auto p-[clamp(1.5rem,4vh,4rem)] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="w-full max-w-[448px] rounded-[22px] bg-white px-[clamp(1.5rem,3vw,2rem)] py-[clamp(2rem,6vh,3.75rem)] shadow-sm"
        >
          <div className="flex flex-col gap-3 py-2">
            <h1 className="text-2xl font-bold tracking-tight text-[#0f1621]">Festari Estates</h1>
            <div className="h-1 w-12 bg-[#be4d00]" />
          </div>

          <div className="flex flex-col gap-[clamp(1.25rem,3vh,1.5rem)] pt-[clamp(1rem,2vh,1.5rem)]">
            <div className="flex flex-col gap-[clamp(0.75rem,2vh,1rem)]">
              <h2 className="text-[clamp(1.5rem,2vh+1vw,2.25rem)] font-semibold leading-tight text-[#0f1621]">
                Verify Your Identity
              </h2>
              <p className="text-[clamp(0.9375rem,1vh+0.2vw,1.125rem)] leading-relaxed text-[#0f1621]">
                We&apos;ve sent a 6-digit verification code
                {maskedEmail && (
                  <>
                    {" "}
                    to your email <span className="font-semibold">{maskedEmail}</span>
                  </>
                )}
                {maskedPhone && (
                  <>
                    {" "}
                    and mobile number ending in <span className="font-semibold">{maskedPhone}</span>
                  </>
                )}
                .
              </p>
            </div>

            <div className="flex items-center gap-[clamp(0.5rem,2vw,2.06rem)]">
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
                  disabled={loading}
                  aria-label={`Digit ${index + 1}`}
                  className="aspect-square w-full flex-1 rounded-lg border-2 border-[#cbd5e0] text-center text-xl font-semibold text-[#0f1621] transition-colors focus:border-[#be4d00] focus:outline-none disabled:opacity-60"
                />
              ))}
            </div>

            <motion.button
              whileHover={shouldReduceMotion || !isComplete || loading ? undefined : { y: -1 }}
              whileTap={shouldReduceMotion || !isComplete || loading ? undefined : { scale: 0.98 }}
              type="button"
              onClick={handleVerify}
              disabled={!isComplete || loading}
              className={`flex h-[60px] w-full items-center justify-center gap-2 rounded-xl text-[18px] text-white transition-colors ${
                isComplete ? "bg-[#be4d00] hover:bg-[#a54300]" : "cursor-not-allowed bg-[#be4d00]/20"
              }`}
            >
              {loading ? (
                <>
                  <Spinner /> Verifying…
                </>
              ) : (
                "Verify to continue"
              )}
            </motion.button>

            <div className="flex items-center justify-between border-t border-gray-100 pt-[clamp(0.75rem,2vh,1rem)]">
              <button
                type="button"
                onClick={handleResend}
                disabled={secondsLeft > 0 || resendLoading}
                className={`flex items-center gap-2 text-sm font-semibold tracking-[0.7px] text-[#414944] transition-colors ${
                  secondsLeft > 0 || resendLoading ? "cursor-not-allowed opacity-50" : "hover:text-[#00261b]"
                }`}
              >
                Resend Code{secondsLeft > 0 && <span className="font-mono">({timerLabel})</span>}
              </button>
              <Link
                href={changeContactHref}
                className="text-sm font-semibold tracking-[0.7px] text-[#1877f2] underline hover:text-[#145dbf]"
              >
                Change contact method
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
