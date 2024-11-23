<script lang="ts">
	import BusinessSwitcher from './header/business-switcher.svelte';
	import NavigationMenu from './header/navigation-menu.svelte';
	import Sidebar from './sidenav/sidebar.svelte';
	import { ScrollArea } from '@repo/ui/components/ui/scroll-area';

	let { children } = $props();
</script>

<div class="grid h-screen grid-cols-[clamp(180px,15vw,210px)_1fr,auto] grid-rows-[60px_1fr] pl-5">
	<div class="col-[1/2] row-[1/2] -ml-2 flex items-center pr-3">
		<BusinessSwitcher />
	</div>
	<div class="bg-background col-[2/3] row-[1/2] flex w-full flex-row pl-10">
		<NavigationMenu />
	</div>
	<div class="col-[1/2] row-[2/3] -ml-2 pb-2 pr-3 pt-5">
		<Sidebar />
	</div>
	<ScrollArea class="bg-background col-[2/3] row-[2/3] px-10 pt-2">
		{@render children?.()}
	</ScrollArea>
	<div class="bg-background col-[3/4] row-[1/3] pl-1">
		<div class="flex h-full w-10 items-center border-l">
			<p class="p-3">+</p>
		</div>
	</div>
</div>
