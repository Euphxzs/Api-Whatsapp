import { createHash } from 'node:crypto';

import { getEnv } from '../../config/env.js';
import { AppError } from '../../shared/http/errors.js';
import { signSessionToken, verifySessionToken, type SessionTokenPayload } from '../../shared/security/jwt.js';
import { hashPassword, verifyPassword } from '../../shared/security/password.js';

export type BootstrapAdmin = {
  id: string;
  name: string;
  email: string;
  role: 'MASTER_ADMIN';
  passwordHash: string;
};

let cachedAdmin: BootstrapAdmin | undefined;

async function buildBootstrapAdmin(): Promise<BootstrapAdmin> {
  const env = getEnv();
  const passwordHash = await hashPassword(env.MASTER_PASSWORD);
  const id = createHash('sha256').update(env.MASTER_EMAIL).digest('hex').slice(0, 24);

  return {
    id,
    name: env.MASTER_NAME,
    email: env.MASTER_EMAIL,
    role: 'MASTER_ADMIN',
    passwordHash
  };
}

export async function getBootstrapAdmin(): Promise<BootstrapAdmin> {
  cachedAdmin ??= await buildBootstrapAdmin();
  return cachedAdmin;
}

export async function loginWithBootstrapAdmin(email: string, password: string) {
  const admin = await getBootstrapAdmin();

  if (email !== admin.email) {
    throw new AppError('INVALID_CREDENTIALS', 'Invalid e-mail or password', 401);
  }

  const passwordMatches = await verifyPassword(password, admin.passwordHash);

  if (!passwordMatches) {
    throw new AppError('INVALID_CREDENTIALS', 'Invalid e-mail or password', 401);
  }

  const payload: SessionTokenPayload = {
    sub: admin.id,
    email: admin.email,
    role: admin.role
  };

  return {
    token: signSessionToken(payload),
    user: {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      status: 'ACTIVE'
    }
  };
}

export async function getCurrentUserFromToken(rawAuthorizationHeader?: string) {
  if (!rawAuthorizationHeader?.startsWith('Bearer ')) {
    throw new AppError('UNAUTHORIZED', 'Missing bearer token', 401);
  }

  const token = rawAuthorizationHeader.slice('Bearer '.length);
  const payload = verifySessionToken(token);
  const admin = await getBootstrapAdmin();

  if (payload.sub !== admin.id) {
    throw new AppError('UNAUTHORIZED', 'Token subject is no longer valid', 401);
  }

  return {
    id: admin.id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
    status: 'ACTIVE'
  };
}

export function resetAuthCacheForTests(): void {
  cachedAdmin = undefined;
}
