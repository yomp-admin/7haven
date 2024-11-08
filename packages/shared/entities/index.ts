import { Fields, Validators, type FieldOptions } from 'remult';
import { init } from '@paralleldrive/cuid2';

export function publicId<entityType>(
	prefix: string,
	length?: number,
	...options: FieldOptions<entityType, string>[]
) {
	const createId = init({
		random: Math.random,
		length,
		fingerprint: '7haven-custom-publicId-fingerprint'
	});

	const pId = () => `${prefix}_${createId()}`;

	return Fields.string<entityType>(
		{
			validate: [Validators.unique],
			allowApiUpdate: false,
			defaultValue: pId,
			saving: (_, record) => {
				record.value ||= pId();
			}
		},
		...options
	);
}
