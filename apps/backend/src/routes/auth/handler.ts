import { createSession, setSessionCookie, clearSessionCookie } from '../../services/auth/session';
import { createWebAuthnChallenge } from '../../lib/auth/webauthn';
import { encodeBase64 } from '@oslojs/encoding';
import type { Context } from 'hono';
import { cache, getAuthRepo, getUserService, remult, type ErrorInfo } from '@repo/shared';
import { StatusCode } from '../../utils/statusCode';
import { generateSessionToken } from '../../services/auth/session';
import { verifyPasswordHash } from '../../utils/password';

export async function signIn(c: Context) {
  const body = await c.req.json();
  const { email, password } = body;

  if (!email || !password) {
    return c.json(
      {
        success: false,
        message: 'Invalid email or password'
      },
      StatusCode.BAD_REQUEST
    );
  }

  const user = await getAuthRepo().user.findFirst({ email });

  if (!user) {
    return c.json(
      {
        success: false,
        message: 'Invalid email or password'
      },
      StatusCode.BAD_REQUEST
    );
  }

  const isValidPassword = await verifyPasswordHash(user.passwordHash, password);

  if (!isValidPassword) {
    return c.json(
      {
        message: 'Invalid email or password'
      },
      StatusCode.BAD_REQUEST
    );
  }

  const res = await getUserService().user.create_2fa(user.id, 'auth');

  if (!res.success) {
    return c.json(
      {
        message: res.message
      },
      StatusCode.BAD_REQUEST
    );
  }

  return c.json(
    {
      id: user.id
    },
    StatusCode.OK
  );
}

export async function auth2fa(c: Context) {
  const body = await c.req.json();
  const { userId, code } = body;

  if (!userId || !code) {
    return c.json(
      {
        message: 'Invalid verification code'
      },
      StatusCode.BAD_REQUEST
    );
  }

  const res = await getUserService().user.verify_2fa(userId, code);

  if (!res.success) {
    return c.json(
      {
        message: res.message
      },
      StatusCode.BAD_REQUEST
    );
  }

  const user = await getAuthRepo().user.findFirst({ id: userId });

  if (!user) {
    return c.json(
      {
        message: 'Error verifying 2FA code'
      },
      StatusCode.NOT_FOUND
    );
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

  return c.json(
    {
      user: userInfo,
      token: token
    },
    StatusCode.OK
  );
}

export async function signOut(c: Context) {
  if (remult.user?.session.id) {
    await getAuthRepo().session.delete(remult.user.session.id);
    cache.clear(remult.user.id);
    remult.user = undefined;
    clearSessionCookie(c);

    return c.json(
      {
        message: 'Signed out successfully'
      },
      StatusCode.OK
    );
  }
  return c.json(
    {
      message: 'Error Signing Out'
    },
    StatusCode.INTERNAL_SERVER_ERROR
  );
}

export async function createChallenge(c: Context) {
  const challenge = createWebAuthnChallenge();
  return c.json(
    {
      challenge: encodeBase64(challenge)
    },
    StatusCode.OK
  );
}
