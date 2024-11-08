import { createSession, setSessionCookie, clearSessionCookie } from '@/services/auth/session';
import { createWebAuthnChallenge } from '@/lib/auth/webauthn';
import { encodeBase64 } from '@oslojs/encoding';
import type { Context } from 'hono';
import { authRepo, remult, type ErrorInfo } from '@repo/shared';
import { getUser as check } from '@/lib/user';
import { result } from '@/utils/responseHandler';
import { StatusCode } from '@/utils/statusCode';
import type { TAccount } from '@repo/shared/entities/auth/';
import { generateSessionToken } from '@/services/auth/session';

export async function signIn(c: Context) {
  const body = await c.req.json();
  const { username } = body;

  try {
    const user = authRepo.user.create({ email: username });
    await authRepo.user.validate(user);

    let existingUser = await authRepo.user.findFirst({ email: username });

    if (!existingUser) {
      user.roles = ['admin'];
      existingUser = await authRepo.user.save(user);
    }

    const token = generateSessionToken();
    const session = await createSession(token, existingUser.id);
    setSessionCookie(c, token);

    const userInfo = {
      id: existingUser.id,
      name: existingUser.username,
      roles: existingUser.roles,
      session: {
        id: session.id,
        expiresAt: session.expiresAt,
        twoFactorVerified: existingUser.twoFactorVerified
      }
    };

    remult.user = userInfo;

    return c.json(result({ userInfo }), StatusCode.OK);
  } catch (error) {
    const remultError = error as ErrorInfo<TAccount>;
    if (remultError.modelState) {
      return c.json(result(remultError.modelState), StatusCode.BAD_REQUEST);
    }
    return c.json(result('An unexpected error occurred'), StatusCode.INTERNAL_SERVER_ERROR);
  }
}

export async function signOut(c: Context) {
  if (remult.user?.session.id) {
    await authRepo.session.delete(remult.user.session.id);
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
  return (await authRepo.user.count({ email: username })) > 0;
}
