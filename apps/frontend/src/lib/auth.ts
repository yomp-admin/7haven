import { decodeBase64 } from '@oslojs/encoding';

export async function createChallenge(): Promise<Uint8Array> {
	const response = await fetch('/api/auth/webauthn/challenge', { method: 'POST' });
	if (!response.ok) {
		throw new Error('Failed to create challenge');
	}
	const {
		data: { challenge }
	} = await response.json();
	return decodeBase64(challenge);
}

export async function registerPasskey(data: {
	name: string;
	attestation_object: string;
	client_data_json: string;
}) {
	const response = await fetch('/api/auth/webauthn/register', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data)
	});

	if (!response.ok) {
		throw new Error('Failed to register passkey');
	}

	return response.json();
}

export const getUserSecurityKeyCredentials = async (fetch: typeof globalThis.fetch) => {
	const response = await fetch('/api/auth/security-key/credentials', {
		method: 'GET'
	});
	if (response.ok) {
		const { data } = await response.json();
		return data;
	}
	return [];
};
