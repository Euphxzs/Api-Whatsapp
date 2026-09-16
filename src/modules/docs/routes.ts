import { Router } from 'express';

import { buildOpenApiDocument } from './openapi.js';

export const docsRouter = Router();

docsRouter.get('/openapi.json', (_request, response) => {
  response.status(200).json(buildOpenApiDocument());
});

docsRouter.get('/', (_request, response) => {
  response.type('html').send(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>WhatsHub API Docs</title>
    <style>
      body { font-family: Arial, sans-serif; margin: 40px; background: #0f172a; color: #e2e8f0; }
      a { color: #38bdf8; }
      code { background: #1e293b; padding: 2px 6px; border-radius: 4px; }
    </style>
  </head>
  <body>
    <h1>WhatsHub API</h1>
    <p>Phase 1 foundation is online.</p>
    <ul>
      <li>OpenAPI JSON: <a href="/api/v1/docs/openapi.json">/api/v1/docs/openapi.json</a></li>
      <li>Health status: <a href="/api/v1/status">/api/v1/status</a></li>
      <li>Project architecture: see <code>/docs/architecture.md</code> in the repository</li>
    </ul>
  </body>
</html>`);
});
