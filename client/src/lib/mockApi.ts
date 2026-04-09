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
