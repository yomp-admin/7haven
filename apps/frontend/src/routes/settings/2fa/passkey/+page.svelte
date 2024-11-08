<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { createChallenge, registerPasskey } from '$lib/auth';
	import { decodeBase64, encodeBase64 } from '@oslojs/encoding';
	import { securityKeyController } from '@repo/shared/controllers/auth/2fa/securitykey';
	import { remult } from '@repo/shared';
	import { Button } from '@repo/ui';
	import { Label } from '@repo/ui';
	import { Input } from '@repo/ui';

	let name = '';
	let message = '';
	let createCredentialDisabled = false;
	let submitDisabled = true;
	let encodedAttestationObject: string | null = null;
	let encodedClientDataJSON: string | null = null;

	async function handleCreateCredential() {
		if (!remult.user) {
			return;
		}

		const credentials = await securityKeyController.credentials(remult.user.id);

		const encodedCredentialIds = credentials.map((c) => encodeBase64(c.id)).join(',');

		const encodedCredentialUserId = encodeBase64(
			new TextEncoder().encode(remult.user.id).slice(0, 8)
		);

		try {
			const challenge = await createChallenge();
			const userId = decodeBase64(encodedCredentialUserId);
			const credentialIds = encodedCredentialIds.split(',').map((i) => decodeBase64(i));

			const credential = (await navigator.credentials.create({
				publicKey: {
					challenge,
					user: {
						displayName: 'DisplayName',
						id: userId,
						name: 'test@test.com'
					},
					rp: {
						name: 'My site'
					},
					pubKeyCredParams: [
						{ alg: -7, type: 'public-key' },
						{ alg: -257, type: 'public-key' }
					],
					attestation: 'none',
					authenticatorSelection: {
						userVerification: 'required',
						residentKey: 'required',
						requireResidentKey: true
					},
					excludeCredentials: credentialIds.map((id) => ({ id, type: 'public-key' }))
				}
			})) as PublicKeyCredential;

			if (!(credential.response instanceof AuthenticatorAttestationResponse)) {
				throw new Error('Unexpected response type');
			}

			encodedAttestationObject = encodeBase64(
				new Uint8Array(credential.response.attestationObject)
			);
			encodedClientDataJSON = encodeBase64(new Uint8Array(credential.response.clientDataJSON));

			createCredentialDisabled = true;
			submitDisabled = false;
		} catch (error) {
			console.error('Error creating credential:', error);
			message = 'Failed to create credential. Please try again.';
		}
	}

	async function handleSubmit() {
		if (!encodedAttestationObject || !encodedClientDataJSON) {
			message = 'Please create a credential first.';
			return;
		}

		try {
			await registerPasskey({
				name,
				attestation_object: encodedAttestationObject,
				client_data_json: encodedClientDataJSON
			});
			goto('/');
		} catch (error) {
			console.error('Error registering passkey:', error);
			message = 'Failed to register passkey. Please try again.';
		}
	}

	onMount(() => {
		if (!window.PublicKeyCredential) {
			message = 'WebAuthn is not supported in this browser.';
			createCredentialDisabled = true;
		}
	});
</script>

<div class="mx-auto max-w-md space-y-6 py-8">
	<h1 class="text-2xl font-bold">Register passkey</h1>

	<div class="flex flex-col gap-4">
		<Button onclick={handleCreateCredential} disabled={createCredentialDisabled} class="w-full">
			Create credential
		</Button>

		<form on:submit|preventDefault={handleSubmit} class="space-y-4">
			<div class="space-y-2">
				<Label for="name">Credential name</Label>
				<Input
					id="name"
					bind:value={name}
					required
					placeholder="Enter a name for this passkey"
					class="w-full"
				/>
			</div>

			<Button type="submit" disabled={submitDisabled} class="w-full">Continue</Button>
		</form>

		{#if message}
			<p class="text-sm text-red-600">{message}</p>
		{/if}
	</div>
</div>
