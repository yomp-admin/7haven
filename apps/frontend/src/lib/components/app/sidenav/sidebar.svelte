<script lang="ts">
	import { cn } from '$lib/utils';
	import { menuItems } from './menuitems';
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';

	let currentPath = $derived($page.url.pathname);
</script>

<div class="relative h-full">
	<aside
		aria-label="Core Navigation Links"
		class="relative grid grid-flow-row auto-rows-max font-medium"
	>
		{#each menuItems as item}
			<a
				href={item.href}
				class="hover:bg-accent group relative cursor-pointer rounded-md px-4 py-2"
			>
				<span
					class={cn(
						'font-medium opacity-70 group-hover:opacity-100',
						currentPath === item.href && 'opacity-100'
					)}
				>
					{item.name}
				</span>
				{#if currentPath === item.href}
					<span class="bg-brand absolute -left-0 bottom-0 top-0 my-auto h-4 w-[3px] rounded-lg"
					></span>
				{/if}
			</a>
		{/each}
	</aside>

	<div class="absolute bottom-0">
		<Card.Root class="rounded-lg p-2">
			<Card.Header class="p-2">
				<Card.Title>Upgrade to Pro</Card.Title>
				<Card.Description class="text-xs">
					Unlock all features and get unlimited access.
				</Card.Description>
			</Card.Header>
			<Card.Content class="p-2">
				<Button size="sm" class="bg-brand dark:hover:text-primary-foreground w-full text-white"
					>Upgrade</Button
				>
			</Card.Content>
		</Card.Root>
	</div>
</div>
