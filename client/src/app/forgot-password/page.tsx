"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { mockForgotPassword } from "@/lib/mockApi";

function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4 text-white inline-block" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  );
}

export default function ForgotPasswordPage() {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrPhone.trim()) { setError("This field is required."); return; }
    setError("");
    setLoading(true);
    try {
      const res = await mockForgotPassword(emailOrPhone);
      if (res.success) {
        toast.success("Reset link sent! Check your inbox.");
        setShowModal(true);
      } else {
        toast.error(res.message);
        setError(res.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="relative bg-white rounded-lg shadow-sm py-8 px-30 w-full h-fit">
        <div className="space-y-6 flex flex-col items-center">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">Forgot your password?</h1>
            <p className="text-sm text-gray-600">
              Enter your email or phone number and we&apos;ll help you reset your password.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 flex flex-col items-center">
            <div>
              <label htmlFor="emailOrPhone" className="block text-sm font-medium text-gray-700 mb-1">
                Email or Phone Number
              </label>
              <input
                type="text"
                id="emailOrPhone"
                value={emailOrPhone}
                onChange={(e) => { setEmailOrPhone(e.target.value); setError(""); }}
                className={`block w-62.5 px-3 py-2 border focus:outline-none focus:ring-[#BE4D00] focus:border-[#BE4D00] text-sm ${error ? "border-red-500" : "border-black"}`}
                placeholder="name@example.com"
                disabled={loading}
              />
              {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
            </div>

            <button
              type="submit"
              disabled={!emailOrPhone.trim() || loading}
              className={`w-62.5 py-2 px-4 text-sm font-medium focus:outline-none flex items-center justify-center gap-2 ${emailOrPhone.trim() && !loading ? "bg-[#BE4D00] text-white hover:bg-orange-700" : "bg-gray-200 text-gray-500 cursor-not-allowed"}`}
            >
              {loading ? <><Spinner /> Sending…</> : "Reset password"}
            </button>
          </form>
        </div>

        {showModal && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="bg-white w-full max-w-md rounded-md shadow-lg p-6 space-y-4">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="flex items-center text-sm text-gray-700 hover:text-gray-900"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
                Back
              </button>

              <div className="text-center space-y-2">
                <div className="flex justify-center mb-2">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Check your inbox</h3>
                <p className="text-sm text-gray-700">
                  A reset link has been sent to <span className="font-semibold">{emailOrPhone}</span>.<br />
                  Kindly follow the instructions to reset your password.
                </p>
              </div>

              <Link
                href="/login"
                className="block w-full py-3 bg-[#BE4D00] text-white text-center font-semibold text-sm hover:bg-orange-700 focus:outline-none"
              >
                Back to login
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
