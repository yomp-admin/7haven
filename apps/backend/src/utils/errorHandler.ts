import { Hono } from 'hono';
import { logger } from './logger';

export const setupErrorHandler = (app: Hono) => {
	app.onError((e, c) => {
		logger.error('Unhandled Error:', e);
		return c.json({ error: 'Internal Server Error' }, 500);
	});
	app.notFound((c) => {
		return c.json({ error: 'Not Found' }, 404);
	});
};
