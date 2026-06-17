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

export type SlotStatus = 'available' | 'booked' | 'held_by_you' | 'held_by_other';

export interface SlotAvailabilityItem {
  time: string;
  status: SlotStatus;
  expiresAt?: string;
  secondsRemaining?: number;
}

export interface SlotHoldInfo {
  scheduledDate: string;
  scheduledTime: string;
  displayTime: string;
  expiresAt: string;
  secondsRemaining: number;
}
