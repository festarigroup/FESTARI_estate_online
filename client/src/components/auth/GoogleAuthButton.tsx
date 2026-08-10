"use client";

import { useCallback, useRef, useState } from "react";
import Script from "next/script";
import { useAuth } from "@/context/AuthContext";
import { ApiError } from "@/lib/api/client";
import type { ApiUser } from "@/lib/api/types";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

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

/** Renders Google's own "Sign in with Google" button and wires its credential response to our backend. */
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
      width: 320,
      text,
    });
  }, [handleCredential, text]);

  if (!GOOGLE_CLIENT_ID) return null;

  return (
    <>
      <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" onReady={renderButton} />
      <div ref={buttonRef} className="flex w-full justify-center" />
    </>
  );
}
