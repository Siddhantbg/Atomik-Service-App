import mongoose from 'mongoose';
import { Invoice, IInvoice } from '../models/Invoice';
import { Booking } from '../models/Booking';
import { Notification } from '../models/Notification';
import { User } from '../models/User';
import { notifyByRoles } from '../utils/notifyUsers';
import { sendPaymentSuccessEmail } from '../utils/sendEmails';
import { toObjectId } from '../utils/mongoQuery';

export interface SettlePaymentParams {
  invoiceId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  /** Required for client-initiated verify; omitted for webhook. */
  clientId?: string;
  updatedByUserId?: string;
}

/**
 * Atomically mark invoice paid only when order id matches and status is unpaid.
 */
export async function settleInvoicePayment(
  params: SettlePaymentParams
): Promise<IInvoice | null> {
  const invoiceOid = toObjectId(params.invoiceId, 'invoiceId');
  const filter: Record<string, unknown> = {
    _id: invoiceOid,
    status: { $in: ['pending', 'overdue'] },
    razorpayOrderId: params.razorpayOrderId,
  };

  if (params.clientId) {
    filter.clientId = toObjectId(params.clientId, 'clientId');
  }

  const existing = await Invoice.findOne(filter);
  if (!existing) {
    return null;
  }

  const alreadyRecorded = (existing.paymentHistory ?? []).some(
    (entry) => entry.razorpayPaymentId === params.razorpayPaymentId
  );
  if (alreadyRecorded) {
    return existing;
  }

  const previousPaid = existing.amountPaid ?? 0;
  const paidNow = existing.totalAmount - previousPaid;
  const paidAt = new Date();
  const paymentType =
    previousPaid > 0
      ? 'extra_parts'
      : (existing.spareParts ?? 0) > 0
        ? 'full'
        : 'base_service';

  const invoice = await Invoice.findByIdAndUpdate(
    existing._id,
    {
      $set: {
        status: 'paid',
        amountPaid: existing.totalAmount,
        paidAt,
        razorpayPaymentId: params.razorpayPaymentId,
      },
      $push: {
        paymentHistory: {
          amount: paidNow,
          type: paymentType,
          paidAt,
          razorpayOrderId: params.razorpayOrderId,
          razorpayPaymentId: params.razorpayPaymentId,
        },
      },
    },
    { new: true }
  );

  if (!invoice) {
    return null;
  }

  const notifyUserId = invoice.clientId;
  const updatedBy =
    params.updatedByUserId && mongoose.Types.ObjectId.isValid(params.updatedByUserId)
      ? new mongoose.Types.ObjectId(params.updatedByUserId)
      : invoice.clientId;

  if (invoice.bookingId) {
    const booking = await Booking.findById(invoice.bookingId).select('status');
    const activeStatuses = [
      'technician_assigned',
      'en_route',
      'arrived',
      'in_progress',
      'completed',
    ];
    const isExtraPartsPayment = paymentType === 'extra_parts';
    const historyEntry = {
      status: 'confirmed',
      timestamp: new Date(),
      notes: isExtraPartsPayment
        ? undefined
        : `Payment received — ₹${paidNow.toLocaleString('en-IN')}`,
      updatedBy,
    };

    if (isExtraPartsPayment || (booking && activeStatuses.includes(booking.status))) {
      // Extra parts / in-progress job: do not add timeline noise; spare parts stay on invoice only.
    } else if (booking?.status === 'pending') {
      await Booking.findByIdAndUpdate(invoice.bookingId, {
        status: 'confirmed',
        $push: { statusHistory: historyEntry },
      });
    } else if (!isExtraPartsPayment) {
      await Booking.findByIdAndUpdate(invoice.bookingId, {
        $push: { statusHistory: historyEntry },
      });
    }
  }

  await Notification.create({
    userId: notifyUserId,
    title: 'Payment Successful',
    body: `Payment of ₹${paidNow.toLocaleString('en-IN')} for invoice ${invoice.invoiceNumber} confirmed.`,
    type: 'success',
    category: 'payment',
  });

  await notifyByRoles(['admin'], {
    title: 'Payment received',
    body: `Invoice ${invoice.invoiceNumber} paid — ₹${invoice.totalAmount.toLocaleString('en-IN')}. Booking ready to assign.`,
    type: 'success',
    category: 'payment',
    data: { invoiceId: invoice._id, bookingId: invoice.bookingId },
  });

  const client = await User.findById(invoice.clientId).select('email');
  if (client?.email) {
    sendPaymentSuccessEmail(client.email, {
      transactionId: params.razorpayPaymentId,
      amount: invoice.totalAmount.toLocaleString('en-IN'),
    });
  }

  return invoice;
}
