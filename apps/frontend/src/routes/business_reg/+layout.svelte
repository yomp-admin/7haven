<script lang="ts">
	import { BrandIcon } from '$lib/components/icons/logo';
	import { UserCircle } from 'lucide-svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { remult } from '@repo/shared';

	let { children } = $props();
</script>

<div class="container mx-auto grid grid-rows-[60px_1fr] gap-20">
	<div class="bg-defaultbackground sticky top-0 grid grid-cols-2 items-center border-b">
		<div class="flex">
			<a href="/" class="flex gap-2"><BrandIcon /></a>
		</div>
		<div class="flex flex-row items-center justify-end gap-8">
			<a href="/">Need Help?</a>
			{#if remult.user}
				<DropdownMenu.Root>
					<DropdownMenu.Trigger>
						<UserCircle class="text-foreground-alt" />
					</DropdownMenu.Trigger>
					<DropdownMenu.Content>
						<DropdownMenu.Group>
							<DropdownMenu.GroupHeading>My Account</DropdownMenu.GroupHeading>
							<DropdownMenu.Separator />
							<DropdownMenu.Item>Logout</DropdownMenu.Item>
						</DropdownMenu.Group>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			{/if}
		</div>
	</div>
	{@render children?.()}
</div>
