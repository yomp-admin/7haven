<script lang="ts">
	import AppShell from '$lib/components/app/app-shell.svelte';
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<AppShell>
	{@render children?.()}
</AppShell>
