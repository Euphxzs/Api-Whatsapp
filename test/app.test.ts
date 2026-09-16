import assert from 'node:assert/strict';
import { afterEach, beforeEach, describe, test } from 'node:test';

import { createServer } from 'node:http';

import { createApp } from '../src/app.js';
import { resetEnvForTests } from '../src/config/env.js';
import { resetAuthCacheForTests } from '../src/modules/auth/service.js';
import { resetRateLimitForTests } from '../src/shared/http/rate-limit.js';

async function withServer(run: (baseUrl: string) => Promise<void>) {
  const app = createApp();
  const server = createServer(app);

  await new Promise<void>((resolve) => server.listen(0, resolve));
  const address = server.address();

  if (!address || typeof address === 'string') {
    throw new Error('Failed to obtain test server address');
  }

  const baseUrl = `http://127.0.0.1:${address.port}`;

  try {
    await run(baseUrl);
  } finally {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
}

beforeEach(() => {
  process.env.NODE_ENV = 'test';
  process.env.PORT = '0';
  process.env.PLATFORM_URL = 'http://127.0.0.1:3000';
  process.env.JWT_SECRET = 'super-secret-token-value';
  process.env.MASTER_EMAIL = 'admin@example.com';
  process.env.MASTER_PASSWORD = 'admin12345';
  process.env.MASTER_NAME = 'Administrador';
  resetEnvForTests();
  resetAuthCacheForTests();
  resetRateLimitForTests();
});

afterEach(() => {
  resetEnvForTests();
  resetAuthCacheForTests();
  resetRateLimitForTests();
});

describe('WhatsHub API foundation', () => {
  test('returns platform status', async () => {
    await withServer(async (baseUrl) => {
      const response = await fetch(`${baseUrl}/api/v1/status`);
      assert.equal(response.status, 200);

      const payload = (await response.json()) as {
        success: boolean;
        data: {
          implementation: { currentPhase: string };
        };
      };

      assert.equal(payload.success, true);
      assert.match(payload.data.implementation.currentPhase, /Phase 1/);
    });
  });

  test('authenticates the bootstrap admin and returns current user', async () => {
    await withServer(async (baseUrl) => {
      const loginResponse = await fetch(`${baseUrl}/api/v1/auth/login`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          email: 'admin@example.com',
          password: 'admin12345'
        })
      });

      assert.equal(loginResponse.status, 200);
      const loginPayload = (await loginResponse.json()) as {
        success: boolean;
        data: { token: string };
      };
      assert.equal(loginPayload.success, true);
      assert.ok(loginPayload.data.token);

      const meResponse = await fetch(`${baseUrl}/api/v1/auth/me`, {
        headers: {
          authorization: ['Bearer', loginPayload.data.token].join(' ')
        }
      });

      assert.equal(meResponse.status, 200);
      const mePayload = (await meResponse.json()) as {
        success: boolean;
        data: { email: string; role: string };
      };
      assert.equal(mePayload.success, true);
      assert.equal(mePayload.data.email, 'admin@example.com');
      assert.equal(mePayload.data.role, 'MASTER_ADMIN');
    });
  });

  test('returns standardized error for invalid credentials', async () => {
    await withServer(async (baseUrl) => {
      const response = await fetch(`${baseUrl}/api/v1/auth/login`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          email: 'admin@example.com',
          password: 'wrongpass'
        })
      });

      assert.equal(response.status, 401);
      const payload = (await response.json()) as {
        success: boolean;
        error: { code: string };
      };
      assert.equal(payload.success, false);
      assert.equal(payload.error.code, 'INVALID_CREDENTIALS');
    });
  });
});
