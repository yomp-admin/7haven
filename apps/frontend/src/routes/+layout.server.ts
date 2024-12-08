import { remult } from '@repo/shared';
import type { LayoutServerLoad } from './$types';

export const load = (async () => {
	const user = await remult.initUser();
	return {
		user
	};
}) satisfies LayoutServerLoad;
