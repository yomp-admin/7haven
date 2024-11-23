import { Fields, Validators, type FieldOptions } from 'remult';
import { encodeBase32 } from '@oslojs/encoding';
import { hash, verify } from '@node-rs/argon2';

export * from '../utils/abac';

const createCustomId = (length?: number) => {
  return () => {
    const bytes = new Uint8Array(length || 8);
    crypto.getRandomValues(bytes);
    const id = encodeBase32(bytes);
    return id;
  };
};

export function publicId<T>(
  prefix: string,
  length?: number,
  ...options: FieldOptions<T, string>[]
) {
  const generateId = createCustomId(length);
  const defaultValue = `${prefix}_${generateId()}`;
  return Fields.string<T>(
    {
      validate: Validators.unique,
      allowApiUpdate: false,
      defaultValue: () => defaultValue,
      saving: (_, record) => {
        if (!record.value) {
          record.value = defaultValue;
        }
      }
    },
    ...options
  );
}

export function verifyExpirationDate(expiresAt: Date): boolean {
  return Date.now() < expiresAt.getTime();
}

export function generateRandomOTP(): string {
  const generateId = createCustomId(4);
  return generateId().slice(0, 6);
}

export async function hashPassword(password: string): Promise<string> {
  return await hash(password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1
  });
}

export async function verifyPasswordHash(hash: string, password: string): Promise<boolean> {
  return await verify(hash, password);
}

export function verifyPasswordStrength(password: string): boolean {
  const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
  return regex.test(password);
}
