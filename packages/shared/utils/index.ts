import { Fields, Validators, type FieldOptions } from 'remult';
import { customAlphabet } from 'nanoid';

const alphabet = '0123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz';

const nanoid = (length?: number) => {
  const generate = customAlphabet(alphabet, length || 14);
  return generate();
};

export * from '../utils/abac';

export function publicId<T>(
  prefix: string,
  length?: number,
  ...options: FieldOptions<T, string>[]
) {
  return Fields.string<T>(
    {
      validate: Validators.unique,
      allowApiUpdate: false,
      defaultValue: () => [prefix, nanoid(length)].join('_'),
      saving: (_, record) => {
        if (!record.value) {
          record.value = [prefix, nanoid(length)].join('_');
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
  return nanoid(6);
}
