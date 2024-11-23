<script lang="ts">
	import { BrandIcon } from '$lib/components/icons/logo';
	import { Button } from '@repo/ui/components/ui/button';
	import { CircleUser } from 'lucide-svelte';
	import * as DropdownMenu from '@repo/ui/components/ui/dropdown-menu/index.js';
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();

	const children_render = $derived(children);
</script>

<div class="container mx-auto grid grid-rows-[60px_1fr] gap-20">
	<div class="bg-defaultbackground sticky top-0 grid grid-cols-2 items-center border-b">
		<div class="flex">
			<a href="/" class="flex gap-2"><BrandIcon /></a>
		</div>
		<div class="flex flex-row items-center justify-end gap-4">
			<a href="/">Need Help?</a>
			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
					{#snippet child({ props })}
						<Button variant="secondary" size="icon" class="rounded-full">
							<CircleUser class="h-5 w-5" />
							<span class="sr-only">Toggle user menu</span>
						</Button>
					{/snippet}
				</DropdownMenu.Trigger>
				<DropdownMenu.Content align="end">
					<DropdownMenu.Label>My Account</DropdownMenu.Label>
					<DropdownMenu.Separator />
					<DropdownMenu.Item>Logout</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</div>
	</div>
	{@render children_render?.()}
</div>
