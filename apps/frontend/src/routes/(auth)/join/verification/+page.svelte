<script lang="ts">
	import { Tooltip } from 'bits-ui';
	import { Button } from '@repo/ui/components/button';
	import { Label } from '@repo/ui/components/label';
	import { onMount } from 'svelte';

	let countdown = $state(30);
	let isCountdownFinished = $state(false);

	onMount(() => {
		const interval = setInterval(() => {
			countdown--;
			if (countdown <= 0) {
				isCountdownFinished = true;
				clearInterval(interval);
			}
		}, 1000);

		return () => clearInterval(interval);
	});
</script>

<div class="flex h-full w-full flex-col items-center justify-between gap-5">
	<div class="mb-[2px] size-28">
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="text-defaultbackground">
			<rect x="0" y="0" width="100" height="100" fill="currentColor">
				<animate fill="currentColor" dur="10s" repeatCount="indefinite" />
			</rect>
			<g id="particles">
				<circle cx="10" cy="10" r="0.5" fill="#4a5568">
					<animate
						attributeName="opacity"
						values="0;1;0"
						dur="3s"
						repeatCount="indefinite"
						begin="0s"
					/>
					<animateMotion path="M0 0 L20 20 Z" dur="3s" repeatCount="indefinite" begin="0s" />
				</circle>
				<circle cx="90" cy="90" r="0.5" fill="#4a5568">
					<animate
						attributeName="opacity"
						values="0;1;0"
						dur="3s"
						repeatCount="indefinite"
						begin="0.5s"
					/>
					<animateMotion path="M0 0 L-20 -20 Z" dur="3s" repeatCount="indefinite" begin="0.5s" />
				</circle>
				<circle cx="10" cy="90" r="0.5" fill="#4a5568">
					<animate
						attributeName="opacity"
						values="0;1;0"
						dur="3s"
						repeatCount="indefinite"
						begin="1s"
					/>
					<animateMotion path="M0 0 L20 -20 Z" dur="3s" repeatCount="indefinite" begin="1s" />
				</circle>
				<circle cx="90" cy="10" r="0.5" fill="#4a5568">
					<animate
						attributeName="opacity"
						values="0;1;0"
						dur="3s"
						repeatCount="indefinite"
						begin="1.5s"
					/>
					<animateMotion path="M0 0 L-20 20 Z" dur="3s" repeatCount="indefinite" begin="1.5s" />
				</circle>
				<circle cx="50" cy="10" r="0.5" fill="#4a5568">
					<animate
						attributeName="opacity"
						values="0;1;0"
						dur="3s"
						repeatCount="indefinite"
						begin="2s"
					/>
					<animateMotion path="M0 0 L0 80 Z" dur="3s" repeatCount="indefinite" begin="2s" />
				</circle>
				<circle cx="50" cy="90" r="0.5" fill="#4a5568">
					<animate
						attributeName="opacity"
						values="0;1;0"
						dur="3s"
						repeatCount="indefinite"
						begin="2.5s"
					/>
					<animateMotion path="M0 0 L0 -80 Z" dur="3s" repeatCount="indefinite" begin="2.5s" />
				</circle>
				<circle cx="10" cy="50" r="0.5" fill="#4a5568">
					<animate
						attributeName="opacity"
						values="0;1;0"
						dur="3s"
						repeatCount="indefinite"
						begin="1.2s"
					/>
					<animateMotion path="M0 0 L80 0 Z" dur="3s" repeatCount="indefinite" begin="1.2s" />
				</circle>
				<circle cx="90" cy="50" r="0.5" fill="#4a5568">
					<animate
						attributeName="opacity"
						values="0;1;0"
						dur="3s"
						repeatCount="indefinite"
						begin="0.7s"
					/>
					<animateMotion path="M0 0 L-80 0 Z" dur="3s" repeatCount="indefinite" begin="0.7s" />
				</circle>
			</g>
			<path
				d="M15 30 L50 50 L85 30 L85 70 L15 70 Z"
				fill="none"
				stroke="url(#holographic)"
				stroke-width="2"
			>
				<animate attributeName="stroke-dasharray" values="0 300;300 300" dur="3s" repeatCount="1" />
			</path>
			<path d="M15 30 L50 50 L85 30" fill="none" stroke="url(#holographic)" stroke-width="2">
				<animate
					attributeName="stroke-dasharray"
					values="0 300;300 300"
					dur="3s"
					begin="1s"
					repeatCount="1"
				/>
			</path>
			<circle cx="50" cy="50" r="35" fill="none" stroke="url(#pulse)" stroke-width="2">
				<animate attributeName="r" values="35;40;35" dur="2s" repeatCount="indefinite" />
				<animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
			</circle>
			<defs>
				<linearGradient id="holographic" x1="0%" y1="0%" x2="100%" y2="100%">
					<stop offset="0%" stop-color="#00ffff">
						<animate
							attributeName="stop-color"
							values="#00ffff;#ff00ff;#00ffff"
							dur="4s"
							repeatCount="indefinite"
						/>
					</stop>
					<stop offset="100%" stop-color="#ff00ff">
						<animate
							attributeName="stop-color"
							values="#ff00ff;#00ffff;#ff00ff"
							dur="4s"
							repeatCount="indefinite"
						/>
					</stop>
				</linearGradient>
				<radialGradient id="pulse" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
					<stop offset="0%" stop-color="#00ffff" stop-opacity="1" />
					<stop offset="100%" stop-color="#00ffff" stop-opacity="0" />
				</radialGradient>
			</defs>
		</svg>
	</div>
	<div class="flex w-full grow flex-col items-center justify-center gap-10 md:max-w-xl">
		<h2 class="text-center text-xl font-semibold">Email verification</h2>
		<div class="flex w-full flex-row justify-stretch gap-2">
			<div class="flex w-full">
				<div class="bg-accent h-2 w-full rounded"></div>
			</div>
			<div class="flex w-full">
				<Tooltip.Provider>
					<Tooltip.Root>
						<Tooltip.Trigger class="bg-accent-foreground h-2 w-full rounded"></Tooltip.Trigger>
						<Tooltip.Content>
							<div class="bg-background">
								<Tooltip.Arrow class="rounded-[2px] border-l border-t" />
							</div>
							<div
								class="bg-background shadow-popover flex items-center justify-center rounded-sm border px-2 text-[11px] font-medium outline-none"
							>
								Verify your email
							</div>
						</Tooltip.Content>
					</Tooltip.Root>
				</Tooltip.Provider>
			</div>
			<div class="flex w-full">
				<div class="bg-accent h-2 w-full rounded"></div>
			</div>
			<div class="flex w-full">
				<div class="bg-accent h-2 w-full rounded"></div>
			</div>
		</div>
		<div class="flex flex-col gap-2">
			<p class="flex flex-col text-center text-base">
				<span> A verification code has been sent to your email, </span>
				<span class="pt-3 font-semibold"> ***t@g*** </span>
			</p>
		</div>
		<div class="flex w-full flex-col items-center gap-1">
			<Label for="terms_id" class="text-xs">Didn't get the email?</Label>
			<Button
				id="terms_id"
				variant="link"
				class="text-brand p-0 text-xs font-medium opacity-80"
				disabled={!isCountdownFinished}
				>Re-send {countdown > 0 ? `in 00:${countdown.toString().padStart(2, '0')}` : ''}</Button
			>
		</div>
	</div>
</div>
