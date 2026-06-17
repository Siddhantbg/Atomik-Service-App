import mongoose, { Document, Schema } from 'mongoose';

export interface IVenue extends Document {
  name: string;
  address: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
  location?: { lat: number; lng: number };
  ownerId: mongoose.Types.ObjectId;
  audioEquipment?: string[];
  isActive: boolean;
}

const venueSchema = new Schema<IVenue>(
  {
    name: { type: String, required: true, trim: true },
    address: { type: String, required: true },
    area: { type: String, required: true },
    city: { type: String, required: true, default: 'Bengaluru' },
    state: { type: String, required: true, default: 'Karnataka' },
    pincode: { type: String, required: true },
    location: {
      lat: Number,
      lng: Number,
    },
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    audioEquipment: [String],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, strict: true }
);

export const Venue = mongoose.model<IVenue>('Venue', venueSchema);
