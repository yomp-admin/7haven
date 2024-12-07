import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const env = createEnv({
  server: {
    SERVER_PORT: z.string().default('3491'),
    SERVER_CORS_ORIGINS: z.string().transform((str) => str.split(',').map((s) => s.trim())),
    RELYING_PARTY_ID: z.string(),
    ENCRYPTION_KEY: z.string(),
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development')
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true
});

export const config = {
  RELYING_PARTY_ID: env.RELYING_PARTY_ID,
  ENCRYPTION_KEY: env.ENCRYPTION_KEY,
  SERVER_PORT: parseInt(env.SERVER_PORT),
  SERVER_CORS_ORIGINS: env.SERVER_CORS_ORIGINS,
  IS_PRODUCTION: env.NODE_ENV === 'production'
};
