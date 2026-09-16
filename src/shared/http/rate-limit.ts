import type { NextFunction, Request, Response } from 'express';

import { getEnv } from '../../config/env.js';
import { AppError } from './errors.js';

type Bucket = {
  count: number;
  expiresAt: number;
};

const buckets = new Map<string, Bucket>();

function getKey(request: Request): string {
  const apiKey = request.header('x-api-key');
  const authHeader = request.header('authorization');
  const ip = request.ip ?? request.socket.remoteAddress ?? 'unknown';
  return `${request.method}:${request.path}:${apiKey ?? authHeader ?? ip}`;
}

export function rateLimitMiddleware(request: Request, _response: Response, next: NextFunction) {
  const env = getEnv();
  const now = Date.now();
  const key = getKey(request);
  const existing = buckets.get(key);

  if (!existing || existing.expiresAt <= now) {
    buckets.set(key, {
      count: 1,
      expiresAt: now + env.RATE_LIMIT_WINDOW_MS
    });
    next();
    return;
  }

  if (existing.count >= env.RATE_LIMIT_MAX_REQUESTS) {
    next(
      new AppError('RATE_LIMIT_EXCEEDED', 'Too many requests for this client and endpoint', 429, {
        windowMs: env.RATE_LIMIT_WINDOW_MS,
        maxRequests: env.RATE_LIMIT_MAX_REQUESTS
      })
    );
    return;
  }

  existing.count += 1;
  next();
}

export function resetRateLimitForTests(): void {
  buckets.clear();
}
