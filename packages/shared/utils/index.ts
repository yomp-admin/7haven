import { Fields, Validators, type FieldOptions } from 'remult';
import { encodeBase32 } from '@oslojs/encoding';
import { init } from '@paralleldrive/cuid2';

export * from '../utils/abac';

const randomCasing = (str: string) => {
  return str
    .split('')
    .map((char) => (Math.random() > 0.5 ? char.toUpperCase() : char.toLowerCase()))
    .join('');
};

const createCustomId = (length?: number) => {
  return () =>
    randomCasing(
      init({
        length: length || 14,
        fingerprint: '7haven-custom-publicId-fingerprint'
      })()
    );
};

export function publicId<T>(
  prefix: string,
  length?: number,
  ...options: FieldOptions<T, string>[]
) {
  const id = createCustomId(length);
  const defaultValue = [prefix, id()].join('_');
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
  return createCustomId(6)();
}
