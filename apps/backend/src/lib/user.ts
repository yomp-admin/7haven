import { encodeBase32 } from '@oslojs/encoding';
import { hashPassword } from '../utils/password';
import { getAuthRepo, remult } from '@repo/shared';
import type { User as Account } from '@repo/shared/entities/auth/user';

export function verifyUsernameInput(username: string): boolean {
  return username.length > 3 && username.length < 32 && username.trim() === username;
}

export async function createUser(
  email: string,
  username: string,
  password: string
): Promise<Account> {
  const [passwordHash, recoveryCode] = await Promise.all([
    hashPassword(password),
    generateRandomRecoveryCode()
  ]);

  const user = getAuthRepo().user.create({
    email,
    username,
    passwordHash,
    roles: ['seller'],
    recoveryCode
  });

  const savedUser = await getAuthRepo().user.save(user);

  return savedUser;
}

export async function getUser(identifier: string): Promise<User | null> {
  const user = await getAuthRepo().user.findFirst(
    { $or: [{ id: identifier }, { email: identifier }, { username: identifier }] },
    {
      include: {
        otp: true,
        passKeys: true,
        securityKeys: true
      }
    }
  );

  if (!user) {
    return null;
  }

  const methods = [
    user.otp?.length && 'totp',
    user.passKeys?.length && 'passkey',
    user.securityKeys?.length && 'securityKey'
  ].filter(Boolean) as ('totp' | 'passkey' | 'securityKey')[];

  return {
    id: user.id,
    email: user.email,
    username: user.username,
    emailVerified: !!user.emailVerified,
    mfaSettings: {
      enabled: methods.length > 0,
      methods
    }
  };
}

export async function getUserPasswordHash(userId: string): Promise<string | null> {
  const user = await getAuthRepo().user.findId(userId);
  return user?.passwordHash ?? null;
}

export async function getUserRecoveryCode(userId: string): Promise<string | null> {
  const user = await getAuthRepo().user.findId(userId);
  return user?.recoveryCode ?? null;
}

export async function getUserTOTPKey(userId: string): Promise<Uint8Array | null> {
  const otpKey = await getAuthRepo().otp.findId(userId);
  return otpKey?.key ?? null;
}

export async function verifyUserRecoveryCode(
  userId: string,
  recoveryCode: string
): Promise<boolean> {
  const newRecoveryCode = generateRandomRecoveryCode();
  try {
    const user = await getAuthRepo().user.findFirst({ id: userId, recoveryCode });
    if (!user) {
      return false;
    }
    await remult.dataProvider.transaction(async () => {
      await Promise.all([
        getAuthRepo().user.update(userId, { recoveryCode: newRecoveryCode }),
        getAuthRepo().otp.delete({ userId }),
        getAuthRepo().passkey.delete({ userId }),
        getAuthRepo().securityKey.delete({ userId })
      ]);
    });
    return true;
  } catch (e) {
    throw e;
  }
}

export async function resetUserRecoveryCode(userId: string): Promise<string> {
  const recoveryCode = generateRandomRecoveryCode();

  const user = await getAuthRepo().user.findFirst({ id: userId });
  if (!user) {
    throw new Error('Invalid user ID');
  }
  await getAuthRepo().user.update(userId, { recoveryCode });
  return recoveryCode;
}

export async function verifyUserEmail(userId: string, email: string): Promise<void> {
  const user = await getAuthRepo().user.findFirst({ id: userId });
  if (!user) {
    throw new Error('Invalid user ID');
  }
  await getAuthRepo().user.update(userId, { emailVerified: true, email });
}

export async function updateUserPasswordWithEmailVerification(
  userId: string,
  email: string,
  password: string
): Promise<void> {
  const passwordHash = await hashPassword(password);
  await remult.dataProvider.transaction(async () => {
    const user = await getAuthRepo().user.findFirst({ id: userId, email });
    if (!user) {
      throw new Error('Invalid user ID');
    }
    await Promise.all([
      getAuthRepo().user.update(userId, { passwordHash }),
      getAuthRepo().session.delete({ userId })
    ]);
  });
}

export async function updateUserPassword(
  sessionId: string,
  userId: string,
  password: string
): Promise<void> {
  const passwordHash = await hashPassword(password);
  await remult.dataProvider.transaction(async () => {
    await Promise.all([
      getAuthRepo().session.delete({ id: sessionId }),
      getAuthRepo().user.update(userId, { passwordHash })
    ]);
  });
}

export async function updateUserTOTPKey(
  sessionId: string,
  userId: string,
  key: Uint8Array
): Promise<void> {
  await remult.dataProvider.transaction(async () => {
    await Promise.all([
      getAuthRepo().otp.delete({ userId }),
      getAuthRepo().otp.insert({ userId, key }),
      getAuthRepo().session.delete({ id: sessionId }),
      getAuthRepo().session.update({ id: sessionId }, { two_factor_verified: false } as any)
    ]);
  });
}

function generateRandomRecoveryCode(): string {
  const recoveryCodeBytes = new Uint8Array(10);
  crypto.getRandomValues(recoveryCodeBytes);
  return encodeBase32(recoveryCodeBytes);
}

export interface User {
  id: string;
  email: string;
  username: string;
  emailVerified: boolean;
  mfaSettings: {
    enabled: boolean;
    methods: ('totp' | 'passkey' | 'email' | 'sms' | 'securityKey')[];
  };
}
