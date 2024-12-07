<script lang="ts">
	import '../app.css';
	import { Toaster } from '$lib/components/ui/sonner';
	import { ModeWatcher } from 'mode-watcher';
	import { remult } from '@repo/shared';

	let { data, children } = $props();

	$effect.pre(() => {
		remult.user = data.user;
	});
</script>

<Toaster />
<ModeWatcher />

{@render children?.()}
