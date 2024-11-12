<script lang="ts">
	import { Input } from '@repo/ui/components/input';
	import { Button } from '@repo/ui/components/button';
	import * as Card from '@repo/ui/components/card';
	import { Label } from '@repo/ui/components/label';
	import { goto } from '$app/navigation';
	import * as Tabs from '@repo/ui/components/tabs';
	import { Separator } from '@repo/ui/components/separator';
	import { HelpCircleIcon } from 'lucide-svelte';
	import * as HoverCard from '@repo/ui/components/hover-card';

	type businessTypeItem = {
		name: string;
		value: string;
		description: string;
		disabled: boolean;
	};
	const businessType: businessTypeItem[] = [
		{
			name: 'Sole proprietor',
			value: 'sole-proprietor',
			description: 'A business that is not incorporated and owned by an individual.',
			disabled: false
		},
		{
			name: 'Private owned company',
			value: 'private-owned',
			description: 'A company owned by individuals, not publicly traded on stock exchange.',
			disabled: false
		},
		{
			name: 'Public owned company',
			value: 'public-owned',
			description: 'A company owned by the public through shares traded on the stock market.',
			disabled: true
		},
		{
			name: 'State owned company',
			value: 'state-owned',
			description: 'A company owned and operated by the government for commercial purposes.',
			disabled: true
		}
	];

	let selectedBusinessTab = $state('');
</script>

<div class="grid-rows grid gap-10 px-2">
	<Card.Root class="mx-auto w-3/4">
		<Card.Header>
			<Card.Title>
				<div class="flex items-center space-x-2">
					<span class="text-2xl font-extrabold">Business Registration Information</span>
					<HoverCard.Root>
						<HoverCard.Trigger>
							<HelpCircleIcon size="12" class="text-muted-foreground" />
						</HoverCard.Trigger>
						<HoverCard.Content class="w-80">
							<div class="text-xs">
								Business Registration Information includes details such as business name, structure,
								address, owners, and licenses. This information will be used for legal and
								regulatory compliance and helps ensure transparency and accountability on the
								marketplace.
							</div>
						</HoverCard.Content>
					</HoverCard.Root>
				</div>
			</Card.Title>
			<Card.Description class="text-xs"
				>Enter your company information for business verification.</Card.Description
			>
		</Card.Header>
		<Card.Content>
			<span class="font-semibold">Company Type</span>
			<Tabs.Root value="account" class="mt-3">
				<Tabs.List class="bg-background grid min-h-[78px] w-full grid-cols-4 gap-4">
					{#each businessType as company}
						<Tabs.Trigger
							onfocus={() => (selectedBusinessTab = company.value)}
							value={company.value}
							disabled={company.disabled}
							class="flex h-[75px] flex-col items-start justify-start border-2 border-dashed data-[state=active]:border-blue-500 data-[state=active]:bg-blue-100 data-[state=active]:shadow-none dark:data-[state=active]:bg-blue-500"
							><span class="text-foreground font-semibold">{company.name}</span><span
								class="text-wrap text-left text-[10px]">{company.description}</span
							></Tabs.Trigger
						>
					{/each}
				</Tabs.List>
				<Tabs.Content value="sole-proprietor">
					<Separator class="my-6" />
					<span class="font-semibold">Company Information</span>
					<div class="mt-4 grid gap-4">
						<div class="grid grid-cols-2 gap-4">
							<div class="grid gap-2">
								<Label for="first-name" class="text-[13px]"
									><span class="text-red-500">*</span> First name</Label
								>
								<Input
									id="first-name"
									placeholder="Max"
									required
									class="font-medium"
									autocomplete="given-name"
								/>
							</div>
							<div class="grid gap-2">
								<Label for="last-name" class="text-[13px]"
									><span class="text-red-500">*</span> Last name</Label
								>
								<Input id="last-name" placeholder="Robinson" required class="font-medium" />
							</div>
						</div>
						<div class="grid gap-2">
							<Label for="email" class="text-[13px]"
								><span class="text-red-500">*</span> Email</Label
							>
							<Input
								id="email"
								type="email"
								placeholder="Enter email"
								required
								class="font-medium"
								autocomplete="email"
							/>
						</div>
						<div class="grid gap-2">
							<Label for="password" class="text-[13px]"
								><span class="text-red-500">*</span> Password</Label
							>
							<Input
								id="password"
								type="password"
								placeholder="Enter password "
								class="font-medium"
							/>
						</div>
						<div class="grid gap-2">
							<Label for="password" class="text-[13px]"
								><span class="text-red-500">*</span> Confirm Password</Label
							>
							<Input
								id="confirm_password"
								type="password"
								placeholder="Re-enter password "
								class="font-medium"
							/>
						</div>
						<div class="pt-3">
							<p class="text-muted-foreground text-xs">
								By clicking submit, you have read and agree to our
								<a href="/terms" class="hover:text-primary underline underline-offset-4">
									Service Agreement</a
								>,
								<a href="/terms" class="hover:text-primary underline underline-offset-4">
									Free Membership Agreement
								</a>
								and
								<a href="/privacy" class="hover:text-primary underline underline-offset-4">
									Privacy Policy</a
								>.
							</p>
						</div>
					</div>
				</Tabs.Content>
				<Tabs.Content value="private-owned"></Tabs.Content>
			</Tabs.Root>
		</Card.Content>
	</Card.Root>
	{#if selectedBusinessTab !== ''}
		<Card.Root class="sticky bottom-0 mx-auto w-3/4 p-4">
			<div class="flex flex-row justify-end gap-4">
				<Button variant="outline" onclick={() => console.log(selectedBusinessTab)} class="px-10"
					>Save</Button
				>
				<Button
					onclick={() => goto('/signup/verification')}
					class="bg-brand dark:hover:text-primary-foreground px-10 text-white">Submit</Button
				>
			</div>
		</Card.Root>
	{/if}
</div>
