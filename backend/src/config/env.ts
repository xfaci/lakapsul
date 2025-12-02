import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(4000),
  HOST: z.string().default('0.0.0.0'),
  LOG_LEVEL: z.string().default('info'),
  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string().default('15m'),
  REFRESH_TOKEN_TTL: z.string().default('30d'),
  AIRTABLE_API_KEY: z.string(),
  AIRTABLE_BASE_ID: z.string(),
  STRIPE_SECRET_KEY: z.string(),
  STRIPE_WEBHOOK_SECRET: z.string(),
  STRIPE_APPLICATION_FEE_MIN: z.coerce.number().default(5),
  STRIPE_APPLICATION_FEE_MAX: z.coerce.number().default(15),
  OPENAI_API_KEY: z.string(),
  N8N_BASE_URL: z.string().url().optional(),
  N8N_WEBHOOK_SECRET: z.string().optional(),
  CLIENT_URL: z.string().url().optional(),
  APP_URL: z.string().url().optional(),
  SOCKET_ALLOWED_ORIGINS: z.string().optional()
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  // eslint-disable-next-line no-console
  console.error('Invalid environment configuration', parsed.error.format());
  throw new Error('Environment validation failed');
}

export const env = parsed.data;
