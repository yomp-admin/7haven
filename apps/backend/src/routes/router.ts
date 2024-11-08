import { Hono } from 'hono';
import { signIn, signOut, currentUser, getUser } from './auth/handler';
import passkeyRouter from './auth/passkey';
import health from './health/handler';
import { setupMiddleware } from '@/middleware';
import { setupRemult } from '@/api/initApi';
import { setupErrorHandler } from '@/utils/errorHandler';
import { createRateLimiter } from '@/utils/rateLimit';

const authRateLimiter = createRateLimiter(1, 40);

export const setupApi = (app: Hono) => {
	setupMiddleware(app);
	setupRemult(app);
	setupAuthRoutes(app);
	setupErrorHandler(app);
	setupServices(app);
};

const setupAuthRoutes = (app: Hono) => {
	app.post('/api/auth/sign-in', signIn);
	app.post('/api/auth/sign-out', signOut);
	app.get('/api/auth/current-user', authRateLimiter, currentUser);
	app.get('/api/auth/user/:userId', authRateLimiter, getUser);
	app.route('/api/auth/webauthn', passkeyRouter);
};

const setupServices = (app: Hono) => {
	app.route('/', health);
};
