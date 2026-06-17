import mongoose from 'mongoose';
import { migrateBookings } from '../utils/migrateBookings';

mongoose.set('strictQuery', true);

export const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error(
      'MONGODB_URI is not defined. Add it to backend/.env (see backend/.env.example).'
    );
  }

  if (uri.includes('localhost') && !uri.includes('127.0.0.1')) {
    console.warn('⚠ Using local MongoDB. For Atlas, set MONGODB_URI in backend/.env');
  }

  try {
    await mongoose.connect(uri);
    await migrateBookings();
    const dbName = mongoose.connection.db?.databaseName ?? 'unknown';
    console.log(`✓ MongoDB connected (database: ${dbName})`);
  } catch (error) {
    console.error('✗ MongoDB connection failed:', error);
    console.error(
      '\n── Fix (MongoDB Atlas) ──────────────────────────────────────\n' +
        '  1. Open https://cloud.mongodb.com → your cluster\n' +
        '  2. Network Access → Add IP Address\n' +
        '  3. Click "Add Current IP Address" (or 0.0.0.0/0 for dev only)\n' +
        '  4. Wait ~1 minute, then restart: npm run dev\n' +
        '────────────────────────────────────────────────────────────\n'
    );
    try {
      const res = await fetch('https://api.ipify.org?format=json');
      const data = (await res.json()) as { ip?: string };
      if (data.ip) {
        console.error(`  Whitelist this public IP in Atlas: ${data.ip}\n`);
      }
    } catch {
      /* ignore */
    }
    process.exit(1);
  }
};

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected');
});
