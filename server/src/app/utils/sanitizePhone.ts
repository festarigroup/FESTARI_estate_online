import {
  parsePhoneNumberFromString,
  CountryCode,
} from "libphonenumber-js";

export const sanitizePhone = (
  phone: string,
  defaultCountry: CountryCode = "GH"
): string | null => {
  const parsed = parsePhoneNumberFromString(phone, defaultCountry);

  if (!parsed?.isValid()) {
    return null;
  }

  return parsed.number;
};