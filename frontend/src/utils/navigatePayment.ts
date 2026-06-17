import { Booking, BookingInvoice } from '../services/bookings';
import { isExtraPartsOnlyPayment } from './invoice';

export function navigateToBookingPayment(
  navigation: { navigate: (screen: string, params: object) => void },
  booking: Booking,
  invoice?: BookingInvoice | null
) {
  const invoiceId = invoice?._id;
  if (!invoiceId) return;

  navigation.navigate('Payment', {
    bookingId: booking._id,
    invoiceId,
    serviceType: booking.serviceType,
    date: booking.scheduledDate,
    time: booking.scheduledTime,
    payFor: isExtraPartsOnlyPayment(invoice, booking.spareParts)
      ? 'extra_parts'
      : 'full',
  });
}
