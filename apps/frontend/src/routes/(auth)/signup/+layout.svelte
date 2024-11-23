<script lang="ts">
	import { BrandIcon } from '$lib/components/icons/logo';
	import { Button } from '@repo/ui/components/ui/button';
	import { goto } from '$app/navigation';
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();

	const children_render = $derived(children);
</script>

<div class="container mx-auto grid grid-rows-[60px_1fr] gap-20">
	<div class="bg-defaultbackground sticky top-0 grid grid-cols-2 items-center border-b">
		<div class="flex">
			<a href="/" class="flex gap-2"> <BrandIcon /></a>
		</div>
		<div class="flex flex-row items-center justify-end gap-4">
			<a href="/">Need Help?</a>
			<Button variant="outline" class="h-7 px-6 text-xs" onclick={() => goto('/signin')}
				>Login</Button
			>
		</div>
	</div>
	{@render children_render?.()}
</div>
