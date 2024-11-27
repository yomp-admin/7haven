import crypto from 'crypto';

const SECRET_KEY = crypto.randomBytes(32);
const IV_LENGTH = 16;

export function encryptCookie(data) {
	const iv = crypto.randomBytes(IV_LENGTH);
	const cipher = crypto.createCipheriv('aes-256-cbc', SECRET_KEY, iv);
	let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
	encrypted += cipher.final('hex');
	return `${iv.toString('hex')}:${encrypted}`;
}

export function decryptCookie(encryptedCookie) {
	try {
		const [ivHex, encryptedHex] = encryptedCookie.split(':');
		const iv = Buffer.from(ivHex, 'hex');
		const decipher = crypto.createDecipheriv('aes-256-cbc', SECRET_KEY, iv);
		let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
		decrypted += decipher.final('utf8');
		return JSON.parse(decrypted);
	} catch {
		return null;
	}
}
