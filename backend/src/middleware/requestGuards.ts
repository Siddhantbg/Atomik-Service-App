import { Request, Response, NextFunction, RequestHandler } from 'express';
import mongoose from 'mongoose';
import { INPUT_LIMITS } from '../config/inputLimits';

function countKeys(value: unknown, depth: number): number {
  if (value == null || typeof value !== 'object') return 0;
  if (depth > INPUT_LIMITS.jsonBodyMaxDepth) {
    throw new Error('Payload is nested too deeply');
  }
  if (Array.isArray(value)) {
    if (value.length > INPUT_LIMITS.jsonBodyMaxArrayLength) {
      throw new Error('Array in request body is too large');
    }
    return value.reduce((sum, item) => sum + countKeys(item, depth + 1), 0);
  }
  const entries = Object.entries(value as Record<string, unknown>);
  if (entries.length > INPUT_LIMITS.jsonBodyMaxKeys) {
    throw new Error('Request body has too many fields');
  }
  return entries.reduce(
    (sum, [, v]) => sum + 1 + countKeys(v, depth + 1),
    0
  );
}

/** Reject deeply nested, oversized, or non-object JSON bodies before handlers run. */
export const guardRequestBodyShape: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS') {
    next();
    return;
  }

  const body = req.body;
  if (body == null || body === '') {
    next();
    return;
  }

  if (typeof body !== 'object' || Array.isArray(body)) {
    res.status(400).json({ success: false, message: 'Request body must be a JSON object' });
    return;
  }

  try {
    countKeys(body, 0);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err instanceof Error ? err.message : 'Malformed request body',
    });
    return;
  }

  next();
};

export const validateObjectIdParam =
  (paramName = 'id'): RequestHandler =>
  (req: Request, res: Response, next: NextFunction): void => {
    const raw = req.params[paramName];
    if (!raw || !mongoose.Types.ObjectId.isValid(String(raw))) {
      res.status(400).json({ success: false, message: `Invalid ${paramName}` });
      return;
    }
    next();
  };
