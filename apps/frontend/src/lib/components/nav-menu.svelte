<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import SearchIcon from 'lucide-svelte/icons/search';
	import Bell from 'lucide-svelte/icons/bell';
	import CreditCard from 'lucide-svelte/icons/credit-card';
	import LogOut from 'lucide-svelte/icons/log-out';
	import BadgeCheck from 'lucide-svelte/icons/badge-check';
	import { setMode, resetMode, mode } from 'mode-watcher';
	import DarkModeIcon from 'lucide-svelte/icons/moon';
	import LightModeIcon from 'lucide-svelte/icons/sun';
	import SystemModeIcon from 'lucide-svelte/icons/tv-minimal';

	import * as Avatar from '$lib/components/ui/avatar';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { remult } from '@repo/shared';
	import Label from './ui/label/label.svelte';
	import * as ToggleGroup from '$lib/components/ui/toggle-group';
	import ThemeSwitcher from '$lib/components/theme-switcher.svelte';

	const hasNotifications = $state(true);
</script>

<div class="flex w-full items-center justify-between gap-4 px-4">
	<div class="relative flex w-[400px] items-center">
		<SearchIcon class="absolute left-3 h-4 w-4 text-muted-foreground" />
		<Input
			type="search"
			name="main_search"
			placeholder="Search..."
			class="h-9 rounded-full pl-10 focus-visible:ring-0 border-none bg-background/80"
		/>
	</div>

	<div class="flex items-center gap-2">
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				<div class="relative">
					{#if hasNotifications}
						<span
							class="absolute -right-1 size-3.5 rounded-full bg-destructive border-[2.5px] border-custom-background z-10"
						></span>
					{/if}
					<Avatar.Root class="size-9 hover:opacity-80 transition-opacity">
						<Avatar.Image src={remult.user?.avatar} alt={remult.user?.name} />
						<!-- <Avatar.Image
							src="https://avatar.vercel.sh/nigel.png"
							alt={remult.user?.name}
							class="rounded-full"
						/> -->
						<Avatar.Fallback class="rounded-full">
							{remult.user?.name?.[0]?.toUpperCase() ?? 'U'}
						</Avatar.Fallback>
					</Avatar.Root>
				</div>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content align="end" class="w-56 rounded-xl mt-2">
				<div class="px-2 py-2.5">
					<div class="flex flex-col">
						<p class="truncate text-sm font-medium leading-none">{remult.user?.name}</p>
						<p class="truncate text-xs leading-none text-muted-foreground mt-1.5">
							{remult.user?.email}
						</p>
					</div>
				</div>
				<DropdownMenu.Separator />
				<DropdownMenu.Group>
					<DropdownMenu.Item class="flex h-10 items-center px-3">
						<div class="flex w-4 mr-2">
							<BadgeCheck class="size-4" />
						</div>
						<span>Account</span>
					</DropdownMenu.Item>
					<DropdownMenu.Item class="flex h-10 items-center px-3">
						<div class="flex w-4 mr-2">
							<CreditCard class="size-4" />
						</div>
						<span>Billing</span>
					</DropdownMenu.Item>
					<DropdownMenu.Item class="flex h-10 items-center px-3">
						<div class="flex w-4 mr-2">
							<Bell class="size-4" />
						</div>
						<span>Notifications</span>
						<Label
							class="ml-auto rounded-2xl bg-primary/10 px-3 py-0.5 text-xs font-medium text-primary"
						>
							3
						</Label>
					</DropdownMenu.Item>
				</DropdownMenu.Group>
				<DropdownMenu.Separator />
				<DropdownMenu.Group>
					<div class="px-3 py-2">
						<div class="space-y-1.5">
							<div class="flex items-center justify-between">
								<span class="text-sm">Theme</span>
								<ThemeSwitcher />
								<!-- <ToggleGroup.Root
									type="single"
									value={themeMode}
									onValueChange={handleThemeChange}
									class="inline-flex h-9 items-center justify-center rounded-full border p-1"
								>
									{#each Object.entries(themeIcons) as [value, Icon]}
										<ToggleGroup.Item
											{value}
											aria-label="{value} theme"
											class="size-7 rounded-full data-[state=on]:bg-muted focus-visible:ring-0 focus:ring-0"
										>
											<Icon class="size-4" />
										</ToggleGroup.Item>
									{/each}
								</ToggleGroup.Root> -->
							</div>
						</div>
					</div>
				</DropdownMenu.Group>
				<DropdownMenu.Separator />
				<DropdownMenu.Item class="flex h-10 items-center px-3">
					<div class="flex w-4 mr-2">
						<LogOut class="size-4" />
					</div>
					<span>Log out</span>
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</div>
</div>
