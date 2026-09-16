import { Router } from 'express';

import { getEnv } from '../../config/env.js';

export const systemRouter = Router();

systemRouter.get('/status', (_request, response) => {
  const env = getEnv();
  response.status(200).json({
    success: true,
    data: {
      platform: {
        name: env.PLATFORM_NAME,
        version: '0.1.0',
        environment: env.NODE_ENV,
        apiVersion: 'v1'
      },
      services: {
        backend: { status: 'online' },
        database: { status: 'planned', urlConfigured: Boolean(env.DATABASE_URL) },
        queue: { status: 'planned', urlConfigured: Boolean(env.REDIS_URL) },
        workers: { status: 'planned' },
        websocket: { status: 'planned' },
        whatsappSessions: { status: 'planned' },
        webhooks: { status: 'planned' }
      },
      implementation: {
        currentPhase: 'Phase 1 - architecture, database design and bootstrap authentication',
        nextPhase: 'Phase 2 - user management, RBAC and tenant isolation'
      },
      timestamp: new Date().toISOString()
    }
  });
});
