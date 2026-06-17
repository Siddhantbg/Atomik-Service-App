import { Request, Response, NextFunction } from 'express';
import { verifyWebhookSignature } from '../utils/razorpay';

export interface RazorpayWebhookRequest extends Request {
  rawBody?: Buffer;
  webhookBody?: Record<string, unknown>;
}

const WEBHOOK_BODY_MAX_BYTES = 64 * 1024;

export const captureRazorpayWebhookBody = (
  req: RazorpayWebhookRequest,
  res: Response,
  next: NextFunction
): void => {
  const chunks: Buffer[] = [];
  let totalSize = 0;
  req.on('data', (chunk: Buffer) => {
    totalSize += chunk.length;
    if (totalSize > WEBHOOK_BODY_MAX_BYTES) {
      res.status(413).json({ success: false, message: 'Webhook body too large' });
      req.destroy();
      return;
    }
    chunks.push(chunk);
  });
  req.on('end', () => {
    req.rawBody = Buffer.concat(chunks);
    try {
      req.webhookBody = JSON.parse(req.rawBody.toString('utf8')) as Record<string, unknown>;
    } catch {
      res.status(400).json({ success: false, message: 'Invalid JSON' });
      return;
    }
    next();
  });
  req.on('error', () => {
    res.status(400).json({ success: false, message: 'Could not read body' });
  });
};

export const verifyRazorpayWebhookSignature = (
  req: RazorpayWebhookRequest,
  res: Response,
  next: NextFunction
): void => {
  if (process.env.NODE_ENV === 'production' && !process.env.RAZORPAY_WEBHOOK_SECRET?.trim()) {
    res.status(503).json({ success: false, message: 'Webhook not configured' });
    return;
  }

  const signature = req.headers['x-razorpay-signature'];
  if (typeof signature !== 'string' || !req.rawBody) {
    res.status(400).json({ success: false, message: 'Missing webhook signature' });
    return;
  }

  if (!verifyWebhookSignature(req.rawBody.toString('utf8'), signature)) {
    res.status(400).json({ success: false, message: 'Invalid webhook signature' });
    return;
  }

  next();
};
