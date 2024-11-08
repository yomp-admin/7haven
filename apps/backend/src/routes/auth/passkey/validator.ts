import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';

const passkeySignInSchema = z.object({
	authenticator_data: z.string(),
	client_data_json: z.string(),
	credential_id: z.string(),
	signature: z.string()
});

const passkeyRegisterSchema = z.object({
	attestation_object: z.string(),
	client_data_json: z.string(),
	name: z.string()
});

export const passkeySignInValidator = zValidator('json', passkeySignInSchema);
export const passkeyRegisterValidator = zValidator('json', passkeyRegisterSchema);
