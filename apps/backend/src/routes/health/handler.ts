import { Hono } from 'hono';
import type { Context } from 'hono';

const health = new Hono();

health.get('/api/health', async (c: Context) => {
	return c.json({ status: 'ok' });
});

export default health;
