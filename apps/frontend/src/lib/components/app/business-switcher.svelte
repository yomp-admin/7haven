<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import ChevronDown from 'lucide-svelte/icons/chevron-down';
	import Plus from 'lucide-svelte/icons/plus';

	let {
		businesses
	}: {
		businesses: {
			name: string;
			logo: any;
			plan: string;
		}[];
	} = $props();

	let activeBusiness = $state(businesses[0]);
</script>

<Sidebar.Menu>
	<Sidebar.MenuItem>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<Sidebar.MenuButton {...props} class="h-auto">
						<div
							class="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg"
						>
							<activeBusiness.logo class="size-4" />
						</div>
						<div class="grid flex-1 text-left text-sm leading-tight">
							<span class="truncate font-semibold">{activeBusiness.name} </span>
							<span class="truncate text-xs">{activeBusiness.plan}</span>
						</div>
						<ChevronDown class="opacity-50" />
					</Sidebar.MenuButton>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content class="w-64 rounded-lg" align="start" side="bottom" sideOffset={4}>
				<DropdownMenu.Label class="text-muted-foreground text-xs">Invited</DropdownMenu.Label>
				{#each businesses as business, index (business.name)}
					<DropdownMenu.Item onSelect={() => (activeBusiness = business)} class="gap-2 p-2">
						<div class="flex size-6 items-center justify-center rounded-sm border">
							<business.logo class="size-4 shrink-0" />
						</div>
						{business.name}
						<DropdownMenu.Shortcut>⌘{index + 1}</DropdownMenu.Shortcut>
					</DropdownMenu.Item>
				{/each}
				<DropdownMenu.Separator />
				<DropdownMenu.Item class="gap-2 p-2">
					<div class="bg-background flex size-6 items-center justify-center rounded-md border">
						<Plus class="size-4" />
					</div>
					<div class="text-muted-foreground font-medium">Add business</div>
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</Sidebar.MenuItem>
</Sidebar.Menu>
