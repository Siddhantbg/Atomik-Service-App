import { Booking } from '../services/bookings';

type TechRef = Booking['technicianId'];

export function resolveAssignedTechnicianId(job: Booking): string | null {
  const t =
    job.technicianId ??
    (job as Booking & { assignedTechnicianId?: TechRef }).assignedTechnicianId;
  if (!t) return null;
  if (typeof t === 'string') return t;
  return t._id ? String(t._id) : null;
}

export const isDeclinedByTechnician = (
  booking: Booking,
  technicianId?: string
): boolean => {
  if (!technicianId || !booking.rejectedBy?.length) return false;
  return booking.rejectedBy.some((entry) => {
    if (typeof entry === 'string') return entry === technicianId;
    return String(entry._id) === technicianId;
  });
};
