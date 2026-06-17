import mongoose from 'mongoose';
import { AdminAuditLog } from '../models/AdminAuditLog';

export async function logAdminAction(params: {
  adminId: string;
  action: string;
  targetType: string;
  targetId?: string;
  metadata?: Record<string, unknown>;
}): Promise<void> {
  try {
    await AdminAuditLog.create({
      adminId: new mongoose.Types.ObjectId(params.adminId),
      action: params.action,
      targetType: params.targetType,
      targetId: params.targetId
        ? new mongoose.Types.ObjectId(params.targetId)
        : undefined,
      metadata: params.metadata,
    });
  } catch (err) {
    console.error('[audit]', params.action, err);
  }
}
