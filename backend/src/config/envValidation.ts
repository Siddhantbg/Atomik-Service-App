import { isRazorpayConfigured } from '../utils/razorpay';

const WEAK_JWT_SECRETS = new Set([
  'change_me_to_a_long_random_string',
  'your_jwt_secret',
  'secret',
]);

export function validateProductionEnv(): void {
  if (process.env.NODE_ENV !== 'production') {
    return;
  }

  const errors: string[] = [];

  const jwt = process.env.JWT_SECRET?.trim() ?? '';
  if (jwt.length < 32 || WEAK_JWT_SECRETS.has(jwt)) {
    errors.push('JWT_SECRET must be at least 32 random characters in production');
  }

  if (!isRazorpayConfigured()) {
    errors.push('RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET are required in production');
  }

  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET?.trim();
  if (!webhookSecret) {
    errors.push('RAZORPAY_WEBHOOK_SECRET is required in production');
  }

  const clientUrl = process.env.CLIENT_URL?.trim();
  if (!clientUrl || clientUrl === '*') {
    errors.push('CLIENT_URL must be set to your production app origin(s) in production');
  }

  if (errors.length > 0) {
    console.error('\n✗ Production environment validation failed:\n');
    errors.forEach((e) => console.error(`  - ${e}`));
    console.error('');
    process.exit(1);
  }
}
