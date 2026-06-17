/** Shared max lengths for request validation (characters unless noted). */
export const INPUT_LIMITS = {
  name: 120,
  email: 254,
  phone: 20,
  password: 128,
  identifier: 254,
  otp: 6,
  token: 256,
  fcmToken: 512,
  serviceType: 64,
  notes: 4000,
  technicianNotes: 4000,
  addressLine: 300,
  city: 80,
  state: 80,
  area: 120,
  pincode: 6,
  venueName: 120,
  invoiceId: 32,
  razorpayId: 128,
  razorpaySignature: 256,
  sparePartsMaxItems: 50,
  sparePartName: 120,
  sparePartCost: 12,
  searchQuery: 80,
  jsonBodyMaxKeys: 60,
  jsonBodyMaxDepth: 8,
  jsonBodyMaxArrayLength: 100,
} as const;

export const BOOKING_STATUS_VALUES = [
  'pending',
  'confirmed',
  'technician_assigned',
  'en_route',
  'arrived',
  'in_progress',
  'completed',
  'cancelled',
] as const;

export const SERVICE_TYPE_VALUES = [
  'general',
  'inspection',
  'installation',
  'emergency',
] as const;
