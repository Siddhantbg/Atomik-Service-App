import mongoose from 'mongoose';

type BookingLike = {
  technicianId?: mongoose.Types.ObjectId | { _id?: mongoose.Types.ObjectId; id?: string } | string | null;
  assignedTechnicianId?: mongoose.Types.ObjectId | string | null;
};

export const resolveTechnicianId = (booking: BookingLike): string | null => {
  const raw = booking.technicianId ?? booking.assignedTechnicianId;
  if (raw == null || raw === '') return null;
  if (typeof raw === 'object') {
    const id = '_id' in raw ? raw._id : 'id' in raw ? raw.id : null;
    return id ? String(id) : null;
  }
  return String(raw);
};

export const isJobOpenForPool = (booking: BookingLike): boolean =>
  resolveTechnicianId(booking) === null;

export const openJobFilter = {
  $and: [
    {
      $or: [
        { technicianId: null },
        { technicianId: { $exists: false } },
      ],
    },
    {
      $or: [
        { assignedTechnicianId: null },
        { assignedTechnicianId: { $exists: false } },
      ],
    },
  ],
};

const NON_ASSIGNABLE_STATUSES = new Set(['completed', 'cancelled']);

/** Jobs in these states cannot be assigned or reassigned. */
export const isBookingAssignable = (status: string): boolean =>
  !NON_ASSIGNABLE_STATUSES.has(status);
