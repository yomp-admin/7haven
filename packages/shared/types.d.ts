declare module 'remult' {
	export interface UserInfo {
		session: {
			id: string;
			expiresAt: Date;
			twoFactorVerified: boolean;
		};
	}

	interface FieldOptions<entityType, valueType> {
		placeholderText?: string;
	}
}

export {};
