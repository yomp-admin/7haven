import { Hono } from 'hono';
import passkeyRouter from './auth/passkey';
import health from './health/handler';
import { setupMiddleware } from '../middleware';
import { setupRemult } from '../api/initApi';
import { setupErrorHandler } from '../utils/errorHandler';
import { createRateLimiter } from '../utils/rateLimit';
import { auth2fa, signIn, signOut } from './auth/handler';

export const setupApi = (app: Hono) => {
  setupMiddleware(app);
  setupRemult(app);
  setupAuthRoutes(app);
  setupErrorHandler(app);
  setupServices(app);
};

export const setupRateLimits = (app: Hono) => {
  // Auth routes
  app.use('/api/auth/sign-in', createRateLimiter(30, 5));
  app.use('/api/auth/2fa', createRateLimiter(30, 5));
  app.use('/api/auth/webauthn/*', createRateLimiter(30, 5));
  app.use('/api/auth/is_email_available', createRateLimiter(30, 10));

  /* // Product routes
  app.use('/api/products/*', productRateLimiter);

  // Health check
  app.use('/api/health', healthRateLimiter);

  // Default rate limit for all other routes
  app.use('/api/*', defaultRateLimiter); */
};

const setupAuthRoutes = (app: Hono) => {
  app.route('/api/auth/webauthn', passkeyRouter);
  app.post('/api/auth/sign-in', signIn);
  app.post('/api/auth/sign-out', signOut);
  app.post('/api/auth/2fa', auth2fa);
};

const setupServices = (app: Hono) => {
  app.route('/', health);
};
