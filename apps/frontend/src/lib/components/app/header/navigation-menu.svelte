<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { setMode, resetMode, mode } from 'mode-watcher';

	import SearchIcon from 'lucide-svelte/icons/search';
	import AddIcon from 'lucide-svelte/icons/plus';
	import ProductIcon from 'lucide-svelte/icons/package';
	import CategoryIcon from 'lucide-svelte/icons/square-stack';
	import ProductBrandIcon from 'lucide-svelte/icons/paintbrush';
	import NotificationIcon from 'lucide-svelte/icons/bell';
	import Help from 'lucide-svelte/icons/message-circle-question';
	import SettingsIcon from 'lucide-svelte/icons/settings-2';
	import UserIcon from 'lucide-svelte/icons/user';
	import DarkModeIcon from 'lucide-svelte/icons/moon';
	import LightModeIcon from 'lucide-svelte/icons/sun';
	import SystemModeIcon from 'lucide-svelte/icons/tv-minimal';

	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Button } from '$lib/components/ui/button';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import LogOutIcon from 'lucide-svelte/icons/log-out';

	let ThemeMode: 'light' | 'dark' | 'system' = $state($mode ?? 'system');

	const ThemeModeIcons = {
		light: LightModeIcon,
		dark: DarkModeIcon,
		system: SystemModeIcon
	};
</script>

<div class="relative -ml-2 flex w-3/5 items-center">
	<Input
		id="search"
		type="search"
		placeholder="Search..."
		class="focus-visible:bg-accent h-9 rounded-lg border-none pl-8 font-medium shadow-none focus-visible:ring-0 md:w-[40%] lg:w-[70%] dark:focus-visible:bg-opacity-30"
	/>
	<SearchIcon size="16" strokeWidth="2.3" class="absolute left-2 opacity-80" />
</div>
<div class="flex w-2/5 items-center justify-end">
	<Tooltip.Provider>
		<Tooltip.Root>
			<Tooltip.Trigger>
				<DropdownMenu.Root>
					<DropdownMenu.Trigger>
						{#snippet child({ props })}
							<Button
								{...props}
								variant="outline"
								size="icon"
								class="aria-expanded:bg-accent relative ml-[6px] size-9 rounded-full border-0 shadow-none focus-visible:ring-0 dark:hover:bg-opacity-50 dark:aria-expanded:bg-opacity-50"
							>
								<span class="rounded-full">
									<Help size="18" strokeWidth="2.3" class="focus-visible:ring-0" />
								</span>
							</Button>
						{/snippet}
					</DropdownMenu.Trigger>
					<DropdownMenu.Content class="w-52">
						<DropdownMenu.Label class="font-normal">
							<div class="flex flex-col space-y-1">
								<p class="text-sm font-medium leading-none">Resources</p>
							</div>
						</DropdownMenu.Label>
						<DropdownMenu.Separator />
						<DropdownMenu.Group>
							<DropdownMenu.Item>Seller Academy</DropdownMenu.Item>
							<DropdownMenu.Item>Privacy Policy</DropdownMenu.Item>
							<DropdownMenu.Item>Terms and Conditions</DropdownMenu.Item>
						</DropdownMenu.Group>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</Tooltip.Trigger>
			<Tooltip.Content>
				<p>Help</p>
			</Tooltip.Content>
		</Tooltip.Root>
	</Tooltip.Provider>
	<Tooltip.Provider>
		<Tooltip.Root>
			<Tooltip.Trigger>
				<DropdownMenu.Root>
					<DropdownMenu.Trigger>
						{#snippet child({ props })}
							<Button
								{...props}
								variant="outline"
								size="icon"
								class="aria-expanded:bg-accent relative ml-[6px] size-9 rounded-full border-0 shadow-none focus-visible:ring-0 dark:hover:bg-opacity-50 dark:aria-expanded:bg-opacity-50"
							>
								<span class="rounded-full">
									<NotificationIcon size="18" strokeWidth="2.3" class="focus-visible:ring-0" />
								</span>
							</Button>
						{/snippet}
					</DropdownMenu.Trigger>
					<DropdownMenu.Content class="w-56">
						<DropdownMenu.Label class="font-normal">
							<div class="flex flex-col space-y-1">
								<p class="text-sm font-medium leading-none">Notifications</p>
							</div>
						</DropdownMenu.Label>
						<DropdownMenu.Separator />
						<DropdownMenu.Group></DropdownMenu.Group>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</Tooltip.Trigger>
			<Tooltip.Content>
				<p>Notifications</p>
			</Tooltip.Content>
		</Tooltip.Root>
	</Tooltip.Provider>
	<Tooltip.Provider>
		<Tooltip.Root>
			<Tooltip.Trigger>
				<DropdownMenu.Root>
					<DropdownMenu.Trigger>
						{#snippet child({ props })}
							<Button
								{...props}
								variant="outline"
								size="icon"
								class="aria-expanded:bg-accent relative ml-[6px] size-9 rounded-full border-0 shadow-none focus-visible:ring-0 dark:hover:bg-opacity-50 dark:aria-expanded:bg-opacity-50"
							>
								<span class="rounded-full">
									<SettingsIcon size="18" strokeWidth="2.3" class="focus-visible:ring-0" />
								</span>
							</Button>
						{/snippet}
					</DropdownMenu.Trigger>
					<DropdownMenu.Content class="w-52" align="end">
						<DropdownMenu.Label class="font-normal">
							<div class="flex flex-col space-y-1">
								<p class="text-sm font-medium leading-none">Settings</p>
							</div>
						</DropdownMenu.Label>
						<DropdownMenu.Separator />
						<DropdownMenu.Group>
							<DropdownMenu.Item>
								<SettingsIcon size="16" strokeWidth="2.3" class="mr-2" />
								All Settings
								<DropdownMenu.Shortcut>⇧⌘P</DropdownMenu.Shortcut>
							</DropdownMenu.Item>
							<DropdownMenu.Item>
								<UserIcon size="16" strokeWidth="2.3" class="mr-2" />
								Profile
								<DropdownMenu.Shortcut>⌘S</DropdownMenu.Shortcut>
							</DropdownMenu.Item>
							<DropdownMenu.Sub>
								<DropdownMenu.SubTrigger>
									{@const SvelteComponent = ThemeModeIcons[ThemeMode]}
									<SvelteComponent size="16" strokeWidth="2.3" class="mr-2" />
									Theme
								</DropdownMenu.SubTrigger>
								<DropdownMenu.SubContent>
									<DropdownMenu.RadioGroup bind:value={ThemeMode}>
										<DropdownMenu.RadioItem value="light" onclick={() => setMode('light')}>
											Light
											<LightModeIcon size="16" strokeWidth="2.3" class="ml-auto mr-2" />
										</DropdownMenu.RadioItem>
										<DropdownMenu.RadioItem value="dark" onclick={() => setMode('dark')}>
											Dark
											<DarkModeIcon size="16" strokeWidth="2.3" class="ml-auto mr-2" />
										</DropdownMenu.RadioItem>
										<DropdownMenu.Separator />
										<DropdownMenu.RadioItem value="system" onclick={() => resetMode()}>
											System
											<SystemModeIcon size="16" strokeWidth="2.3" class="ml-auto mr-2" />
										</DropdownMenu.RadioItem>
									</DropdownMenu.RadioGroup>
								</DropdownMenu.SubContent>
							</DropdownMenu.Sub>
							<DropdownMenu.Separator />
							<DropdownMenu.Item>
								<LogOutIcon size="16" strokeWidth="2.3" class="mr-2" />
								Logout
							</DropdownMenu.Item>
						</DropdownMenu.Group>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</Tooltip.Trigger>
			<Tooltip.Content>
				<p>Settings</p>
			</Tooltip.Content>
		</Tooltip.Root>
	</Tooltip.Provider>
	<Tooltip.Provider>
		<Tooltip.Root>
			<Tooltip.Trigger>
				<DropdownMenu.Root>
					<DropdownMenu.Trigger>
						{#snippet child({ props })}
							<Button
								{...props}
								variant="outline"
								size="icon"
								class="aria-expanded:bg-accent relative ml-[6px] size-10 rounded-full border-0 shadow-none focus-visible:ring-0 dark:hover:bg-opacity-50 dark:aria-expanded:bg-opacity-50"
							>
								<span class="border-brand bg-brand rounded-full border p-[3px] text-white">
									<AddIcon size="18" strokeWidth="2.3" class="focus-visible:ring-0" />
								</span>
							</Button>
						{/snippet}
					</DropdownMenu.Trigger>
					<DropdownMenu.Content class="w-52" align="end">
						<DropdownMenu.Label class="font-normal">
							<div class="flex flex-col space-y-1">
								<p class="text-sm font-medium leading-none">Add New</p>
							</div>
						</DropdownMenu.Label>
						<DropdownMenu.Separator />
						<DropdownMenu.Group>
							<DropdownMenu.Item>
								<ProductIcon size="16" strokeWidth="2.3" class="mr-2" />
								Product
								<DropdownMenu.Shortcut>⇧⌘P</DropdownMenu.Shortcut>
							</DropdownMenu.Item>
							<DropdownMenu.Item>
								<CategoryIcon size="16" strokeWidth="2.3" class="mr-2" />
								Category
								<DropdownMenu.Shortcut>⌘B</DropdownMenu.Shortcut>
							</DropdownMenu.Item>
							<DropdownMenu.Item>
								<ProductBrandIcon size="16" strokeWidth="2.3" class="mr-2" />
								Brand
								<DropdownMenu.Shortcut>⌘S</DropdownMenu.Shortcut>
							</DropdownMenu.Item>
						</DropdownMenu.Group>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</Tooltip.Trigger>
			<Tooltip.Content>
				<p>Add New</p>
			</Tooltip.Content>
		</Tooltip.Root>
	</Tooltip.Provider>
</div>
