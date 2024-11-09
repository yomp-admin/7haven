import { remult } from '@repo/shared';
import type { LayoutLoad } from './$types';

export const load = (async ({ fetch }) => {
	remult.apiClient.httpClient = fetch;
	return {
		user: await remult.initUser()
	};
}) satisfies LayoutLoad;
