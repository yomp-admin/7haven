<script lang="ts">
	import { goto } from '$app/navigation';
	import { remult } from '@repo/shared';
	import { Button } from '@repo/ui';
	import { Card } from '@repo/ui';
	import { Input } from '@repo/ui';
	import { Label } from '@repo/ui';

	let username = '';
	let error = '';

	async function signIn() {
		const response = await fetch('/api/auth/sign-in', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ username })
		});
		if (response.ok) {
			const { data } = await response.json();
			remult.user = data.userInfo;
			goto('/products');
		} else {
			const errorData = await response.json();
			error = errorData.data.email || 'Sign-in Error';
		}
	}
</script>

<main>
	{#if !remult.user}
		<form on:submit|preventDefault={signIn}>
			<Card.Root class="mx-auto mt-10 max-w-sm">
				<Card.Header>
					<Card.Title class="text-2xl">Login</Card.Title>
					<Card.Description>Enter your Email below to login to your account</Card.Description>
				</Card.Header>
				<Card.Content>
					<div class="grid gap-4">
						<div class="grid gap-2">
							<Label for="username">Email</Label>
							<div>
								<Input
									id="username"
									type="text"
									placeholder="m@example.com"
									required
									autocomplete="email"
									bind:value={username}
								/>
								{#if error}
									<div class="ml-1 mt-1 text-xs text-red-500">{error}</div>
								{/if}
							</div>
						</div>

						<!-- <div class="grid gap-2">
							<div class="flex items-center">
								<Label for="password">Password</Label>
								<a href="##" class="ml-auto inline-block text-sm underline">
									Forgot your password?
								</a>
							</div>
							<Input id="password" type="password" required />
						</div> -->
						<Button type="submit" class="w-full">Login</Button>
						<Button variant="outline" class="w-full">Login with Google</Button>
					</div>
					<div class="mt-4 text-center text-sm">
						Don't have an account?
						<a href="##" class="underline"> Sign up </a>
					</div>
				</Card.Content>
			</Card.Root>
		</form>
	{:else}
		<p>You are already logged in. <a href="/products">Go to Products</a></p>
	{/if}
</main>
