import { User, IUser } from '../models/User';
import { normalizePhone, toE164 } from './phone';

export async function findUserByLoginIdentifier(
  identifier: string
): Promise<(IUser & { password?: string }) | null> {
  const raw = identifier.trim();
  if (!raw) return null;

  if (raw.includes('@')) {
    return User.findOne({ email: raw.toLowerCase() }).select('+password');
  }

  const e164 = toE164(raw);
  const normalized = normalizePhone(raw);
  const candidates = await User.find({
    $or: [
      { phone: raw },
      { phone: e164 },
      ...(normalized.length >= 10 ? [{ phone: `+91${normalized}` }] : []),
    ],
  }).select('+password');

  return (
    candidates.find((u) => {
      if (!u.phone) return false;
      const uNorm = normalizePhone(u.phone);
      return uNorm === normalized && uNorm.length >= 10;
    }) ?? null
  );
}
