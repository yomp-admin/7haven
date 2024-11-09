<script lang="ts">
	import '@repo/ui/globals.css';
	import { goto, invalidateAll } from '$app/navigation';
	import { remult } from '@repo/shared';
	import { Button } from '@repo/ui';

	let { children, data } = $props();

	$effect(() => {
		remult.user = data.user;
	});

	const signOut = async () => {
		const response = await fetch('/api/auth/sign-out', {
			method: 'POST'
		});
		if (response.ok) {
			remult.user = undefined;
			await invalidateAll();
			goto('/');
		}
	};
</script>

<div class="container pt-4">
	<nav>
		{#if data.user}
			Hello {data.user.name}
			<Button
				class="h-6 rounded-sm px-2 text-[10px] text-red-600"
				variant="outline"
				onclick={signOut}>Sign Out</Button
			>
			<a href="/settings">Settings</a>
		{/if}
	</nav>
	{@render children()}
</div>
