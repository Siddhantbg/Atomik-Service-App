import { sendEmailSafe } from '../services/emailService';
import { renderEmailTemplate, htmlToPlainText } from '../services/emailTemplateLoader';
import {
  dashboardLink,
  trackingLink,
  passwordResetLink,
  serviceReportLink,
} from './appLinks';

function sendTemplate(
  to: string,
  subject: string,
  templateName: string,
  variables: Record<string, string>
): void {
  const html = renderEmailTemplate(templateName, variables);
  sendEmailSafe({
    to,
    subject,
    html,
    text: htmlToPlainText(html),
  });
}

export function sendWelcomeEmail(to: string, name: string): void {
  sendTemplate(to, 'Welcome to ATOMIK — account created', 'welcome', {
    name,
    email: to,
    dashboardLink: dashboardLink(),
  });
}

export function sendBookingConfirmationEmail(
  to: string,
  data: {
    bookingId: string;
    serviceName: string;
    bookingDate: string;
    bookingTime: string;
    venue: string;
    status?: string;
  }
): void {
  sendTemplate(to, `ATOMIK booking ${data.bookingId} confirmed`, 'booking-confirmation', {
    bookingId: data.bookingId,
    serviceName: data.serviceName,
    bookingDate: data.bookingDate,
    bookingTime: data.bookingTime,
    venue: data.venue,
    status: data.status ?? 'CONFIRMED',
    trackingLink: trackingLink(data.bookingId),
  });
}

export function sendPasswordResetEmail(to: string, token: string): void {
  sendTemplate(to, 'Reset your ATOMIK password', 'password-reset', {
    resetLink: passwordResetLink(token, to),
  });
}

export function sendTechnicianAssignedEmail(
  to: string,
  data: {
    bookingId: string;
    technicianName: string;
    technicianPhone: string;
    eta: string;
  }
): void {
  sendTemplate(to, 'Technician assigned to your booking', 'technician-assigned', {
    technicianName: data.technicianName,
    technicianPhone: data.technicianPhone,
    eta: data.eta,
    trackingLink: trackingLink(data.bookingId),
  });
}

export function sendPaymentSuccessEmail(
  to: string,
  data: { transactionId: string; amount: string }
): void {
  sendTemplate(to, 'Payment successful — ATOMIK', 'payment-success', {
    transactionId: data.transactionId,
    amount: data.amount,
  });
}

export function sendServiceCompletedEmail(to: string, bookingId: string): void {
  sendTemplate(to, 'Your ATOMIK service is complete', 'service-completed', {
    reportLink: serviceReportLink(bookingId),
  });
}

/** @deprecated Use sendBookingConfirmationEmail — kept for imports during transition */
export interface OrderEmailData {
  clientName: string;
  bookingId: string;
  serviceType: string;
  venueName: string;
  venueArea?: string;
  scheduledDate: string;
  scheduledTime: string;
  invoiceNumber: string;
  serviceCharges: number;
  technicianCharges: number;
  spareParts: number;
  taxAmount: number;
  totalAmount: number;
  paymentStatus: string;
}

export function sendOrderDetailsEmail(to: string, data: OrderEmailData): void {
  const venue = data.venueArea
    ? `${data.venueName}, ${data.venueArea}`
    : data.venueName;
  sendBookingConfirmationEmail(to, {
    bookingId: data.bookingId,
    serviceName: data.serviceType,
    bookingDate: data.scheduledDate,
    bookingTime: data.scheduledTime,
    venue,
    status: data.paymentStatus.toUpperCase().includes('PEND') ? 'PENDING PAYMENT' : 'CONFIRMED',
  });
}
