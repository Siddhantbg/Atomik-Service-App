/** Bookable time slots (IST labels — normalized with `normalizeScheduledTime`). */
export const BOOKING_TIME_SLOTS = [
  '09:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '02:00 PM',
  '03:00 PM',
  '04:00 PM',
  '05:00 PM',
] as const;

export type BookingTimeSlot = (typeof BOOKING_TIME_SLOTS)[number];

export const SLOT_HOLD_DURATION_MS = 5 * 60 * 1000;

export const isValidBookingTimeSlot = (time: string): boolean => {
  const cleaned = time.replace(/\s*IST\s*$/i, '').trim();
  return (BOOKING_TIME_SLOTS as readonly string[]).includes(cleaned);
};
