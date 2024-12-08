<script lang="ts">
	import { cn } from '$lib/utils';
	import { setMode, resetMode, mode, userPrefersMode } from 'mode-watcher';
	import DarkModeIcon from 'lucide-svelte/icons/moon';
	import LightModeIcon from 'lucide-svelte/icons/sun';
	import SystemModeIcon from 'lucide-svelte/icons/tv-minimal';

	type Theme = 'light' | 'dark' | 'system';

	let currentTheme = $state<Theme>($userPrefersMode ?? 'system');

	const themes = $derived([
		{ value: 'system', icon: SystemModeIcon },
		{ value: 'light', icon: LightModeIcon },
		{ value: 'dark', icon: DarkModeIcon }
	] as const);

	function toggleTheme(newTheme: Theme) {
		if (newTheme === currentTheme) return;

		currentTheme = newTheme;
		if (newTheme === 'system') {
			resetMode();
		} else {
			setMode(newTheme);
		}
	}
</script>

<div class="flex items-center gap-1 rounded-full bg-muted p-1">
	{#each themes as theme}
		<button
			class={cn(
				'inline-flex items-center justify-center rounded-full p-1.5 text-sm font-medium transition-all',
				'hover:bg-background hover:text-foreground',
				'outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0',
				currentTheme === theme.value && 'bg-background text-foreground shadow-sm'
			)}
			onclick={() => toggleTheme(theme.value)}
		>
			<theme.icon class="size-4" />
		</button>
	{/each}
</div>
