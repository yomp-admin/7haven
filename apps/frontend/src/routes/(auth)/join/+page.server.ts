import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { formSchema } from './schema';
import { getUserService } from '@repo/shared';
import { encryptCookie } from '../../../utils/encoding';
import { handleFetch } from '../../../utils/handleFetch';

export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(zod(formSchema))
	};
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const form = await superValidate(request, zod(formSchema));

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		const [err, res] = await handleFetch(() =>
			getUserService().user.initialize_seller_registration(form.data.email)
		);

		if (err || !res) {
			return fail(400, {
				form,
				error: err?.message ?? 'Something went wrong'
			});
		}

		const encryptedData = encryptCookie({
			userId: res.userId,
			email: form.data.email,
			verified: false
		});

		cookies.set('haven_init', encryptedData, {
			path: '/',
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
			maxAge: 30 * 60
		});

		throw redirect(302, '/join/verify');
	}
};
