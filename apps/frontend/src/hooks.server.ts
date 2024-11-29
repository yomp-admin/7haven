import type { Handle } from '@sveltejs/kit';
import { decryptCookie } from './utils/encoding';

export const handle: Handle = async ({ event, resolve }) => {
	const cookie = event.cookies.get('7haven_init');

	if (cookie) {
		const res = await decryptCookie(cookie);

		if (!res) {
			event.cookies.delete('7haven_init', { path: '/' });
		}

		if (res && typeof res === 'object' && 'userId' in res && 'email' in res && 'verified' in res) {
			event.locals.onboarding = {
				userId: res.userId as string,
				email: res.email as string,
				verified: res.verified as boolean
			};
		}
	}

	return resolve(event);
};
