import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import { docsRouter } from './modules/docs/routes.js';
import { systemRouter } from './modules/system/routes.js';
import { authRouter } from './modules/auth/routes.js';
import { requestContextMiddleware } from './shared/http/request-context.js';
import { rateLimitMiddleware } from './shared/http/rate-limit.js';
import { toErrorResponse } from './shared/http/errors.js';

export function createApp() {
  const app = express();

  app.disable('x-powered-by');
  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: '2mb' }));
  app.use(requestContextMiddleware);
  app.use(rateLimitMiddleware);

  app.get('/', (_request, response) => {
    response.type('html').sendFile(new URL('../public/index.html', import.meta.url).pathname);
  });

  app.use('/api/v1', systemRouter);
  app.use('/api/v1/auth', authRouter);
  app.use('/api/v1/docs', docsRouter);

  app.use((error: unknown, _request: express.Request, response: express.Response, _next: express.NextFunction) => {
    const { statusCode, body } = toErrorResponse(error);
    response.status(statusCode).json(body);
  });

  return app;
}
