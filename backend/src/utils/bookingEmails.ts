import {
  sendTechnicianAssignedEmail,
  sendServiceCompletedEmail,
} from './sendEmails';

function clientEmail(booking: { clientId?: unknown }): string | null {
  const c = booking.clientId as { email?: string } | null | undefined;
  if (c && typeof c === 'object' && c.email) {
    return c.email;
  }
  return null;
}

export function emailTechnicianAssigned(booking: {
  bookingId: string;
  clientId?: unknown;
  technicianId?: unknown;
  scheduledDate?: Date;
  scheduledTime?: string;
}): void {
  const to = clientEmail(booking);
  if (!to) return;

  const tech = booking.technicianId as { name?: string; phone?: string } | null;

  const eta =
    booking.scheduledDate && booking.scheduledTime
      ? `${booking.scheduledDate.toLocaleDateString('en-IN')} · ${booking.scheduledTime}`
      : 'As scheduled';

  sendTechnicianAssignedEmail(to, {
    bookingId: booking.bookingId,
    technicianName: tech?.name ?? 'Your technician',
    technicianPhone: tech?.phone ?? '—',
    eta,
  });
}

export function emailServiceCompleted(booking: {
  bookingId: string;
  clientId?: unknown;
}): void {
  const to = clientEmail(booking);
  if (!to) return;
  sendServiceCompletedEmail(to, booking.bookingId);
}
