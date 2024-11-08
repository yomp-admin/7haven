import { FixedRefillTokenBucket } from './rateLimit';

export const totpBucket = new FixedRefillTokenBucket<number>(5, 60 * 30);
export const recoveryCodeBucket = new FixedRefillTokenBucket<number>(5, 60 * 60);

import type { User } from '../lib/user';

export function get2FARedirect(user: User): string {
	if (user.mfaSettings.methods.includes('passkey')) {
		return '/2fa/passkey';
	}
	if (user.mfaSettings.methods.includes('securityKey')) {
		return '/2fa/security-key';
	}
	if (user.mfaSettings.methods.includes('totp')) {
		return '/2fa/totp';
	}
	return '/2fa/setup';
}

export function getPasswordReset2FARedirect(user: User): string {
	if (user.mfaSettings.methods.includes('passkey')) {
		return '/reset-password/2fa/passkey';
	}
	if (user.mfaSettings.methods.includes('securityKey')) {
		return '/reset-password/2fa/security-key';
	}
	if (user.mfaSettings.methods.includes('totp')) {
		return '/reset-password/2fa/totp';
	}
	return '/2fa/setup';
}
