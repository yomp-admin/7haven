import { remult } from 'remult';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ fetch }) => {
	remult.apiClient.url = 'http://localhost:3491/api';
	remult.useFetch(fetch);
	return {
		user: remult.user
	};
}) satisfies LayoutServerLoad;
