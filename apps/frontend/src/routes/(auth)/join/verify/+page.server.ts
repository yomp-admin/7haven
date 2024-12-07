import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { formSchema } from './schema';
import { getUserService } from '@repo/shared';
import { encryptCookie } from '../../../../utils/encoding';
import { handleFetch } from '../../../../utils/handleFetch';
export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(zod(formSchema))
	};
};

export const actions: Actions = {
	default: async ({ locals, cookies, request }) => {
		if (!locals.onboarding) {
			throw redirect(302, '/join');
		}

		const onboarding = locals.onboarding;
		const form = await superValidate(request, zod(formSchema));

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		const [err, res] = await handleFetch(() =>
			getUserService().user.verify_seller_email(onboarding!.userId, form.data.verification_code)
		);

		if (err || !res.success) {
			form.errors.verification_code = [res?.message ?? 'Invalid verification code'];
			return fail(400, {
				form,
				error: err?.message
			});
		}

		const encryptedData = encryptCookie({
			userId: onboarding?.userId,
			email: onboarding?.email,
			verified: true
		});

		cookies.set('haven_init', encryptedData, {
			path: '/',
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
			maxAge: 15 * 60
		});

		throw redirect(302, '/join/secure');
	}
};
