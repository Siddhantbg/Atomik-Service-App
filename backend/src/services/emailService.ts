import { AppConfig } from '../models/AppConfig';

interface SendEmailOptions {
  to: string;
  subject: string;
  text?: string;
  html: string;
}

let cachedFrom: { email: string; name: string } | null = null;

async function resolveFromAddress(): Promise<{ email: string; name: string }> {
  if (cachedFrom) return cachedFrom;

  const seeded = (await AppConfig.findOne({ key: 'resend_email' }))?.value as
    | { fromEmail?: string; fromName?: string }
    | undefined;

  const email =
    process.env.RESEND_FROM_EMAIL?.trim() ||
    process.env.SENDGRID_FROM_EMAIL?.trim() ||
    seeded?.fromEmail;
  const name =
    process.env.RESEND_FROM_NAME?.trim() ||
    process.env.SENDGRID_FROM_NAME?.trim() ||
    seeded?.fromName ||
    'ATOMIK';

  if (!email) {
    throw new Error(
      'Email sender not configured. Set RESEND_FROM_EMAIL in backend/.env (use onboarding@resend.dev for Resend sandbox).'
    );
  }

  cachedFrom = { email, name };
  return cachedFrom;
}

function getApiKey(): string {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) {
    throw new Error('Resend is not configured. Set RESEND_API_KEY in backend/.env');
  }
  return key;
}

export async function sendEmail(options: SendEmailOptions): Promise<void> {
  const apiKey = getApiKey();
  const from = await resolveFromAddress();

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: `${from.name} <${from.email}>`,
      to: [options.to],
      subject: options.subject,
      html: options.html,
      ...(options.text ? { text: options.text } : {}),
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    console.error('[Resend] send failed:', response.status, detail);
    throw new Error('Could not send email');
  }

  if (process.env.NODE_ENV !== 'production') {
    console.log(`[Email] Sent "${options.subject}" to ${options.to}`);
  }
}

export function sendEmailSafe(options: SendEmailOptions): void {
  sendEmail(options).catch((err) => {
    console.error('[Email] Background send failed:', err instanceof Error ? err.message : err);
  });
}

export function clearEmailConfigCache(): void {
  cachedFrom = null;
}
