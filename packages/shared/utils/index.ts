import { Fields, Validators, type FieldOptions } from 'remult';
import { init } from '@paralleldrive/cuid2';

const createCustomId = (prefix: string, length?: number) => {
  const generator = init({
    random: () => crypto.getRandomValues(new Uint32Array(1))[0] / 0xffffffff,
    length,
    fingerprint: '7haven-customId-fingerprint'
  });
  return () => `${prefix}_${generator()}`;
};

export function publicId<T>(
  prefix: string,
  length?: number,
  ...options: FieldOptions<T, string>[]
) {
  const generateId = createCustomId(prefix, length);

  return Fields.string<T>(
    {
      validate: Validators.unique,
      allowApiUpdate: false,
      defaultValue: generateId,
      saving: (_, record) => {
        if (!record.value) {
          record.value = generateId();
        }
      }
    },
    ...options
  );
}

export * from './abac';
