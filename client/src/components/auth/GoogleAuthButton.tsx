"use client";

import { useCallback, useRef, useState } from "react";
import Script from "next/script";
import { useAuth } from "@/context/AuthContext";
import { ApiError } from "@/lib/api/client";
import { cn } from "@/lib/cn";
import type { ApiUser } from "@/lib/api/types";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
// Matches this card's own inner content width (max-w-sm = 384px, minus
// p-8's 32px on each side = 320px) — Google's `renderButton` wants a literal
// pixel width, not "100%".
const BUTTON_WIDTH = 320;
const BUTTON_HEIGHT = 44;

interface GoogleCredentialResponse {
  credential: string;
}

interface GoogleIdentityServices {
  accounts: {
    id: {
      initialize: (config: {
        client_id: string;
        callback: (response: GoogleCredentialResponse) => void;
      }) => void;
      renderButton: (
        parent: HTMLElement,
        options: {
          type: "standard";
          theme: "outline" | "filled_black" | "filled_blue";
          size: "large" | "medium" | "small";
          width: number;
          text: "signin_with" | "signup_with" | "continue_with";
        },
      ) => void;
    };
  };
}

declare global {
  interface Window {
    google?: GoogleIdentityServices;
  }
}

interface GoogleAuthButtonProps {
  text?: "signin_with" | "signup_with" | "continue_with";
  /** Called once the account is authenticated — `user.roles` may still be empty for a brand-new Google account. */
  onSuccess: (user: ApiUser) => void;
  onError?: (message: string) => void;
}

/** Google's own official four-color "G" mark (from their branding
 * guidelines) — a "Sign in with Google" button has to carry their actual
 * logo to read as legitimate rather than a generic colored circle, even
 * though everything else about the button is this app's own styling. */
function GoogleGIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 18 18" aria-hidden="true" {...props}>
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.874 2.684-6.615Z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"
      />
      <path
        fill="#FBBC05"
        d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z"
      />
    </svg>
  );
}

/**
 * A custom-styled "Sign in/up with Google" button.
 *
 * Google's own `renderButton()` output is a cross-origin iframe — there's
 * no CSS that reaches inside it, and no way to dispatch a synthetic click
 * on it from our own JS (browsers block that for cross-origin frames on
 * purpose). The only thing that actually works, and the approach Google's
 * own docs point to for a fully custom button, is layering our own
 * decorative button *underneath* the real one rendered fully transparent
 * on top at the same size — a real physical click always lands on
 * whichever element is actually on top, so it reaches Google's real
 * button, while what the user *sees* is ours.
 */
export function GoogleAuthButton({ text = "continue_with", onSuccess, onError }: GoogleAuthButtonProps) {
  const { loginWithGoogle } = useAuth();
  const buttonRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);
  const busyRef = useRef(busy);
  // eslint-disable-next-line react-hooks/refs
  busyRef.current = busy;

  const handleCredential = useCallback(
    (response: GoogleCredentialResponse) => {
      if (busyRef.current) return;
      setBusy(true);
      loginWithGoogle(response.credential)
        .then(onSuccess)
        .catch((err) => {
          const message = err instanceof ApiError ? err.message : "Couldn't sign you in with Google.";
          onError?.(message);
        })
        .finally(() => setBusy(false));
    },
    [loginWithGoogle, onSuccess, onError],
  );

  const renderButton = useCallback(() => {
    if (!GOOGLE_CLIENT_ID || !window.google || !buttonRef.current) return;
    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleCredential,
    });
    buttonRef.current.innerHTML = "";
    window.google.accounts.id.renderButton(buttonRef.current, {
      type: "standard",
      theme: "outline",
      size: "large",
      width: BUTTON_WIDTH,
      text,
    });
  }, [handleCredential, text]);

  if (!GOOGLE_CLIENT_ID) return null;

  return (
    <div className="relative mx-auto" style={{ width: BUTTON_WIDTH }}>
      <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" onReady={renderButton} />

      {/* Decorative only (aria-hidden, pointer-events-none) — this app's
          own border/radius/font tokens instead of Google's default white
          pill, sitting beneath the real button so it's never what actually
          receives the click. */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 z-0 flex items-center justify-center gap-3 rounded-lg border border-border-subtle bg-white text-sm font-semibold text-ink transition-opacity",
          busy && "opacity-60",
        )}
      >
        <GoogleGIcon className="size-[18px]" />
        {text === "signup_with" ? "Sign up with Google" : "Sign in with Google"}
      </div>

      {/* The real Google button — fully transparent, same footprint,
          stacked on top (z-10) so it's what actually captures the click. */}
      <div
        ref={buttonRef}
        className="relative z-10 overflow-hidden opacity-0"
        style={{ width: BUTTON_WIDTH, height: BUTTON_HEIGHT }}
      />
    </div>
  );
}
