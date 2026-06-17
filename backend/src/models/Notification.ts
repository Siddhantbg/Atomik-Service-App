import mongoose, { Document, Schema } from 'mongoose';

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  body: string;
  type: 'info' | 'warning' | 'success' | 'error';
  category: 'booking' | 'payment' | 'technician' | 'system';
  isRead: boolean;
  data?: Record<string, any>;
}

const notificationSchema = new Schema<INotification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    body: { type: String, required: true },
    type: {
      type: String,
      enum: ['info', 'warning', 'success', 'error'],
      default: 'info',
    },
    category: {
      type: String,
      enum: ['booking', 'payment', 'technician', 'system'],
      default: 'system',
    },
    isRead: { type: Boolean, default: false },
    data: Schema.Types.Mixed,
  },
  { timestamps: true }
);

notificationSchema.index({ userId: 1, isRead: 1 });
notificationSchema.index({ createdAt: -1 });

export const Notification = mongoose.model<INotification>('Notification', notificationSchema);
