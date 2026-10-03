import { apiRequest, clearCsrfToken } from "@/lib/api";
import type { CurrentUser } from "@/types/user";

export function register(input: { username: string; primaryContact: string; email: string; password: string }) {
  return apiRequest("/auth/register", { method: "POST", body: input });
}

export function verifyOtp(input: { email: string; otp: string }) {
  return apiRequest("/auth/verify", { method: "POST", body: input });
}

export function resendOtp(input: { email: string }) {
  return apiRequest("/auth/resend-otp", { method: "POST", body: input });
}

export async function login(input: { email?: string; phone?: string; password: string }) {
  await apiRequest("/auth/login", { method: "POST", body: input });
  clearCsrfToken(); // token is bound to the signed-in user
}

export function getMe() {
  return apiRequest<CurrentUser>("/auth/me");
}

export async function logout() {
  try {
    await apiRequest("/auth/logout", { method: "POST" });
  } finally {
    clearCsrfToken();
  }
}
