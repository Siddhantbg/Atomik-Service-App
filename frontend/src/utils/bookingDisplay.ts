import { Booking } from '../services/bookings';

export const formatBookingStatus = (status: string): string =>
  status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

export const getTechnicianFromBooking = (
  booking: Booking
): { name: string; phone?: string } | null => {
  const tech = booking.technicianId;
  if (!tech || typeof tech === 'string') return null;
  if (!tech.name) return null;
  return { name: tech.name, phone: tech.phone };
};

export const hasAssignedTechnician = (booking: Booking): boolean =>
  getTechnicianFromBooking(booking) !== null;
