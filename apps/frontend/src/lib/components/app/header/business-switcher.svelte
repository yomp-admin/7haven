<script lang="ts">
	import { Check, ChevronsUpDown, CirclePlus } from 'lucide-svelte';
	import { cn } from '@repo/ui/utils';
	import * as Avatar from '@repo/ui/components/ui/avatar';
	import { StoreIcon } from '$lib/components/icons/store-icon';
	import { Button } from '@repo/ui/components/ui/button';
	import * as Command from '@repo/ui/components/ui/command';
	import * as Dialog from '@repo/ui/components/ui/dialog';
	import { Input } from '@repo/ui/components/ui/input';
	import { Label } from '@repo/ui/components/ui/label';
	import * as Popover from '@repo/ui/components/ui/popover';
	import * as Select from '@repo/ui/components/ui/select';
	import { tick } from 'svelte';

	interface Props {
		class?: string | undefined | null;
	}

	let { class: className = undefined }: Props = $props();

	const groups = [
		{
			label: 'Personal',
			teams: [
				{
					label: '7Haven',
					value: 'Personal'
				}
			]
		},
		{
			label: 'Managed',
			teams: [
				{
					label: "Tanny's Fashion",
					value: 'Tannys fashion'
				},
				{
					label: 'Turbo Baby',
					value: 'turbo baby'
				}
			]
		}
	];

	type Team = (typeof groups)[number]['teams'][number];

	let open = $state(false);
	let showTeamDialog = $state(false);

	let selectedTeam: Team = $state(groups[0].teams[0]);

	function closeAndRefocusTrigger(triggerId: string) {
		open = false;

		tick().then(() => document.getElementById(triggerId)?.focus());
	}

	export { className as class };
</script>

<Dialog.Root bind:open={showTeamDialog}>
	<Popover.Root bind:open>
		<Popover.Trigger id="ids">
			{#snippet child({ props })}
				<Button
					{...props}
					variant="outline"
					role="combobox"
					aria-expanded={open}
					aria-label="Select a Business"
					class={cn(
						'group w-full justify-start border-0 bg-transparent pl-1 pr-2 shadow-none',
						className
					)}
				>
					<Avatar.Root class="mr-2 size-7 rounded-sm">
						<Avatar.Image
							src="https://avatar.vercel.sh/${selectedTeam.value}.png"
							alt={selectedTeam.label}
						/>
						<Avatar.Fallback class="bg-muted text-muted-foreground rounded-sm">
							<StoreIcon />
						</Avatar.Fallback>
					</Avatar.Root>
					<span class="w-[70%] overflow-clip text-ellipsis text-left font-extrabold opacity-80"
						>{selectedTeam.label}</span
					>
					<ChevronsUpDown class="ml-auto size-4 shrink-0 opacity-0 group-hover:opacity-50" />
				</Button>
			{/snippet}
			<Button
				variant="outline"
				role="combobox"
				aria-expanded={open}
				aria-label="Select a Business"
				class={cn(
					'group w-full justify-start border-0 bg-transparent pl-1 pr-2 shadow-none',
					className
				)}
			>
				<Avatar.Root class="mr-2 size-7 rounded-sm">
					<Avatar.Image
						src="https://avatar.vercel.sh/${selectedTeam.value}.png"
						alt={selectedTeam.label}
					/>
					<Avatar.Fallback class="bg-muted text-muted-foreground rounded-sm">
						<StoreIcon />
					</Avatar.Fallback>
				</Avatar.Root>
				<span class="w-[70%] overflow-clip text-ellipsis text-left font-extrabold opacity-80"
					>{selectedTeam.label}</span
				>
				<ChevronsUpDown class="ml-auto size-4 shrink-0 opacity-0 group-hover:opacity-50" />
			</Button>
		</Popover.Trigger>
		<Popover.Content class="w-[206px] p-0 shadow-sm">
			<Command.Root>
				<Command.List>
					<Command.Input placeholder="Search Business..." />
					<Command.Empty>No Business found.</Command.Empty>
					{#each groups as group}
						<Command.Group heading={group.label}>
							{#each group.teams as team}
								<Command.Item
									onSelect={() => {
										selectedTeam = team;
										closeAndRefocusTrigger('ids');
									}}
									value={team.value}
									class="cursor-pointer text-sm"
								>
									<Avatar.Root class="mr-2 size-5 rounded-sm">
										<Avatar.Image
											src="https://avatar.vercel.sh/${team.value}.png"
											alt={team.label}
										/>
										<Avatar.Fallback>SC</Avatar.Fallback>
									</Avatar.Root>
									<span class="overflow-clip text-ellipsis text-nowrap text-left">{team.label}</span
									>
									<Check
										class={cn(
											'ml-auto size-4',
											selectedTeam.value !== team.value && 'text-transparent'
										)}
									/>
								</Command.Item>
							{/each}
						</Command.Group>
					{/each}
				</Command.List>
				<Command.Separator />
				<Command.List>
					<Command.Group>
						<Command.Item
							onSelect={() => {
								open = false;
								showTeamDialog = true;
							}}
							class="cursor-pointer"
						>
							<CirclePlus class="mr-2 size-5" />
							Add Business
						</Command.Item>
					</Command.Group>
				</Command.List>
			</Command.Root>
		</Popover.Content>
	</Popover.Root>

	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Add Business</Dialog.Title>
			<Dialog.Description>Add a new Business to manage products and customers.</Dialog.Description>
		</Dialog.Header>
		<div>
			<div class="space-y-4 py-2 pb-4">
				<div class="space-y-2">
					<Label for="name">Team name</Label>
					<Input id="name" placeholder="ABC Inc." />
				</div>
				<div class="space-y-2">
					<Label for="plan">Subscription plan</Label>
					<Select.Root type="single">
						<Select.Trigger>Select a plan</Select.Trigger>
						<Select.Content>
							<Select.Item value="free">
								<span class="font-medium">Free </span>-<span class="text-muted-foreground">
									Trial for two weeks
								</span>
							</Select.Item>
							<Select.Item value="pro">
								<span class="font-medium">Pro</span> -
								<span class="text-muted-foreground"> $9/month per user </span>
							</Select.Item>
						</Select.Content>
					</Select.Root>
				</div>
			</div>
		</div>
		<Dialog.Footer>
			<Button variant="outline" onclick={() => (showTeamDialog = false)}>Cancel</Button>
			<Button type="submit">Continue</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
