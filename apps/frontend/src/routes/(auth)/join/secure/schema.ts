import { z } from 'zod';

export const formSchema = z
	.object({
		password: z.string().regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).+$/, {
			message: 'Password must meet requirements'
		}),
		confirmPassword: z.string()
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ['confirmPassword']
	});

export type FormSchema = typeof formSchema;

// Helper function to calculate password strength (0-100)
export const calculatePasswordStrength = (password: string): number => {
	let strength = 0;

	// Length contribution (up to 25 points)
	strength += Math.min(25, (password.length / 12) * 25);

	// Character variety contribution
	if (/[A-Z]/.test(password)) strength += 15; // uppercase
	if (/[a-z]/.test(password)) strength += 15; // lowercase
	if (/[0-9]/.test(password)) strength += 15; // numbers
	if (/[^A-Za-z0-9]/.test(password)) strength += 15; // special chars

	// Bonus for combination (up to 15 points)
	const varietyCount = [/[A-Z]/, /[a-z]/, /[0-9]/, /[^A-Za-z0-9]/].filter((regex) =>
		regex.test(password)
	).length;
	strength += varietyCount * 3.75;

	return Math.min(100, strength);
};
