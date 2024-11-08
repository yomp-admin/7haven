import { remult } from '@repo/shared';
import type { LayoutLoad } from './$types';

export const load = (async ({ fetch }) => {
	const response = await fetch('/api/auth/current-user');
	if (!response.ok) {
		console.error('Failed to fetch user info');
		remult.user = undefined;
	} else {
		const {
			data: { userInfo }
		} = await response.json();

		remult.user = userInfo;
	}
	//remult.apiClient.httpClient = fetch;
	/* const initUser = await remult.initUser();
	console.log('initUser', initUser); */
}) satisfies LayoutLoad;
