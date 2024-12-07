import { config } from '../config/config';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { csrf } from 'hono/csrf';
import { logger } from 'hono/logger';
import { securityHeaders } from './handler';

const enableLogger = false;

export const setupMiddleware = (app: Hono) => {
  app.use(securityHeaders);
  app.use(
    cors({
      origin: config.SERVER_CORS_ORIGINS,
      allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
      exposeHeaders: ['Content-Length', 'X-Requested-With'],
      credentials: true
    })
  );
  app.use(csrf());
  //app.use(rateLimiter);
  if (!config.IS_PRODUCTION && enableLogger) {
    app.use(logger());
  }
};
