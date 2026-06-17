/** Compare phone numbers by last 10 digits (India-friendly). */
export const normalizePhone = (phone: string): string =>
  phone.replace(/\D/g, '').slice(-10);

export const phonesMatch = (a: string, b: string): boolean =>
  normalizePhone(a) === normalizePhone(b) && normalizePhone(a).length >= 10;

/** Format to E.164 (defaults to India +91 for 10-digit numbers). */
export const toE164 = (phone: string, defaultCountryCode = '91'): string => {
  const trimmed = phone.trim();
  const digits = trimmed.replace(/\D/g, '');

  if (trimmed.startsWith('+')) {
    return `+${digits}`;
  }
  if (digits.length === 10) {
    return `+${defaultCountryCode}${digits}`;
  }
  if (digits.length === 12 && digits.startsWith('91')) {
    return `+${digits}`;
  }
  return `+${digits}`;
};
