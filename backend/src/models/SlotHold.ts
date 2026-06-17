import mongoose, { Document, Schema } from 'mongoose';

export interface ISlotHold extends Document {
  clientId: mongoose.Types.ObjectId;
  scheduledDate: string;
  scheduledTime: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const slotHoldSchema = new Schema<ISlotHold>(
  {
    clientId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    scheduledDate: { type: String, required: true },
    scheduledTime: { type: String, required: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

slotHoldSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
slotHoldSchema.index({ scheduledDate: 1, scheduledTime: 1 });

export const SlotHold = mongoose.model<ISlotHold>('SlotHold', slotHoldSchema);
