import 'dotenv/config';
import mongoose from 'mongoose';
import { sendOtpSms, clearTwilioConfigCache } from '../services/twilioSms';

const testPhone = process.argv[2] || '+919414618209';

async function main() {
  clearTwilioConfigCache();

  const uri = process.env.MONGODB_URI;
  if (uri) {
    await mongoose.connect(uri);
  }

  console.log(`Sending test OTP SMS to ${testPhone}...`);
  const code = '9414';
  await sendOtpSms(testPhone, code);
  console.log('Success — check the phone for SMS body:', code);

  if (uri) await mongoose.disconnect();
}

main().catch((err) => {
  console.error('Failed:', err instanceof Error ? err.message : err);
  process.exit(1);
});
