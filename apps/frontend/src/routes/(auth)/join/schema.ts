import { z } from 'zod';

export const formSchema = z.object({
	email: z.string().email('Please enter a valid email address').max(255)
});

export type FormSchema = typeof formSchema;
