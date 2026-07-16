"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { mockLogin, mockRegister } from "@/lib/mockApi";

type AuthMode = "signin" | "signup";

type AuthGatewayProps = {
  initialMode: AuthMode;
};

const EASE = [0.22, 1, 0.36, 1] as const;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Fluid type/space scale: values shrink on short viewports (no page scroll) and
// grow on tall/large ones, all anchored to viewport height so the whole gateway
// always fits within a single screen.
const FLUID = {
  heroPad: "p-[clamp(1.5rem,4vh,3rem)]",
  heroGap: "gap-[clamp(1rem,2.6vh,1.5rem)]",
  brandText: "text-[clamp(1rem,1.6vh+0.3vw,1.25rem)]",
  logoBox: "h-[clamp(2.25rem,5vh,3.3rem)] w-[clamp(1.75rem,3.9vh,2.56rem)]",
  heading: "text-[clamp(1.875rem,1.6vw+2.4vh,3.75rem)] leading-[1.1]",
  paragraph: "text-[clamp(0.8125rem,0.5vw+0.9vh,1.0625rem)]",
  statValue: "text-[clamp(1.125rem,1vh+0.6vw,1.5rem)]",
  statLabel: "text-[clamp(0.6875rem,0.8vh,0.875rem)]",
  footerText: "text-[clamp(0.6875rem,0.8vh,0.875rem)]",
  formPad: "px-[clamp(2rem,4vw,4rem)] py-[clamp(1.5rem,4vh,3rem)]",
  h2: "text-[clamp(1.375rem,1vw+1.6vh,1.875rem)]",
  subtitle: "text-[clamp(0.8125rem,0.9vh,1rem)]",
  label: "text-[clamp(0.8125rem,0.9vh,0.875rem)]",
  input: "px-[clamp(0.875rem,1.2vw,1.0625rem)] py-[clamp(0.65rem,1.6vh,1rem)] text-[clamp(0.8125rem,0.9vh,0.875rem)]",
  buttonText: "text-[clamp(0.9375rem,1vh+0.4vw,1.125rem)]",
  buttonPad: "px-4 py-[clamp(0.75rem,2vh,1rem)]",
  socialButton: "h-[clamp(2.5rem,5.5vh,2.875rem)] text-[clamp(0.8125rem,0.9vh,0.875rem)]",
};

const HERO_CONTENT = {
  signin: {
    headingLines: ["Welcome Back"],
    headingClassName: `${FLUID.heading} font-bold`,
    description:
      "Access our exclusive marketplace and manage your luxury assets with fintech precision. Secure, transparent, and tailored for the modern investor.",
    statsVariant: "list" as const,
    stats: [
      { value: "GHS 4.2B+", label: "Assets Managed" },
      { value: "12k+", label: "Active Portfolios" },
    ],
  },
  signup: {
    headingLines: ["Join the Circle", "of Excellence."],
    headingClassName: `${FLUID.heading} font-bold tracking-[-0.02em]`,
    description:
      "Start your journey into the world's most exclusive real estate and service marketplace. Experience quiet luxury at your fingertips.",
    statsVariant: "bento" as const,
    stats: [
      { value: "50k+", label: "Active Members" },
      { value: "120+", label: "Countries" },
    ],
  },
} satisfies Record<AuthMode, {
  headingLines: string[];
  headingClassName: string;
  description: string;
  statsVariant: "list" | "bento";
  stats: { value: string; label: string }[];
}>;

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
    <svg className="h-[15px] w-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
    </svg>
  ) : (
    <svg className="h-[15px] w-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg className="size-[17px]" viewBox="0 0 14.42 14.9343" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M6.35964 0.0648316C7.13335 -0.0216105 7.59117 -0.0216105 8.42251 0.0648316C9.89409 0.282639 11.2583 0.962854 12.3177 2.00711C11.6018 2.68385 10.8953 3.37048 10.1983 4.06678C8.86362 2.93557 7.37382 2.67446 5.72893 3.28347C4.5223 3.83841 3.68207 4.73769 3.20823 5.98132C2.43393 5.40486 1.6697 4.81497 0.915916 4.21192C0.863531 4.18435 0.803699 4.17425 0.745166 4.18311C1.94255 1.87443 3.81369 0.501311 6.35857 0.0637644" fill="#F44336" />
      <path fillRule="evenodd" clipRule="evenodd" d="M0.743032 4.18311C0.803505 4.17386 0.860778 4.18346 0.914849 4.21192C1.66864 4.81497 2.43286 5.40486 3.20717 5.98132C3.08532 6.46589 3.00851 6.96067 2.97772 7.45937C3.00405 7.94174 3.08053 8.41522 3.20717 8.8798L0.80066 10.7954C-0.247318 8.60553 -0.266528 6.40144 0.743032 4.18311Z" fill="#FFC107" />
      <path fillRule="evenodd" clipRule="evenodd" d="M12.2036 13.1155C11.4542 12.4546 10.6698 11.8348 9.85361 11.2586C10.6718 10.6809 11.1684 9.88829 11.3434 8.88087H7.33398V6.09658C9.64622 6.07737 11.9574 6.09693 14.2675 6.15527C14.7058 8.5351 14.1996 10.6809 12.7489 12.5925C12.5764 12.7759 12.3937 12.9504 12.2036 13.1155Z" fill="#448AFF" />
      <path fillRule="evenodd" clipRule="evenodd" d="M3.20717 8.88087C4.08226 11.0558 5.6866 12.071 8.02018 11.9266C8.67526 11.8508 9.30331 11.6219 9.85361 11.2586C10.6704 11.8363 11.4537 12.4552 12.2036 13.1155C11.0154 14.1831 9.50049 14.8166 7.90599 14.9126C7.54373 14.9416 7.17973 14.9416 6.81746 14.9126C4.10112 14.5925 2.09551 13.2201 0.80066 10.7954L3.20717 8.88087Z" fill="#43A047" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg className="size-[17px]" viewBox="0 0 15.8798 17.0755" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M3.76138 2.15511C3.76469 2.57684 3.60187 2.98293 3.30813 3.28557C3.01439 3.58821 2.61334 3.76307 2.1917 3.77236C1.77094 3.75707 1.37213 3.5807 1.07772 3.27971C0.783308 2.97871 0.6158 2.57611 0.609821 2.15511C0.628005 1.74483 0.801598 1.35683 1.09537 1.06985C1.38915 0.782867 1.7811 0.6184 2.1917 0.609821C2.60108 0.618564 2.99165 0.783443 3.28345 1.07071C3.57525 1.35798 3.74623 1.74591 3.76138 2.15511ZM0.779352 6.64583C0.779352 5.71647 1.37088 5.8616 2.1917 5.8616C3.01252 5.8616 3.59185 5.71647 3.59185 6.64583V15.7005C3.59185 16.642 3.00032 16.4493 2.1917 16.4493C1.38307 16.4493 0.779352 16.642 0.779352 15.7005V6.64583ZM6.03113 6.64705C6.03113 6.12749 6.22384 5.93356 6.52509 5.8738C6.82634 5.81404 7.8667 5.8738 8.22771 5.8738C8.58995 5.8738 8.73508 6.46533 8.72289 6.91172C9.03228 6.49554 9.44348 6.16591 9.91699 5.95446C10.3905 5.74301 10.9104 5.65686 11.4268 5.70427C11.9339 5.67331 12.4418 5.74935 12.9176 5.92746C13.3933 6.10556 13.8263 6.38175 14.1884 6.73807C14.5505 7.0944 14.8335 7.52291 15.0192 7.99576C15.2049 8.46861 15.2891 8.97523 15.2663 9.48272V15.6639C15.2663 16.6054 14.6869 16.4127 13.8649 16.4127C13.0429 16.4127 12.4648 16.6054 12.4648 15.6639V10.8341C12.4858 10.5857 12.4532 10.3357 12.3692 10.101C12.2851 9.86637 12.1515 9.65253 11.9776 9.47402C11.8036 9.29552 11.5932 9.15653 11.3608 9.06649C11.1283 8.97645 10.8792 8.93747 10.6304 8.95218C10.3824 8.94565 10.1359 8.9919 9.90714 9.08788C9.67839 9.18387 9.47265 9.32738 9.30358 9.50891C9.13451 9.69044 9.00596 9.90583 8.92645 10.1408C8.84694 10.3758 8.8183 10.625 8.84241 10.8719V15.7005C8.84241 16.642 8.25088 16.4493 7.43006 16.4493C6.60924 16.4493 6.02991 16.642 6.02991 15.7005L6.03113 6.64705Z"
        fill="#D7E0FF"
        stroke="#4147D5"
        strokeWidth="1.21964"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FormField({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  disabled,
  autoComplete,
  extra,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  autoComplete?: string;
  extra?: ReactNode;
}) {
  return (
    <div className="flex w-full flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className={`${FLUID.label} font-medium text-[#00261b]`}>
          {label}
        </label>
        {extra}
      </div>
      <input
        id={id}
        type={type}
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full rounded-lg border bg-white text-[#00261b] placeholder:text-[#717974] focus:outline-none focus:ring-1 focus:ring-[#be4d00] ${FLUID.input} ${
          error ? "border-red-500" : "border-[#c0c8c3]"
        }`}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

function PasswordField({
  id,
  label,
  value,
  onChange,
  error,
  disabled,
  show,
  onToggleShow,
  extra,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  show: boolean;
  onToggleShow: () => void;
  extra?: ReactNode;
}) {
  return (
    <div className="flex w-full flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className={`${FLUID.label} font-medium text-[#00261b]`}>
          {label}
        </label>
        {extra}
      </div>
      <div className="relative w-full">
        <input
          id={id}
          type={show ? "text" : "password"}
          autoComplete="new-password"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="••••••••"
          disabled={disabled}
          className={`w-full rounded-lg border bg-white text-[#00261b] placeholder:text-[#717974] focus:outline-none focus:ring-1 focus:ring-[#be4d00] ${FLUID.input} ${
            error ? "border-red-500" : "border-[#c0c8c3]"
          }`}
        />
        <button
          type="button"
          onClick={onToggleShow}
          tabIndex={-1}
          aria-label={show ? "Hide password" : "Show password"}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#717974] transition-colors hover:text-[#00261b]"
        >
          <EyeIcon open={show} />
        </button>
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

export default function AuthGateway({ initialMode }: AuthGatewayProps) {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const isSignIn = mode === "signin";
  const hero = HERO_CONTENT[mode];

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    password?: string;
    confirmPassword?: string;
    terms?: string;
  }>({});

  const switchMode = (next: AuthMode) => {
    if (next === mode) return;
    setMode(next);
    setErrors({});
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSignIn) {
      if (!EMAIL_PATTERN.test(email.trim())) {
        setErrors({ email: "Enter a valid email address." });
        return;
      }
      if (password.length < 8) {
        setErrors({ password: "Password must be at least 8 characters." });
        return;
      }
      setErrors({});
      setLoading(true);
      try {
        const res = await mockLogin(email, password);
        if (res.success) {
          toast.success("Welcome back! Redirecting…");
          setTimeout(() => router.push("/home"), 1200);
        } else {
          toast.error(res.message);
          setErrors({ password: res.message });
        }
      } finally {
        setLoading(false);
      }
      return;
    }

    if (!firstName.trim()) {
      setErrors({ firstName: "First name is required." });
      return;
    }
    if (!lastName.trim()) {
      setErrors({ lastName: "Last name is required." });
      return;
    }
    if (!phone.trim()) {
      setErrors({ phone: "Phone number is required." });
      return;
    }
    if (!EMAIL_PATTERN.test(email.trim())) {
      setErrors({ email: "Enter a valid email address." });
      return;
    }
    if (password.length < 8) {
      setErrors({ password: "Password must be at least 8 characters." });
      return;
    }
    if (confirmPassword !== password) {
      setErrors({ confirmPassword: "Passwords do not match." });
      return;
    }
    if (!termsAccepted) {
      setErrors({ terms: "You must agree to the Terms of Service and Privacy Policy." });
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      const res = await mockRegister(`${firstName.trim()} ${lastName.trim()}`, email, password);
      if (res.success) {
        toast.success("Account created! Let's verify your identity.");
        const params = new URLSearchParams({ email: email.trim(), phone: phone.trim() });
        setTimeout(() => router.push(`/verify-otp?${params.toString()}`), 1200);
      } else {
        toast.error(res.message);
        setErrors({ password: res.message });
      }
    } finally {
      setLoading(false);
    }
  };

  const fadeUp = (delay = 0) =>
    shouldReduceMotion
      ? { initial: { opacity: 1 }, animate: { opacity: 1 }, transition: { duration: 0 } }
      : {
          initial: { opacity: 0, y: 22 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  const heroPanel = (
    <motion.div
      key="hero"
      layout={!shouldReduceMotion}
      transition={{ layout: { duration: 0.6, ease: EASE } }}
      className="relative flex h-full items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0">
        <motion.div
          initial={shouldReduceMotion ? { scale: 1 } : { scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.6, ease: EASE }}
          className="absolute inset-0"
        >
          <Image
            src="/auth-hero.jpg"
            alt="Modern luxury estate at dusk"
            fill
            priority
            className="object-cover"
            sizes="50vw"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(0,38,27,0.2)] to-[rgba(0,38,27,0.8)]" />
      </div>

      <div className={`relative flex h-full w-full flex-col items-start justify-between ${FLUID.heroPad}`}>
        <motion.div {...fadeUp(0)} className="flex w-full items-center gap-2">
          <div className={`relative shrink-0 ${FLUID.logoBox}`}>
            <Image
              src="/auth-logo-mark.png"
              alt=""
              fill
              className="object-contain object-bottom [filter:brightness(0)_invert(1)]"
            />
          </div>
          <p className={`${FLUID.brandText} font-bold leading-tight tracking-[-0.5px] text-white`}>
            Festari Estates
          </p>
        </motion.div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={mode}
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -16 }}
            transition={{ duration: 0.4, ease: EASE }}
            className={`flex w-full max-w-[576px] flex-col ${FLUID.heroGap}`}
          >
            <h1 className={`${hero.headingClassName} text-white`}>
              {hero.headingLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h1>

            <p className={`${FLUID.paragraph} max-w-[576px] leading-relaxed text-white/80`}>
              {hero.description}
            </p>

            {hero.statsVariant === "list" ? (
              <div className="flex w-full items-center gap-[clamp(1.25rem,3vw,2rem)] border-l-2 border-[#be4d00] pl-[clamp(1rem,2vw,1.625rem)]">
                {hero.stats.map((stat) => (
                  <div key={stat.label}>
                    <p className={`${FLUID.statValue} font-bold leading-tight text-white`}>{stat.value}</p>
                    <p className={`${FLUID.statLabel} leading-tight text-white/60`}>{stat.label}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex w-full items-start justify-center gap-[clamp(0.75rem,2vw,1.5rem)]">
                {hero.stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="flex flex-1 flex-col gap-1 rounded-xl border border-white/15 bg-white/5 px-[clamp(1rem,2vw,1.5rem)] py-[clamp(1rem,2.2vh,1.5rem)] backdrop-blur-[10px]"
                  >
                    <p className={`${FLUID.statValue} font-semibold leading-tight text-[#ffe088]`}>{stat.value}</p>
                    <p className={`${FLUID.statLabel} font-semibold leading-tight tracking-[0.7px] text-white/70`}>
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <motion.div {...fadeUp(0.35)} className="flex w-full items-center justify-between">
          <p className={`${FLUID.footerText} leading-tight text-white/50`}>© 2026 Festari Estates Group</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className={`${FLUID.footerText} leading-tight text-white/50 transition-colors hover:text-white`}>
              Privacy Policy
            </Link>
            <Link href="/terms" className={`${FLUID.footerText} leading-tight text-white/50 transition-colors hover:text-white`}>
              Terms of Service
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );

  const formPanel = (
    <motion.div
      key="form"
      layout={!shouldReduceMotion}
      transition={{ layout: { duration: 0.6, ease: EASE } }}
      className={`flex h-full items-center justify-center overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${
        isSignIn ? FLUID.formPad : "px-[clamp(2rem,4vw,4rem)] py-[clamp(1rem,3vh,2rem)]"
      }`}
    >
      <motion.div
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="flex w-full max-w-[448px] flex-col"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={mode}
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
            transition={{ duration: 0.3, ease: EASE }}
            className={`flex flex-col gap-2 ${isSignIn ? "pb-[clamp(1rem,3vh,2rem)]" : "pb-[clamp(0.5rem,1.6vh,1rem)]"}`}
          >
            <h2 className={`${FLUID.h2} text-center font-bold leading-tight text-[#00261b]`}>
              {isSignIn ? "Sign In" : "Sign Up"}
            </h2>
            <p className={`${FLUID.subtitle} text-center leading-relaxed text-[#414944]`}>
              {isSignIn
                ? "Enter your credentials to access your luxury portfolio."
                : "Create an account with us"}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Tab Switcher */}
        <div
          className={`relative flex w-full justify-center border-b border-[#c0c8c3] ${
            isSignIn ? "pb-[clamp(1rem,3vh,2rem)]" : "pb-[clamp(0.5rem,1.6vh,1rem)]"
          }`}
        >
          <button
            type="button"
            onClick={() => switchMode("signin")}
            className={`relative flex-1 pb-[clamp(0.625rem,1.6vh,0.875rem)] text-center ${FLUID.label} font-bold transition-colors ${
              isSignIn ? "text-[#be4d00]" : "text-[#414944] hover:text-[#00261b]"
            }`}
          >
            Sign In
            {isSignIn && (
              <motion.span
                layoutId="auth-tab-underline"
                className="absolute inset-x-0 -bottom-px h-0.5 bg-[#be4d00]"
                transition={shouldReduceMotion ? { duration: 0 } : { type: "spring", stiffness: 500, damping: 35 }}
              />
            )}
          </button>
          <button
            type="button"
            onClick={() => switchMode("signup")}
            className={`relative flex-1 pb-[clamp(0.625rem,1.6vh,0.875rem)] text-center ${FLUID.label} font-bold transition-colors ${
              !isSignIn ? "text-[#be4d00]" : "text-[#414944] hover:text-[#00261b]"
            }`}
          >
            Sign Up
            {!isSignIn && (
              <motion.span
                layoutId="auth-tab-underline"
                className="absolute inset-x-0 -bottom-px h-0.5 bg-[#be4d00]"
                transition={shouldReduceMotion ? { duration: 0 } : { type: "spring", stiffness: 500, damping: 35 }}
              />
            )}
          </button>
        </div>

        {/* Social Logins */}
        <div
          className={`flex items-stretch gap-[clamp(0.5rem,1.4vh,0.75rem)] ${
            isSignIn ? "pt-[clamp(1rem,3vh,2rem)]" : "pt-[clamp(0.5rem,1.6vh,1rem)]"
          }`}
        >
          <motion.button
            whileHover={shouldReduceMotion ? undefined : { y: -1 }}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
            type="button"
            className={`flex flex-1 items-center justify-center gap-2.5 rounded-xl border border-[#c0c8c3] bg-white text-black/80 ${FLUID.socialButton}`}
          >
            <GoogleIcon />
            Login with Google
          </motion.button>
          <motion.button
            whileHover={shouldReduceMotion ? undefined : { y: -1 }}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
            type="button"
            className={`flex flex-1 items-center justify-center gap-2.5 rounded-xl border border-[#c0c8c3] bg-white text-black/80 ${FLUID.socialButton}`}
          >
            <LinkedInIcon />
            Login with LinkedIn
          </motion.button>
        </div>

        {/* Divider */}
        <div
          className={`relative flex items-center justify-center ${
            isSignIn ? "py-[clamp(1rem,3vh,2rem)]" : "py-[clamp(0.5rem,1.6vh,1rem)]"
          }`}
        >
          <div className="absolute inset-x-0 border-t border-[rgba(192,200,195,0.7)]" />
          <span className="relative bg-[#fcf9f8] px-4 text-[clamp(0.6875rem,0.8vh,0.75rem)] font-light text-[#414944]">
            OR EMAIL
          </span>
        </div>

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex w-full flex-col"
        >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={mode}
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: -16 }}
            transition={{ duration: 0.3, ease: EASE }}
            className={`flex w-full flex-col ${isSignIn ? "gap-[clamp(0.75rem,2vh,1rem)]" : "gap-[clamp(0.5rem,1.6vh,0.75rem)]"}`}
          >
          {isSignIn ? (
            <FormField
              id="email"
              label="Email Address"
              type="email"
              value={email}
              onChange={(v) => {
                setEmail(v);
                setErrors({});
              }}
              placeholder="name@firm.com"
              disabled={loading}
              autoComplete="email"
              error={errors.email}
            />
          ) : (
            <>
              <div className="flex w-full items-start gap-[clamp(0.875rem,2vw,1rem)]">
                <FormField
                  id="firstName"
                  label="First Name"
                  value={firstName}
                  onChange={(v) => {
                    setFirstName(v);
                    setErrors({});
                  }}
                  placeholder="Alexander"
                  disabled={loading}
                  autoComplete="given-name"
                  error={errors.firstName}
                />
                <FormField
                  id="lastName"
                  label="Last Name"
                  value={lastName}
                  onChange={(v) => {
                    setLastName(v);
                    setErrors({});
                  }}
                  placeholder="Festari"
                  disabled={loading}
                  autoComplete="family-name"
                  error={errors.lastName}
                />
              </div>
              <div className="flex w-full items-start gap-[clamp(0.875rem,2vw,1rem)]">
                <FormField
                  id="phone"
                  label="Phone Number"
                  type="tel"
                  value={phone}
                  onChange={(v) => {
                    setPhone(v);
                    setErrors({});
                  }}
                  placeholder="0246 508595"
                  disabled={loading}
                  autoComplete="tel"
                  error={errors.phone}
                />
                <FormField
                  id="email"
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(v) => {
                    setEmail(v);
                    setErrors({});
                  }}
                  placeholder="name@firm.com"
                  disabled={loading}
                  autoComplete="email"
                  error={errors.email}
                />
              </div>
            </>
          )}

          {isSignIn ? (
            <PasswordField
              id="password"
              label="Password"
              value={password}
              onChange={(v) => {
                setPassword(v);
                setErrors({});
              }}
              disabled={loading}
              show={showPassword}
              onToggleShow={() => setShowPassword((v) => !v)}
              error={errors.password}
              extra={
                <Link
                  href="/forgot-password"
                  className="text-[clamp(0.6875rem,0.8vh,0.75rem)] font-bold italic text-[#be4d00] hover:text-[#a54300]"
                >
                  Forgot password?
                </Link>
              }
            />
          ) : (
            <div className="flex w-full items-start gap-[clamp(0.875rem,2vw,1.25rem)]">
              <PasswordField
                id="password"
                label="Password"
                value={password}
                onChange={(v) => {
                  setPassword(v);
                  setErrors({});
                }}
                disabled={loading}
                show={showPassword}
                onToggleShow={() => setShowPassword((v) => !v)}
                error={errors.password}
              />
              <PasswordField
                id="confirmPassword"
                label="Confirm Password"
                value={confirmPassword}
                onChange={(v) => {
                  setConfirmPassword(v);
                  setErrors({});
                }}
                disabled={loading}
                show={showConfirmPassword}
                onToggleShow={() => setShowConfirmPassword((v) => !v)}
                error={errors.confirmPassword}
              />
            </div>
          )}

          {isSignIn ? (
            <label className="flex items-center gap-2 py-[clamp(0.25rem,1vh,0.5rem)]">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={loading}
                className="h-4 w-4 rounded border-[#c0c8c3] accent-[#be4d00]"
              />
              <span className={`${FLUID.label} text-[#414944]`}>Remember me</span>
            </label>
          ) : (
            <div className="flex flex-col gap-1">
              <label className="flex items-start gap-3 py-[clamp(0.25rem,1vh,0.5rem)]">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => {
                    setTermsAccepted(e.target.checked);
                    setErrors({});
                  }}
                  disabled={loading}
                  className="mt-1 h-5 w-5 shrink-0 rounded border-[#c0c8c3] accent-[#be4d00]"
                />
                <span className={`${FLUID.label} font-medium text-[#414944]`}>
                  I agree to the{" "}
                  <Link href="/terms" className="text-[#0f1621] underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-[#0f1621] underline">
                    Privacy Policy
                  </Link>
                  .
                </span>
              </label>
              {errors.terms && <p className="text-xs text-red-500">{errors.terms}</p>}
            </div>
          )}

          <motion.button
            whileHover={shouldReduceMotion || loading ? undefined : { y: -1 }}
            whileTap={shouldReduceMotion || loading ? undefined : { scale: 0.98 }}
            type="submit"
            disabled={loading}
            className={`flex w-full items-center justify-center gap-2 rounded-xl bg-[#be4d00] text-white transition-colors hover:bg-[#a54300] disabled:opacity-70 ${FLUID.buttonPad} ${FLUID.buttonText}`}
          >
            {loading ? (
              <>
                <Spinner /> {isSignIn ? "Signing in…" : "Creating account…"}
              </>
            ) : isSignIn ? (
              "Sign in"
            ) : (
              "Create an account"
            )}
          </motion.button>
          </motion.div>
        </AnimatePresence>
        </motion.form>

        <div className="flex flex-col items-center py-[clamp(0.5rem,1.6vh,1rem)]">
          <p className={`${FLUID.label} font-light text-[#414944]`}>
            {isSignIn ? (
              <>
                New?{" "}
                <button type="button" onClick={() => switchMode("signup")} className="font-medium text-[#fb7933] underline">
                  Sign Up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button type="button" onClick={() => switchMode("signin")} className="font-medium text-[#fb7933] underline">
                  Sign In
                </button>
              </>
            )}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );

  return (
    <div className="grid h-screen w-full grid-cols-2 overflow-hidden bg-[#fcf9f8]">
      {isSignIn ? (
        <>
          {heroPanel}
          {formPanel}
        </>
      ) : (
        <>
          {formPanel}
          {heroPanel}
        </>
      )}
    </div>
  );
}
