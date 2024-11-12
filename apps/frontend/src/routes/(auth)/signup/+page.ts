/* import { remult } from 'remult';
import type { LayoutServerLoad } from '../../$types';
import { redirect } from '@sveltejs/kit';

export const load = (async () => {
	if (remult.authenticated()) {
		throw redirect(303, '/');
	}
}) satisfies LayoutServerLoad;
 */