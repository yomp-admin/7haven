import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const env = createEnv({
	server: {
		PORT: z.string().default('3491'),
		CORS_ORIGIN: z.string().transform((str) => JSON.parse(str)),
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
	PORT: parseInt(env.PORT),
	CORS_ORIGIN: env.CORS_ORIGIN,
	IS_PRODUCTION: env.NODE_ENV === 'production'
};
