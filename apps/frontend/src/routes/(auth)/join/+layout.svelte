<script lang="ts">
	import { BrandIcon } from '$lib/components/icons/logo';
	import { Button } from '$lib/components/ui/button';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { Mail, ShieldCheck, CheckCircle2 } from 'lucide-svelte';

	let { children } = $props();

	const steps = [
		{ id: 1, name: 'Email', href: '/join', icon: Mail },
		{ id: 2, name: 'Verify', href: '/join/verify', icon: CheckCircle2 },
		{ id: 3, name: 'Secure', href: '/join/secure', icon: ShieldCheck }
	];

	const currentStep = $derived(steps.findIndex((step) => step.href === $page.url.pathname) + 1);
</script>

<div class="mx-auto grid min-h-screen grid-rows-[60px_1fr] md:container">
	<div class="bg-defaultbackground sticky top-0 z-50 grid grid-cols-2 items-center border-b px-4">
		<a href="/" class="flex items-center">
			<BrandIcon />
		</a>
		<div class="flex flex-row items-center justify-end gap-4">
			<a href="/" class="text-muted-foreground hover:text-primary text-sm">Need Help?</a>
			<Button variant="outline" class="h-7 px-6 text-xs" onclick={() => goto('/signin')}>
				Login
			</Button>
		</div>
	</div>

	<div class="flex flex-col items-center px-4">
		<nav aria-label="Progress" class="my-8">
			<ol role="list" class="flex items-center gap-x-2 sm:gap-x-6">
				{#each steps as step}
					{@const status =
						step.id < currentStep ? 'complete' : step.id === currentStep ? 'current' : 'upcoming'}
					<li>
						{#if status === 'complete'}
							<a href={step.href} class="group flex items-center gap-x-2">
								<div class="bg-primary flex h-8 w-8 items-center justify-center rounded-full">
									<step.icon class="text-primary-foreground h-4 w-4" aria-hidden="true" />
								</div>
								<span class="text-primary text-sm font-medium">{step.name}</span>
							</a>
						{:else if status === 'current'}
							<a href={step.href} class="flex items-center gap-x-2" aria-current="step">
								<div
									class="border-primary flex h-8 w-8 items-center justify-center rounded-full border-2"
								>
									<step.icon class="text-primary h-4 w-4" aria-hidden="true" />
								</div>
								<span class="text-primary text-sm font-medium">{step.name}</span>
							</a>
						{:else}
							<a href={step.href} class="group flex items-center gap-x-2">
								<div
									class="border-muted flex h-8 w-8 items-center justify-center rounded-full border-2"
								>
									<step.icon class="text-muted-foreground h-4 w-4" aria-hidden="true" />
								</div>
								<span class="text-muted-foreground text-sm font-medium">
									{step.name}
								</span>
							</a>
						{/if}
					</li>

					{#if step.id !== steps.length}
						{#if status === 'complete'}
							<li class="bg-primary h-0.5 w-12 sm:w-16"></li>
						{:else}
							<li class="bg-muted h-0.5 w-12 sm:w-16"></li>
						{/if}
					{/if}
				{/each}
			</ol>
		</nav>

		<div class="w-full max-w-xl">
			{#if children}
				{@render children()}
			{/if}
		</div>
	</div>
</div>
