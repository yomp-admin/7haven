import { writable } from 'svelte/store';
import type { UserInfo } from '@repo/shared';

interface AuthStore {
	user: UserInfo | null;
	isAuthenticated: boolean;
	isLoading: boolean;
}

const createAuthStore = () => {
	const { subscribe, set, update } = writable<AuthStore>({
		user: null,
		isAuthenticated: false,
		isLoading: true
	});

	return {
		subscribe,
		setUser: (user: UserInfo | null) => {
			update((state) => ({
				...state,
				user,
				isAuthenticated: !!user,
				isLoading: false
			}));
		},
		clearUser: () => {
			set({
				user: null,
				isAuthenticated: false,
				isLoading: false
			});
		},
		setLoading: (isLoading: boolean) => {
			update((state) => ({ ...state, isLoading }));
		}
	};
};

export const authStore = createAuthStore();
