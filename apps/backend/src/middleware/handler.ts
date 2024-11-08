import type { MiddlewareHandler } from 'hono';

export const securityHeaders: MiddlewareHandler = async (c, next) => {
	await next();
	c.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
	c.header('X-XSS-Protection', '1; mode=block');
	c.header('X-Frame-Options', 'DENY');
	c.header('X-Content-Type-Options', 'nosniff');
	c.header('Referrer-Policy', 'strict-origin-when-cross-origin');
	c.header(
		'Content-Security-Policy',
		"default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; object-src 'none'; base-uri 'self';"
	);
};
