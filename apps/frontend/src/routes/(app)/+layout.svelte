<script lang="ts">
	import AppSidebar from '$lib/components/app/app-sidebar.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb';
	import { Separator } from '$lib/components/ui/separator';
	import ScrollArea from '$lib/components/ui/scroll-area/scroll-area.svelte';
	import NavMenu from '$lib/components/app/nav-menu.svelte';

	let { children } = $props();
</script>

<Sidebar.Provider>
	<AppSidebar />
	<Sidebar.Inset class="bg-custom-background">
		<header class="flex h-16 shrink-0 items-center gap-2">
			<div class="flex items-center gap-2 px-4">
				<Sidebar.Trigger class="-ml-1" />
				<Separator orientation="vertical" class="mr-2 h-4" />
				<Breadcrumb.Root>
					<Breadcrumb.List>
						<Breadcrumb.Item class="hidden md:block">
							<Breadcrumb.Link href="#">Home</Breadcrumb.Link>
						</Breadcrumb.Item>
						<Breadcrumb.Separator class="hidden md:block" />
						<Breadcrumb.Item>
							<Breadcrumb.Page>Overview</Breadcrumb.Page>
						</Breadcrumb.Item>
					</Breadcrumb.List>
				</Breadcrumb.Root>
			</div>
			<div class="ml-auto px-3">
				<NavMenu />
			</div>
		</header>
		<ScrollArea class="h-[calc(100vh-80px)] pr-5">
			<div class="flex flex-1 flex-col gap-4 pt-3">
				{@render children?.()}
			</div>
		</ScrollArea>
	</Sidebar.Inset>
</Sidebar.Provider>
