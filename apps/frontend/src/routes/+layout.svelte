<script lang="ts">
	import '@repo/ui/globals.css';
	import { Toaster } from '@repo/ui/components/ui/sonner';
	import { ModeWatcher } from 'mode-watcher';
	import { remult } from '@repo/shared';

	let { children, data } = $props();

	$effect.pre(() => {
		remult.user = data.user;
	});
</script>

<Toaster />
<ModeWatcher />

{@render children?.()}
