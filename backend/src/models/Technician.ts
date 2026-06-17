import mongoose, { Document, Schema } from 'mongoose';

export interface ITechnician extends Document {
  userId: mongoose.Types.ObjectId;
  employeeId: string;
  specializations: string[];
  isAvailable: boolean;
  currentLocation?: {
    lat: number;
    lng: number;
  };
  serviceArea: string[];
  totalJobsCompleted: number;
  rating: number;
  ratingCount: number;
  bloodGroup?: string;
  emergencyContact?: string;
  joinedAt: Date;
}

const technicianSchema = new Schema<ITechnician>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    employeeId: {
      type: String,
      unique: true,
      required: true,
    },
    specializations: [
      {
        type: String,
        enum: ['general', 'inspection', 'installation', 'emergency', 'amplifier', 'speaker'],
      },
    ],
    isAvailable: {
      type: Boolean,
      default: true,
    },
    currentLocation: {
      lat: Number,
      lng: Number,
    },
    serviceArea: [String],
    totalJobsCompleted: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    ratingCount: {
      type: Number,
      default: 0,
    },
    bloodGroup: String,
    emergencyContact: String,
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const Technician = mongoose.model<ITechnician>('Technician', technicianSchema);
