import { z } from 'zod';

export const formSchema = z.object({
	verification_code: z
		.string()
		.min(6, {
			message: 'Enter a 6-character code'
		})
		.max(6)
});

export type FormSchema = typeof formSchema;
