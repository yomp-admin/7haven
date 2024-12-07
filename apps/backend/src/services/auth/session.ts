import { getAuthRepo, type UserInfo } from '@repo/shared';
import type { Context } from 'hono';
import { config } from '../../config/config';
import { setCookie } from 'hono/cookie';
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from '@oslojs/encoding';
import { sha256 } from '@oslojs/crypto/sha2';

const SESSION_EXPIRY = config.IS_PRODUCTION ? 15 * 60 * 1000 : 30 * 60 * 1000;
const COOKIE_NAME = 'haven_auth';

export function generateSessionToken(): string {
  const bytes = new Uint8Array(20);
  crypto.getRandomValues(bytes);
  const token = encodeBase32LowerCaseNoPadding(bytes);
  return token;
}

export async function createSession(token: string, userId: string): Promise<Session> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

  const session = await getAuthRepo().session.insert({
    id: sessionId,
    userId,
    expiresAt: new Date(Date.now() + SESSION_EXPIRY)
  });

  return session;
}

export async function validateSessionToken(token: string): Promise<UserInfo | undefined> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const session = await getAuthRepo().session.findId(sessionId);

  if (!session || new Date() >= session.expiresAt) {
    if (session) await getAuthRepo().session.delete(sessionId);
    return undefined;
  }

  const user = await getAuthRepo().user.findId(session.userId);
  if (!user) {
    await getAuthRepo().session.delete(sessionId);
    return undefined;
  }

  if (Date.now() >= session.expiresAt.getTime() - SESSION_EXPIRY / 2) {
    session.expiresAt = new Date(Date.now() + SESSION_EXPIRY);
    await getAuthRepo().session.update(sessionId, {
      expiresAt: session.expiresAt
    });
  }

  return {
    id: user.id,
    name: user.username,
    roles: user.roles,
    email: user.email,
    avatar: user.avatar,
    session: {
      id: session.id,
      expiresAt: session.expiresAt,
      twoFactorVerified: user.twoFactorVerified
    }
  };
}

export async function invalidateSession(sessionId: string): Promise<void> {
  await getAuthRepo().session.delete(sessionId);
}

export function setSessionCookie(c: Context, token: string) {
  setCookie(c, COOKIE_NAME, token, {
    httpOnly: true,
    secure: config.IS_PRODUCTION,
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_EXPIRY / 1000
  });
}

export function clearSessionCookie(c: Context) {
  setCookie(c, COOKIE_NAME, '', {
    httpOnly: true,
    secure: config.IS_PRODUCTION,
    sameSite: 'lax',
    path: '/',
    maxAge: 0
  });
}

interface Session {
  id: string;
  userId: string;
  expiresAt: Date;
}
