// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			onboarding?: {
				userId: string;
				email: string;
				verified: boolean;
			};
		}
	}
}

export {};
