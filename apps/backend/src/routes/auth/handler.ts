import { createSession, setSessionCookie, clearSessionCookie } from '../../services/auth/session';
import { createWebAuthnChallenge } from '../../lib/auth/webauthn';
import { encodeBase64 } from '@oslojs/encoding';
import type { Context } from 'hono';
import { cache, getAuthRepo, remult, type ErrorInfo } from '@repo/shared';
import { getUser as check } from '../../lib/user';
import { result } from '../../utils/responseHandler';
import { StatusCode } from '../../utils/statusCode';
import type { User as Account } from '@repo/shared/entities/auth/user';
import { generateSessionToken } from '../../services/auth/session';

export async function signIn(c: Context) {
  const body = await c.req.json();
  const { email, password } = body;

  if (!email) {
    return c.json(result('Email and password are required'), StatusCode.BAD_REQUEST);
  }

  try {
    let user = await getAuthRepo().user.findFirst({ email });

    if (!user) {
      return c.json(result('User not found'), StatusCode.NOT_FOUND);
    }

    const token = generateSessionToken();
    const session = await createSession(token, user.id);
    setSessionCookie(c, token);

    const userInfo = {
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

    remult.user = userInfo;

    return c.json(result({ userInfo }), StatusCode.OK);
  } catch (error) {
    const remultError = error as ErrorInfo<Account>;
    if (remultError.modelState) {
      return c.json(result(remultError.modelState), StatusCode.BAD_REQUEST);
    }
    return c.json(result('An unexpected error occurred'), StatusCode.INTERNAL_SERVER_ERROR);
  }
}

export async function signOut(c: Context) {
  if (remult.user?.session.id) {
    cache.clear(remult.user.id);
    await getAuthRepo().session.delete(remult.user.session.id);
    remult.user = undefined;
    clearSessionCookie(c);

    return c.json(result('Signed out successfully'), StatusCode.OK);
  }
  return c.json(result('Error Signing Out'), StatusCode.INTERNAL_SERVER_ERROR);
}

export async function currentUser(c: Context) {
  return c.json(result({ userInfo: remult.user ?? null }), StatusCode.OK);
}

export async function createChallenge(c: Context) {
  const challenge = createWebAuthnChallenge();
  return c.json(result({ challenge: encodeBase64(challenge) }), StatusCode.OK);
}

export const getUser = async (c: Context) => {
  const userId = c.req.param('userId');
  const user = await check(userId);

  if (!user) {
    return c.json(result('User not found'), StatusCode.NOT_FOUND);
  }

  return c.json(result(user), StatusCode.OK);
};

export async function checkForExistingUser(username: string): Promise<boolean> {
  return (await getAuthRepo().user.count({ email: username })) > 0;
}
