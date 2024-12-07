export async function passwordSignIn(email: string, password: string): Promise<Response> {
	const response = await fetch('http://localhost:3491/api/auth/sign-in', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		credentials: 'include',
		body: JSON.stringify({ email, password })
	});

	return response;
}
