<script lang="ts">
	import TallyIcon from 'lucide-svelte/icons/tally-1';
	import * as Tooltip from '@repo/ui/components/tooltip';
	import { Button } from '@repo/ui/components/button';
	import { Label } from '@repo/ui/components/label';
	import { Input } from '@repo/ui/components/input';
	import { goto } from '$app/navigation';
	import * as Tabs from '@repo/ui/components/tabs';
	import { Separator } from '@repo/ui/components/separator';
	import FingerprintIcon from 'lucide-svelte/icons/fingerprint';
	import AsteriskIcon from 'lucide-svelte/icons/asterisk';

	type secureTypeItem = {
		name: string;
		value: string;
		description: string;
		label: string;
		disabled: boolean;
	};
	const secureType: secureTypeItem[] = [
		{
			name: 'Passkey',
			value: 'passkey',
			description: 'Fingerprint, Face ID, etc',
			label: 'More Secure',
			disabled: false
		},
		{
			name: 'Password',
			value: 'password',
			description: 'Alphanumeric',
			label: 'Less Secure',
			disabled: false
		}
	];

	let secureTypeTab = $state('');
</script>

<div class="flex h-full w-full flex-col items-center justify-between gap-5">
	<div class="mb-[2px] size-28">
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="text-defaultbackground">
			<defs>
				<linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
					<stop offset="0%" style="stop-color:#2c3e50;stop-opacity:1" />
					<stop offset="100%" style="stop-color:#3498db;stop-opacity:1" />
				</linearGradient>
				<linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
					<stop offset="0%" style="stop-color:#3498db;stop-opacity:0.8" />
					<stop offset="100%" style="stop-color:#2980b9;stop-opacity:0.9" />
				</linearGradient>
			</defs>

			<!-- Background -->
			<rect x="0" y="0" width="100" height="100" fill="currentColor" />

			<!-- Shield -->
			<path
				class="text-green-400"
				d="M50 20 L80 35 V60 C80 70 65 80 50 90 C35 80 20 70 20 60 V35 Z"
				fill="currentColor"
			>
				<animate
					attributeName="d"
					values="M50 20 L80 35 V60 C80 70 65 80 50 90 C35 80 20 70 20 60 V35 Z;
					M50 22 L78 37 V58 C78 68 63 78 50 88 C37 78 22 68 22 58 V37 Z;
					M50 20 L80 35 V60 C80 70 65 80 50 90 C35 80 20 70 20 60 V35 Z"
					dur="3s"
					repeatCount="indefinite"
				/>
			</path>

			<!-- Lock body -->
			<rect x="38" y="45" width="24" height="20" rx="3" fill="#ecf0f1" />

			<!-- Lock shackle -->
			<path d="M44 45 V40 C44 33 56 33 56 40 V45" stroke="#ecf0f1" stroke-width="4" fill="none" />

			<!-- Pulsing dots -->
			<circle cx="20" cy="20" r="2" fill="#e74c3c">
				<animate attributeName="r" values="1;3;1" dur="2s" repeatCount="indefinite" />
			</circle>
			<circle cx="80" cy="80" r="2" fill="#2ecc71">
				<animate attributeName="r" values="1;3;1" dur="2s" repeatCount="indefinite" />
			</circle>

			<!-- Scanning line -->
			<line x1="0" y1="50" x2="100" y2="50" stroke="#ecf0f1" stroke-width="0.5">
				<animateTransform
					attributeName="transform"
					type="translate"
					from="0 -50"
					to="0 100"
					dur="3s"
					repeatCount="indefinite"
				/>
				<animate attributeName="opacity" values="0;1;0" dur="3s" repeatCount="indefinite" />
			</line>
		</svg>
	</div>
	<div class="flex w-full grow flex-col items-center justify-center gap-10 md:max-w-xl">
		<h2 class="text-center text-xl font-semibold">Secure your account</h2>
		<div class="flex w-full flex-row justify-stretch gap-2">
			<div class="flex w-full">
				<div class="bg-accent h-2 w-full rounded"></div>
			</div>
			<div class="flex w-full">
				<div class="bg-accent h-2 w-full rounded"></div>
			</div>
			<div class="flex w-full">
				<Tooltip.Provider>
					<Tooltip.Root>
						<Tooltip.Trigger class="bg-accent-foreground h-2 w-full rounded"></Tooltip.Trigger>
						<Tooltip.Content>
							<div
								class="bg-background shadow-popover flex items-center justify-center rounded-sm border px-2 text-[11px] font-medium outline-none"
							>
								Secure your account
							</div>
						</Tooltip.Content>
					</Tooltip.Root>
				</Tooltip.Provider>
			</div>
			<div class="flex w-full">
				<div class="bg-accent h-2 w-full rounded"></div>
			</div>
		</div>
		<div class="flex w-full flex-col gap-4">
			<p class="">How do you want to secure your account?</p>
			<Tabs.Root value="account">
				<Tabs.List class="grid h-auto w-full grid-cols-2 gap-4 bg-transparent">
					{#each secureType as secure}
						<Tabs.Trigger
							onfocus={() => (secureTypeTab = secure.value)}
							value={secure.value}
							disabled={secure.disabled}
							class="focus-visible:none flex flex-col items-center justify-center border-2 p-4 {secure.value ===
							'passkey'
								? 'data-[state=active]:border-green-500'
								: 'data-[state=active]:border-orange-500'} data-[state=active]:shadow-none"
						>
							{#if secure.value === 'passkey'}
								<FingerprintIcon class="size-10 opacity-50" />
							{:else}
								<div class="flex items-center opacity-50">
									<AsteriskIcon class="size-6" />
									<TallyIcon class="size-10" />
								</div>
							{/if}
							<span class="text-foreground text-center font-semibold">{secure.name}</span>
							<span
								class="text-wrap text-center text-[12px] text-white {secure.value === 'passkey'
									? 'bg-green-500'
									: 'bg-orange-500'} text-foreground rounded-sm px-3 font-semibold"
								>{secure.label}</span
							>
						</Tabs.Trigger>
					{/each}
				</Tabs.List>
				<Tabs.Content value="password">
					<Separator class="my-5" />
					<div class="grid gap-4">
						<div class="grid grid-flow-row gap-2">
							<div class="grid gap-1">
								<Label for="password_id" class="min-w-fit text-sm font-medium">Password</Label>
								<div class="relative flex items-center">
									<Input
										id="password_id"
										type="password"
										placeholder="Enter your secure password"
										required
										class="pl-14 text-[16px] font-medium shadow-none"
									/>
									<div class="absolute left-4 flex items-center gap-x-2.5 opacity-30">
										<AsteriskIcon class="size-3.5" />
										<TallyIcon class="size-4" />
									</div>
								</div>
							</div>
							<div class="grid gap-1">
								<Label for="password_confirm_id" class="min-w-fit text-sm font-medium"
									>Confirm</Label
								>
								<div class="relative flex items-center">
									<Input
										id="password_confirm_id"
										type="password"
										placeholder="Confirm your secure password"
										required
										class="pl-14 text-[16px] font-medium shadow-none"
									/>
									<div class="absolute left-4 flex items-center gap-x-2.5 opacity-30">
										<AsteriskIcon class="size-3.5" />
										<TallyIcon class="size-4" />
									</div>
								</div>
							</div>
							<div class="mt-5">
								<Button onclick={() => goto('/join/verification')} class="w-full px-10 shadow-none"
									>Next</Button
								>
							</div>
						</div>
					</div>
				</Tabs.Content>
			</Tabs.Root>
		</div>
	</div>
</div>
