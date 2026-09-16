import { createServer } from 'node:http';

import { getEnv } from './config/env.js';
import { createApp } from './app.js';

const env = getEnv();
const app = createApp();
const server = createServer(app);

server.listen(env.PORT, () => {
  console.log(`[whatshub] listening on http://localhost:${env.PORT}`);
});
