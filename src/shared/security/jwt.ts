import jwt, { type SignOptions } from 'jsonwebtoken';

import { getEnv } from '../../config/env.js';

export type SessionTokenPayload = {
  sub: string;
  email: string;
  role: 'MASTER_ADMIN';
};

export function signSessionToken(payload: SessionTokenPayload): string {
  const env = getEnv();
  const options: SignOptions = {
    expiresIn: env.JWT_EXPIRES_IN as SignOptions['expiresIn']
  };

  return jwt.sign(payload, env.JWT_SECRET, options);
}

export function verifySessionToken(token: string): SessionTokenPayload {
  const env = getEnv();
  return jwt.verify(token, env.JWT_SECRET) as SessionTokenPayload;
}
