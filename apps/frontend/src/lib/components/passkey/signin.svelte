<script lang="ts">
	// ... existing imports ...

	export let mode: 'login' | 'manage' = 'login';

	function handleDeletePasskey() {
		// Implement your delete logic here
		console.log('Passkey deleted');
		// Add actual deletion logic as needed
	}
</script>

{#if mode === 'login'}
	<h2>Sign In with Passkey</h2>
{:else}
	<h3>Your Registered Passkeys</h3>
{/if}

{#if mode === 'manage'}
	<button on:click={handleDeletePasskey}>Delete Passkey</button>
{/if}
