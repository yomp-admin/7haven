import { createSession, setSessionCookie, clearSessionCookie } from '../../services/auth/session';
import { createWebAuthnChallenge } from '../../lib/auth/webauthn';
import { encodeBase64 } from '@oslojs/encoding';
import type { Context } from 'hono';
import { getAuthRepo, remult, type ErrorInfo } from '@repo/shared';
import { getUser as check } from '../../lib/user';
import { result } from '../../utils/responseHandler';
import { StatusCode } from '../../utils/statusCode';
import type { User as Account } from '@repo/shared/entities/auth/user';
import { generateSessionToken } from '../../services/auth/session';
import {
  expandPermissions,
  initialize_default_permissions,
  initializePermissions
} from '@repo/shared/utils';
import { ResourceAction } from '@repo/shared/entities/auth/abac';

export async function signIn(c: Context) {
  const body = await c.req.json();
  const { username } = body;

  try {
    const user = getAuthRepo().user.create({ email: username });
    await getAuthRepo().user.validate(user);

    let existingUser = await getAuthRepo().user.findFirst({ email: username });

    if (!existingUser) {
      user.roles = ['seller'];

      const defaultPermissions = expandPermissions([{ resource: 'product', action: '*' }]);

      await initialize_default_permissions(user.id, defaultPermissions);

      existingUser = await getAuthRepo().user.save(user);
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
    const remultError = error as ErrorInfo<Account>;
    if (remultError.modelState) {
      return c.json(result(remultError.modelState), StatusCode.BAD_REQUEST);
    }
    return c.json(result('An unexpected error occurred'), StatusCode.INTERNAL_SERVER_ERROR);
  }
}

export async function signOut(c: Context) {
  if (remult.user?.session.id) {
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
