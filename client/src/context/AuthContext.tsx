"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import * as authApi from "@/lib/api/auth";
import { getCurrentUser, setUserRole } from "@/lib/api/users";
import { clearTokens, getAccessToken, setTokens } from "@/lib/api/tokens";
import type { ApiUser } from "@/lib/api/types";

interface AuthContextValue {
  user: ApiUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: (idToken: string) => Promise<ApiUser>;
  register: (payload: authApi.RegisterPayload) => Promise<void>;
  verifyOtp: (email: string, otp: string) => Promise<void>;
  setRole: (role: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<ApiUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    if (!getAccessToken()) {
      setUser(null);
      return;
    }
    try {
      const { user: current } = await getCurrentUser();
      setUser(current);
    } catch {
      clearTokens();
      setUser(null);
    }
  }, []);

  useEffect(() => {
    refreshUser().finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function login(email: string, password: string) {
    const result = await authApi.login(email, password);
    setTokens(result.accessToken, result.refreshToken);
    setUser(result.user);
  }

  async function loginWithGoogle(idToken: string) {
    const result = await authApi.googleLogin(idToken);
    setTokens(result.accessToken, result.refreshToken);
    setUser(result.user);
    return result.user;
  }

  async function register(payload: authApi.RegisterPayload) {
    await authApi.register(payload);
  }

  async function setRole(role: string) {
    const { user: updated } = await setUserRole(role);
    setUser(updated);
  }

  async function verifyOtp(email: string, otp: string) {
    await authApi.verifyOtp(email, otp, "email_verification");
  }

  async function logout() {
    try {
      await authApi.logout();
    } catch {
      // token may already be invalid — clear local state regardless
    }
    clearTokens();
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, login, loginWithGoogle, register, verifyOtp, setRole, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
