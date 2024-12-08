import { remult } from '@repo/shared';
import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load = (async ({ cookies }) => {
	const sessionCookie = cookies.get('haven_auth');

	if (!remult.authenticated() && !sessionCookie) {
		throw redirect(303, '/signin');
	}
}) satisfies LayoutServerLoad;