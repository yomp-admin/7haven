<script lang="ts" module>
	export const COUNTDOWN = {
		DURATION: 60,
		INTERVAL: 1000,
		STORAGE_KEY: 'countdown_end'
	} as const;
</script>

<script lang="ts">
	import { Button } from '$lib/components/ui/button';

	const { config, label, onclick } = $props<{
		config: {
			duration: number;
			storageKey: string;
		};
		label: string;
		onclick: () => void | Promise<void>;
	}>();

	let timeLeft = $state<number>(0);
	let isCounting = $state(false);

	function initializeCountdown() {
		const storedEndTime = localStorage.getItem(config.storageKey);
		if (storedEndTime) {
			const endTime = parseInt(storedEndTime);
			const now = Date.now();
			if (endTime > now) {
				const remaining = Math.ceil((endTime - now) / 1000);
				if (remaining > 0) {
					timeLeft = remaining;
					isCounting = true;
					startCountdownInterval(endTime);
				}
			} else {
				localStorage.removeItem(config.storageKey);
			}
		}
	}

	function startCountdownInterval(endTime: number) {
		const interval = setInterval(() => {
			const now = Date.now();
			const remaining = Math.ceil((endTime - now) / 1000);

			if (remaining <= 0) {
				isCounting = false;
				localStorage.removeItem(config.storageKey);
				clearInterval(interval);
				timeLeft = config.duration;
			} else {
				timeLeft = remaining;
			}
		}, COUNTDOWN.INTERVAL);

		return () => clearInterval(interval);
	}

	function startCountdown() {
		if (isCounting) return;

		timeLeft = config.duration;
		isCounting = true;

		const endTime = Date.now() + config.duration * 1000;
		localStorage.setItem(config.storageKey, endTime.toString());

		startCountdownInterval(endTime);
	}

	$effect(() => {
		initializeCountdown();
	});
</script>

<Button
	variant="link"
	class="text-muted-foreground text-xs"
	disabled={isCounting}
	onclick={() => {
		if (isCounting) return;
		onclick();
		startCountdown();
	}}
>
	{#if isCounting}
		{label} in {timeLeft}s
	{:else}
		{label}
	{/if}
</Button>
