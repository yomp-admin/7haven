import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, url }) => {
	const hasBasicInfo = locals.onboarding?.userId && locals.onboarding?.email;
	const { pathname } = url;

	if (pathname === ROUTES.VERIFY && !hasBasicInfo) {
		handleRedirect(ROUTES.JOIN);
	}

	if (pathname === ROUTES.SECURE) {
		if (!hasBasicInfo) {
			handleRedirect(ROUTES.JOIN);
		}
		if (!locals.onboarding?.verified) {
			handleRedirect(ROUTES.VERIFY);
		}
	}

	return {
		onboarding: locals.onboarding
	};
};

const ROUTES = {
	JOIN: '/join',
	VERIFY: '/join/verify',
	SECURE: '/join/secure'
} as const;

function handleRedirect(path: string): never {
	throw redirect(302, path);
}
