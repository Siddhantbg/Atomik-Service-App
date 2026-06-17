/** Public URLs for email CTAs (set APP_PUBLIC_URL in backend/.env). */
export function appPublicUrl(path = ''): string {
  const base = (
    process.env.APP_PUBLIC_URL ||
    process.env.CLIENT_URL ||
    'https://atomik.app'
  ).replace(/\/$/, '');
  if (!path) return base;
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

export function dashboardLink(): string {
  return appPublicUrl('/');
}

export function trackingLink(bookingId: string): string {
  return appPublicUrl(`/track/${encodeURIComponent(bookingId)}`);
}

export function passwordResetLink(token: string, email: string): string {
  const q = new URLSearchParams({ token, email });
  return appPublicUrl(`/reset-password?${q.toString()}`);
}

export function serviceReportLink(bookingId: string): string {
  return appPublicUrl(`/bookings/${encodeURIComponent(bookingId)}/report`);
}
