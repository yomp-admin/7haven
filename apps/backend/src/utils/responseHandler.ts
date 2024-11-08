import type { Context } from 'hono';
import { StatusCode } from './statusCode';
import { logger } from './logger';

export const result = (data: any) => ({ data });

export const response = (data: any, statusCode: StatusCode) => ({
	data,
	statusCode
});

export const errorHandler = (e: Error, c: Context) => {
	logger.error('Error:', e);
	return c.json({ error: 'Internal Server Error' }, StatusCode.INTERNAL_SERVER_ERROR);
};
