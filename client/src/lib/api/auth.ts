import { apiPost } from "@/lib/api/client";
import type { ApiUser, AuthTokens } from "@/lib/api/types";

export interface RegisterPayload {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  roles: string[];
}

export function register(payload: RegisterPayload) {
  return apiPost<{ user: ApiUser }>("/auth/register", payload, false);
}

export function login(email: string, password: string) {
  return apiPost<AuthTokens & { user: ApiUser }>("/auth/login", { email, password }, false);
}

export function verifyOtp(email: string, otp: string, purpose: "email_verification" | "password_reset") {
  return apiPost<{ user: ApiUser }>("/auth/verify-otp", { email, otp, purpose }, false);
}

export function resendOtp(email: string, purpose: "email_verification" | "password_reset") {
  return apiPost<null>("/auth/resend-otp", { email, purpose }, false);
}

export function forgotPassword(email: string) {
  return apiPost<null>("/auth/forgot-password", { email }, false);
}

export function resetPassword(email: string, otp: string, newPassword: string) {
  return apiPost<null>("/auth/reset-password", { email, otp, newPassword }, false);
}

export function logout(sessionId?: string) {
  return apiPost<null>("/auth/logout", sessionId ? { sessionId } : {});
}
