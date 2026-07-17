type ApiResponse<T = null> = { success: true; data: T } | { success: false; message: string };

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// Simulates ~20% random failure to mimic real network conditions
const shouldFail = () => Math.random() < 0.2;

export async function mockLogin(emailOrPhone: string, password: string): Promise<ApiResponse<{ name: string }>> {
  await delay(1500);
  if (shouldFail()) return { success: false, message: "Network error. Please try again." };
  if (password.length < 8) return { success: false, message: "Invalid credentials. Please check your details." };
  return { success: true, data: { name: "User" } };
}

export async function mockRegister(fullName: string, emailOrPhone: string, password: string): Promise<ApiResponse<null>> {
  await delay(1800);
  if (shouldFail()) return { success: false, message: "Network error. Please try again." };
  if (password.length < 8) return { success: false, message: "Password must be at least 8 characters." };
  return { success: true, data: null };
}

export async function mockForgotPassword(emailOrPhone: string): Promise<ApiResponse<null>> {
  await delay(1200);
  if (shouldFail()) return { success: false, message: "Could not send reset link. Please try again." };
  const isEmail = emailOrPhone.includes("@");
  const isPhone = /^\d{10,}$/.test(emailOrPhone.replace(/\s/g, ""));
  if (!isEmail && !isPhone) return { success: false, message: "Please enter a valid email or phone number." };
  return { success: true, data: null };
}

export async function mockVerifyOtp(code: string, expectedLength = 6): Promise<ApiResponse<null>> {
  await delay(1200);
  if (shouldFail()) return { success: false, message: "Network error. Please try again." };
  if (code.length < expectedLength) return { success: false, message: `Enter the full ${expectedLength}-digit code.` };
  if (/^0+$/.test(code)) return { success: false, message: "Invalid or expired code. Please try again." };
  return { success: true, data: null };
}

export async function mockResendOtp(): Promise<ApiResponse<null>> {
  await delay(900);
  if (shouldFail()) return { success: false, message: "Could not resend code. Please try again." };
  return { success: true, data: null };
}

export async function mockUpdatePassword(password: string): Promise<ApiResponse<null>> {
  await delay(1500);
  if (shouldFail()) return { success: false, message: "Network error. Please try again." };
  if (password.length < 8) return { success: false, message: "Password must be at least 8 characters." };
  return { success: true, data: null };
}

export async function mockSubscribeNewsletter(email: string): Promise<ApiResponse<null>> {
  await delay(1200);
  if (shouldFail()) return { success: false, message: "Could not subscribe right now. Please try again." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return { success: false, message: "Enter a valid email address." };
  }
  return { success: true, data: null };
}
