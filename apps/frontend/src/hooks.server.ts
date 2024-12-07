import { remult } from '@repo/shared';
import type { Handle } from '@sveltejs/kit';
import { decryptCookie } from './utils/encoding';

export const handle: Handle = async ({ event, resolve }) => {
	const onboardingCookie = event.cookies.get('haven_init');
	const sessionCookie = event.cookies.get('haven_auth');

	if (!sessionCookie) {
		remult.user = undefined;
	}

	if (onboardingCookie) {
		const res = await decryptCookie(onboardingCookie);

		if (!res) {
			event.cookies.delete('haven_init', { path: '/' });
		}

		if (res && typeof res === 'object' && 'userId' in res && 'email' in res && 'verified' in res) {
			event.locals.onboarding = {
				userId: res.userId as string,
				email: res.email as string,
				verified: res.verified as boolean
			};
		}
	}

	remult.apiClient.httpClient = event.fetch;

	return resolve(event);
};
