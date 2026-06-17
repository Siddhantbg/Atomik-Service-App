const BRAND = 'ATOMIK';
const BRAND_COLOR = '#E50914';
const BG = '#0A0A0A';
const CARD = '#141414';
const TEXT = '#F5F5F5';
const MUTED = '#9CA3AF';

function layout(title: string, bodyHtml: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:${BG};font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:${BG};padding:32px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:560px;background:${CARD};border-radius:12px;overflow:hidden;">
        <tr><td style="background:${BRAND_COLOR};padding:20px 24px;">
          <h1 style="margin:0;color:#fff;font-size:22px;letter-spacing:2px;">${BRAND}</h1>
          <p style="margin:6px 0 0;color:#ffe0e0;font-size:12px;">Precision Audio Service</p>
        </td></tr>
        <tr><td style="padding:28px 24px;color:${TEXT};">
          <h2 style="margin:0 0 16px;color:${TEXT};font-size:18px;">${title}</h2>
          ${bodyHtml}
        </td></tr>
        <tr><td style="padding:16px 24px;border-top:1px solid #222;color:${MUTED};font-size:11px;">
          © ${new Date().getFullYear()} ${BRAND}. This is an automated message — please do not reply.
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function row(label: string, value: string): string {
  return `<tr>
    <td style="padding:8px 0;color:${MUTED};font-size:13px;width:42%;">${label}</td>
    <td style="padding:8px 0;color:${TEXT};font-size:13px;font-weight:600;">${value}</td>
  </tr>`;
}

function money(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function welcomeEmailHtml(name: string, email: string): string {
  const body = `
    <p style="color:${MUTED};font-size:14px;line-height:1.6;margin:0 0 20px;">
      Hi <strong style="color:${TEXT};">${name}</strong>, your ${BRAND} account is ready.
      You can now book audio service visits, track technicians, and manage payments from the app.
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px;">
      ${row('Email', email)}
      ${row('Status', 'Active')}
    </table>
    <p style="color:${MUTED};font-size:13px;line-height:1.6;margin:0;">
      Log in with your email, phone number, and password to get started.
    </p>`;
  return layout('Account created successfully', body);
}

export function welcomeEmailText(name: string, email: string): string {
  return `Hi ${name},

Your ATOMIK account was created successfully.

Email: ${email}
Status: Active

Log in with your email, phone number, and password to get started.

— ATOMIK Precision Audio Service`;
}

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

export function orderDetailsEmailHtml(data: OrderEmailData): string {
  const body = `
    <p style="color:${MUTED};font-size:14px;line-height:1.6;margin:0 0 20px;">
      Hi <strong style="color:${TEXT};">${data.clientName}</strong>, here are your order details.
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
      ${row('Booking ID', data.bookingId)}
      ${row('Service', data.serviceType)}
      ${row('Venue', data.venueArea ? `${data.venueName}, ${data.venueArea}` : data.venueName)}
      ${row('Scheduled', `${data.scheduledDate} · ${data.scheduledTime}`)}
      ${row('Invoice', data.invoiceNumber)}
      ${row('Payment', data.paymentStatus)}
    </table>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#1a1a1a;border-radius:8px;padding:4px 12px;">
      ${row('Service charges', money(data.serviceCharges))}
      ${row('Technician charges', money(data.technicianCharges))}
      ${row('Spare parts', money(data.spareParts))}
      ${row('GST (18%)', money(data.taxAmount))}
      <tr>
        <td style="padding:12px 0;color:${MUTED};font-size:14px;border-top:1px solid #333;">Total</td>
        <td style="padding:12px 0;color:${BRAND_COLOR};font-size:16px;font-weight:700;border-top:1px solid #333;">${money(data.totalAmount)}</td>
      </tr>
    </table>
    <p style="color:${MUTED};font-size:13px;line-height:1.6;margin:20px 0 0;">
      Complete payment in the app to confirm your booking. Track your service from the Home tab.
    </p>`;
  return layout('Order details', body);
}

export function orderDetailsEmailText(data: OrderEmailData): string {
  return `Hi ${data.clientName},

Your ATOMIK order details:

Booking ID: ${data.bookingId}
Service: ${data.serviceType}
Venue: ${data.venueArea ? `${data.venueName}, ${data.venueArea}` : data.venueName}
Scheduled: ${data.scheduledDate} · ${data.scheduledTime}
Invoice: ${data.invoiceNumber}
Payment: ${data.paymentStatus}

Service charges: ${money(data.serviceCharges)}
Technician charges: ${money(data.technicianCharges)}
Spare parts: ${money(data.spareParts)}
GST (18%): ${money(data.taxAmount)}
Total: ${money(data.totalAmount)}

Complete payment in the app to confirm your booking.

— ATOMIK Precision Audio Service`;
}
