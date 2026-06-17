import mongoose from 'mongoose';

export class BadRequestError extends Error {
  statusCode = 400;
  constructor(message: string) {
    super(message);
    this.name = 'BadRequestError';
  }
}

export const toObjectId = (id: unknown, label = 'id'): mongoose.Types.ObjectId => {
  const s = String(id ?? '').trim();
  if (!mongoose.Types.ObjectId.isValid(s)) {
    throw new BadRequestError(`Invalid ${label}`);
  }
  return new mongoose.Types.ObjectId(s);
};

export const escapeRegex = (input: string, maxLen = 80): string => {
  const trimmed = input.trim().slice(0, maxLen);
  return trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

export const parsePagination = (query: {
  page?: unknown;
  limit?: unknown;
}): { page: number; limit: number; skip: number } => {
  const page = Math.max(1, Math.min(500, Number(query.page) || 1));
  const limit = Math.max(1, Math.min(100, Number(query.limit) || 20));
  return { page, limit, skip: (page - 1) * limit };
};

const ROLES = new Set(['client', 'technician', 'admin']);

export const parseRole = (role: unknown): string | undefined => {
  if (role == null || role === '') return undefined;
  const r = String(role).trim().toLowerCase();
  if (!ROLES.has(r)) throw new BadRequestError('Invalid role');
  return r;
};

const BOOKING_STATUSES = new Set([
  'pending',
  'confirmed',
  'assigned',
  'en_route',
  'arrived',
  'in_progress',
  'completed',
  'cancelled',
]);

export const parseBookingStatus = (status: unknown): string | undefined => {
  if (status == null || status === '') return undefined;
  const s = String(status).trim().toLowerCase();
  if (!BOOKING_STATUSES.has(s)) throw new BadRequestError('Invalid status');
  return s;
};

const INVOICE_STATUSES = new Set(['pending', 'paid', 'overdue', 'cancelled']);

export const parseInvoiceStatus = (status: unknown): string | undefined => {
  if (status == null || status === '') return undefined;
  const s = String(status).trim().toLowerCase();
  if (!INVOICE_STATUSES.has(s)) throw new BadRequestError('Invalid status');
  return s;
};

export const parseSearch = (search: unknown): string | undefined => {
  if (search == null || search === '') return undefined;
  const s = String(search).trim();
  if (!s) return undefined;
  if (s.length > 80) throw new BadRequestError('Search query too long');
  return escapeRegex(s);
};

const VENUE_FIELDS = [
  'name',
  'address',
  'area',
  'city',
  'state',
  'pincode',
  'location',
  'audioEquipment',
] as const;

type VenueField = (typeof VENUE_FIELDS)[number];

const VENUE_STRING_MAX: Partial<Record<VenueField, number>> = {
  name: 120,
  address: 300,
  area: 120,
  city: 80,
  state: 80,
  pincode: 6,
};

export const pickVenueFields = (
  body: Record<string, unknown>
): Partial<Record<VenueField, unknown>> => {
  const out: Partial<Record<VenueField, unknown>> = {};
  for (const key of VENUE_FIELDS) {
    if (body[key] === undefined) continue;
    const raw = body[key];
    if (typeof raw === 'string') {
      const trimmed = raw.trim();
      const max = VENUE_STRING_MAX[key];
      if (max != null && trimmed.length > max) {
        throw new BadRequestError(`${key} is too long`);
      }
      out[key] = trimmed;
      continue;
    }
    out[key] = raw;
  }
  return out;
};
