const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isNonEmpty(value: string): boolean {
  return value.trim().length > 0;
}

export function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim());
}

export function isValidPhone(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 7 && digits.length <= 15;
}

export function isValidPassword(value: string): boolean {
  return value.length >= 8 && /[A-Za-z]/.test(value) && /\d/.test(value);
}

export function isCompleteOtp(otp: string[]): boolean {
  return otp.every((digit) => digit.length === 1);
}

export function validateIdentifier(value: string, method: "email" | "phone"): string | undefined {
  if (!isNonEmpty(value)) {
    return method === "email" ? "Enter your email address" : "Enter your phone number";
  }
  if (method === "email" && !isValidEmail(value)) {
    return "Enter a valid email address";
  }
  if (method === "phone" && !isValidPhone(value)) {
    return "Enter a valid phone number";
  }
  return undefined;
}

export function validatePassword(value: string): string | undefined {
  if (!isNonEmpty(value)) {
    return "Enter a password";
  }
  if (!isValidPassword(value)) {
    return "Use 8 or more characters with a mix of letters and numbers";
  }
  return undefined;
}

export function validateFullName(value: string): string | undefined {
  return isNonEmpty(value) ? undefined : "Enter your full name";
}
