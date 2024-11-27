import { writable } from 'svelte/store';
import { getContext, setContext } from 'svelte';

type OnboardingState = {
	email?: string;
	userId?: string;
	isEmailVerified: boolean;
	isSecuritySet: boolean;
};

const key = Symbol('seller_onboarding');

function createStore() {
	const { subscribe, set, update } = writable<OnboardingState>({
		isEmailVerified: false,
		isSecuritySet: false
	});

	return {
		subscribe,
		setEmail: (email: string, userId: string) => update((s) => ({ ...s, email, userId })),
		setEmailVerified: (v: boolean) => update((s) => ({ ...s, isEmailVerified: v })),
		setSecuritySet: (v: boolean) => update((s) => ({ ...s, isSecuritySet: v })),
		reset: () => set({ isEmailVerified: false, isSecuritySet: false })
	};
}

export const getOnboardingContext = () => getContext<ReturnType<typeof createStore>>(key);
export const setOnboardingContext = () => setContext(key, createStore());
