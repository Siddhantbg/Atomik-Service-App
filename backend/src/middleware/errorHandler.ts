import { Request, Response, NextFunction } from 'express';
import { BadRequestError } from '../utils/mongoQuery';

interface AppError extends Error {
  statusCode?: number;
  code?: number;
}

const isProduction = process.env.NODE_ENV === 'production';

export const errorHandler = (
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let statusCode = err.statusCode || 500;
  let message = 'Internal server error';

  if (err instanceof BadRequestError) {
    statusCode = 400;
    message = err.message;
  } else if (!isProduction) {
    message = err.message || message;
  }

  if (err.code === 11000) {
    statusCode = 409;
    message = 'A record with this data already exists';
  }

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = isProduction ? 'Validation failed' : err.message;
  }

  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid id';
  }

  const entityErr = err as { type?: string; status?: number };
  if (entityErr.type === 'entity.too.large') {
    statusCode = 413;
    message = 'Request body too large';
  }
  if (entityErr.type === 'entity.parse.failed') {
    statusCode = 400;
    message = 'Malformed JSON body';
  }

  if (err.name === 'StrictModeError' || err.name === 'StrictQueryError') {
    statusCode = 400;
    message = 'Invalid query';
  }

  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  const razorpayErr = err as {
    error?: { code?: string; description?: string };
    statusCode?: number;
  };
  const isRazorpayProviderError =
    razorpayErr.error?.code === 'BAD_REQUEST_ERROR' ||
    err.message?.includes('Razorpay') ||
    razorpayErr.error?.description?.includes('Authentication failed');

  if (isRazorpayProviderError) {
    statusCode = 502;
    message = isProduction
      ? 'Payment provider error'
      : razorpayErr.error?.description?.includes('Authentication failed')
        ? 'Razorpay authentication failed. Check test keys in backend/.env (dashboard.razorpay.com → Settings → API Keys).'
        : err.message || 'Payment provider error';
  } else if (!isProduction && err.message?.includes('Razorpay')) {
    statusCode = 502;
    message = err.message;
  } else if (isProduction && err.message?.includes('Razorpay')) {
    statusCode = 502;
    message = 'Payment provider error';
  }

  if (!isProduction) {
    console.error('[Error]', err);
  } else if (statusCode >= 500) {
    console.error('[Error]', err.name, statusCode);
  }

  const payload: Record<string, unknown> = {
    success: false,
    message,
  };

  if (!isProduction && err.stack) {
    payload.stack = err.stack;
  }

  res.status(statusCode).json(payload);
};
