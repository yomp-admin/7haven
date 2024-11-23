import { Fields, Validators, type FieldOptions } from 'remult';
import { encodeBase32 } from '@oslojs/encoding';

export * from './abac';

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
