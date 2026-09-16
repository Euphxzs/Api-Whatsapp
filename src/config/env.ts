import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().min(0).default(3000),
  PLATFORM_NAME: z.string().min(1).default('WhatsHub API'),
  PLATFORM_URL: z.url().default('http://localhost:3000'),
  JWT_SECRET: z.string().min(16).default('change-me-with-a-long-random-secret'),
  JWT_EXPIRES_IN: z.string().min(2).default('12h'),
  MASTER_NAME: z.string().min(1).default('Master Admin'),
  MASTER_EMAIL: z.email().default('admin@whatshub.local'),
  MASTER_PASSWORD: z.string().min(8).default('change-this-password'),
  DATABASE_URL: z.string().min(1).default('******localhost:5432/whatshub'),
  REDIS_URL: z.string().min(1).default('redis://localhost:6379'),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(60000),
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().int().positive().default(120)
});

export type AppEnv = z.infer<typeof envSchema>;

let cachedEnv: AppEnv | undefined;

export function getEnv(): AppEnv {
  cachedEnv ??= envSchema.parse(process.env);
  return cachedEnv;
}

export function resetEnvForTests(): void {
  cachedEnv = undefined;
}
