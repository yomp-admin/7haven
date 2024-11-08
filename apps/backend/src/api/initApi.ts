import { Hono } from 'hono';
import { remultHono } from 'remult/remult-hono';
import { config } from '@/config/config';
import { controllers, entities } from '@repo/shared';
import {
  clearSessionCookie,
  setSessionCookie,
  validateSessionToken
} from '@/services/auth/session';
import { getCookie } from 'hono/cookie';

export const setupRemult = (app: Hono) => {
  const api = remultHono({
    logApiEndPoints: !config.IS_PRODUCTION,
    admin: true,
    entities: entities,
    controllers: controllers,
    getUser: async (c) => {
      const token = getCookie(c, 'haven_auth');
      if (!token) {
        clearSessionCookie(c);
        return undefined;
      }

      const userInfo = await validateSessionToken(token);
      if (!userInfo) {
        clearSessionCookie(c);
        return undefined;
      }

      setSessionCookie(c, token);
      return userInfo;
    },
    error: async (info) => {
      console.error(info.exception);
      return info.sendError(info.httpStatusCode, {
        message: info.exception?.message || 'An error occurred'
      });
    }
  });
  app.use('*', api.withRemult);
  app.route('/', api);
};
