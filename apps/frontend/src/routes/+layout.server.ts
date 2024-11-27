import { remult } from 'remult';
import type { LayoutLoad } from './$types';
import { userController } from '../../../../packages/shared/controllers/auth/user';

export const load = (async ({ fetch }) => {
	remult.apiClient.url = 'http://localhost:3491/api';
	//remult.apiClient.httpClient = fetch;
	remult.useFetch(fetch);
	const user = await userController.current_user();
	console.log('user', user);
	return {
		user: remult.user
	};
}) satisfies LayoutLoad;
