import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { formSchema } from './schema';
import { handleFetch } from '@/utils';
import { getUserService } from '@repo/shared';

export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(zod(formSchema))
	};
};

export const actions: Actions = {
	default: async ({ request, locals, cookies }) => {
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
			getUserService().user.complete_seller_registration(onboarding.userId, form.data.password)
		);

		if (err || !res.success) {
			return fail(400, {
				form,
				error: err?.message
			});
		}

		cookies.delete('7haven_init', { path: '/' });

		return { success: true };
	}
};
