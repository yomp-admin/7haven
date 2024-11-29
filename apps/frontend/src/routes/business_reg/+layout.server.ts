import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from '../$types';
import { remult } from '@repo/shared';

export const load: LayoutServerLoad = async () => {
	if (!remult.authenticated()) {
		throw redirect(302, '/signin');
	}
};
