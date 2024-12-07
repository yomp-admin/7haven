import { remult } from '@repo/shared';
import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load = (async () => {
	console.log('user', remult.user);
	if (!remult.authenticated()) {
		throw redirect(303, '/signin');
	}
}) satisfies LayoutServerLoad;
