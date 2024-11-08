import { decodeBase64 } from '@oslojs/encoding';
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';
import { config } from '@/config/config';

const ALGORITHM = 'aes-128-gcm';
const IV_LENGTH = 12;
const TAG_LENGTH = 16;

const key = decodeBase64(config.ENCRYPTION_KEY);

if (key.length !== 16) {
	throw new Error(`Invalid encryption key length. Expected 16 bytes, got ${key.length}`);
}

export function encrypt(data: Uint8Array): Uint8Array {
	const iv = randomBytes(IV_LENGTH);
	const cipher = createCipheriv(ALGORITHM, key, iv);

	const encrypted = Buffer.concat([
		iv,
		cipher.update(Buffer.from(data)),
		cipher.final(),
		cipher.getAuthTag()
	]);

	return new Uint8Array(encrypted);
}

export function encryptString(data: string): Uint8Array {
	return encrypt(new TextEncoder().encode(data));
}

export function decrypt(encrypted: Uint8Array): Uint8Array {
	if (encrypted.length < IV_LENGTH + TAG_LENGTH) {
		throw new Error('Invalid encrypted data length');
	}

	const iv = encrypted.slice(0, IV_LENGTH);
	const authTag = encrypted.slice(encrypted.length - TAG_LENGTH);
	const ciphertext = encrypted.slice(IV_LENGTH, encrypted.length - TAG_LENGTH);

	const decipher = createDecipheriv(ALGORITHM, key, iv);
	decipher.setAuthTag(authTag);

	const decrypted = Buffer.concat([decipher.update(Buffer.from(ciphertext)), decipher.final()]);

	return new Uint8Array(decrypted);
}

export function decryptToString(data: Uint8Array): string {
	return new TextDecoder().decode(decrypt(data));
}
