import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { decryptCookie } from '../../../utils/encoding';

export const load: PageServerLoad = async ({ cookies }) => {
	const encryptedCookie = cookies.get('7haven_init');
	let onboarding;
	if (encryptedCookie) {
		const decryptedData = decryptCookie(encryptedCookie);
		if (!decryptedData) {
			cookies.delete('7haven_init', { path: '/' });
			throw redirect(302, '/join');
		}
		onboarding = decryptedData;
	}

	/* if (url.pathname === '/join/verify' && (!onboarding?.userId || !onboarding?.email)) {
		throw redirect(302, '/join');
	}

	if (url.pathname === '/join/secure') {
		if (!onboarding?.userId || !onboarding?.email) {
			throw redirect(302, '/join');
		}
		if (!onboarding?.verified) {
			throw redirect(302, '/join/verify');
		}
	} */

	return {
		onboarding
	};
};
