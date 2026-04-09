"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { mockLogin } from "@/lib/mockApi";

function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4 text-white inline-block" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ emailOrPhone?: string; password?: string }>({});

  const validateStep1 = () => {
    if (!emailOrPhone.trim()) return "Email or phone number is required.";
    return null;
  };

  const validateStep2 = () => {
    if (!password) return "Password is required.";
    if (password.length < 8) return "Password must be at least 8 characters.";
    return null;
  };

  const handleNext = () => {
    const err = validateStep1();
    if (err) { setErrors({ emailOrPhone: err }); return; }
    setErrors({});
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validateStep2();
    if (err) { setErrors({ password: err }); return; }
    setErrors({});
    setLoading(true);
    try {
      const res = await mockLogin(emailOrPhone, password);
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
  };

  return (
    <div className="bg-white rounded-lg shadow-sm py-8 px-30 w-full">
      <div className="space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-4xl font-bold text-gray-900 uppercase">Welcome Back</h1>
          <p className="text-sm text-gray-600">Login to continue with Festari Estates Online</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {step === 1 && (
            <div>
              <label htmlFor="emailOrPhone" className="block text-sm font-medium text-gray-700 mb-1">
                Email/Phone Number
              </label>
              <input
                type="text"
                id="emailOrPhone"
                value={emailOrPhone}
                onChange={(e) => { setEmailOrPhone(e.target.value); setErrors({}); }}
                className={`block w-62.5 px-3 py-2 border focus:outline-none focus:ring-[#BE4D00] focus:border-[#BE4D00] text-sm ${errors.emailOrPhone ? "border-red-500" : "border-black"}`}
                placeholder="020 000 0000"
                disabled={loading}
              />
              {errors.emailOrPhone && <p className="mt-1 text-xs text-red-500">{errors.emailOrPhone}</p>}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrors({}); }}
                  className={`block w-62.5 px-3 py-2 border focus:outline-none focus:ring-[#BE4D00] focus:border-[#BE4D00] text-sm ${errors.password ? "border-red-500" : "border-black"}`}
                  placeholder="••••••••"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password ? (
                <p className="text-xs text-red-500">{errors.password}</p>
              ) : (
                <p className="text-xs text-gray-600">at least 8 characters</p>
              )}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs text-gray-700">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 border-gray-400"
                    disabled={loading}
                  />
                  <span>Remember Me</span>
                </label>
                <Link href="/forgot-password" className="text-xs text-blue-600 hover:text-blue-800">
                  Forgot Password?
                </Link>
              </div>
            </div>
          )}

          <div className="flex justify-between gap-4">
            <button
              type="button"
              onClick={handleBack}
              disabled={loading}
              className="w-20.5 py-2 px-4 bg-white text-[#BE4D00] font-medium hover:bg-orange-700 hover:text-white focus:outline-none text-sm border-[#BE4D00] border disabled:opacity-50"
            >
              Back
            </button>

            {step === 1 ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={!emailOrPhone.trim() || loading}
                className={`w-20.5 py-2 px-4 text-sm font-medium focus:outline-none ${emailOrPhone.trim() ? "bg-[#BE4D00] text-white hover:bg-orange-700" : "bg-gray-200 text-gray-500 cursor-not-allowed"}`}
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={!password || loading}
                className={`w-20.5 py-2 px-4 text-sm font-medium focus:outline-none flex items-center justify-center gap-2 ${password && !loading ? "bg-[#BE4D00] text-white hover:bg-orange-700" : "bg-gray-200 text-gray-500 cursor-not-allowed"}`}
              >
                {loading ? <><Spinner /> Logging in…</> : "Login"}
              </button>
            )}
          </div>
        </form>

        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">or</span>
        </div>

        <div className="space-y-3 flex flex-col items-center">
          <button type="button" className="w-90.75 flex items-center justify-center gap-2 py-2 px-4 border border-[#BE4D00] bg-white text-gray-700 hover:bg-gray-50 text-sm">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Login with Google
          </button>
          <button type="button" className="w-90.75 flex items-center justify-center gap-2 py-2 px-4 border border-[#BE4D00] bg-white text-gray-700 hover:bg-gray-50 text-sm">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
            </svg>
            Login with Apple
          </button>
        </div>

        <p className="text-center text-sm text-gray-600">
          <Link href="/signup" className="text-blue-600 hover:text-blue-800">
            Don&apos;t have an account yet?
          </Link>{" "}
          Register for free
        </p>
      </div>
    </div>
  );
}
