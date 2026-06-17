import mongoose, { Document, Schema } from 'mongoose';

export interface IAppConfig extends Document {
  key: string;
  value: Record<string, unknown>;
  updatedAt: Date;
}

const appConfigSchema = new Schema<IAppConfig>(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    value: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  { timestamps: true }
);

export const AppConfig = mongoose.model<IAppConfig>('AppConfig', appConfigSchema);
