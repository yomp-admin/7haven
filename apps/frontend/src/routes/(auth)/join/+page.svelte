<script lang="ts">
	import { Input } from '@repo/ui/components/ui/input';
	import { AtSign, CheckCircle } from 'lucide-svelte';
	import * as Form from '@repo/ui/components/ui/form';
	import { formSchema } from './schema';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { superForm } from 'sveltekit-superforms';
	import { getUserService } from '@repo/shared';
	import { goto } from '$app/navigation';
	import { debounce } from '@/utils';

	type EmailStatus = null | boolean | 'rate-limited' | 'checking';

	const DEBOUNCE_MS = 500;
	const ERROR_MESSAGES = {
		rateLimited: 'Too many requests. Please try again after 30 minutes.',
		valid: 'Looks good!',
		invalid: 'Not available!'
	} as const;

	let { data } = $props();
	let isCheckingEmail = $state(false);
	let emailStatus = $state<EmailStatus>(null);

	const form = superForm(data.form, {
		validators: zodClient(formSchema),
		onSubmit: handleFormSubmit
	});

	const { form: formData, enhance } = form;

	$effect(() => {
		debouncedUpdate($formData.email);
	});

	const debouncedUpdate = debounce(validateEmail, DEBOUNCE_MS);

	async function validateEmail(email: string) {
		if (!isValidEmailFormat(email)) {
			resetEmailStatus();
			return;
		}

		isCheckingEmail = true;
		emailStatus = 'checking';

		try {
			emailStatus = await getUserService().user.is_email_available(email);
		} catch (error) {
			emailStatus = (error as Error).message.includes('Too Many Requests') ? 'rate-limited' : null;
		} finally {
			isCheckingEmail = false;
		}
	}

	function isValidEmailFormat(email: string | undefined): boolean {
		return Boolean(email && formSchema.shape.email.safeParse(email).success);
	}

	function resetEmailStatus(): void {
		emailStatus = null;
		isCheckingEmail = false;
	}

	async function handleFormSubmit({ cancel }: { cancel: () => void }): Promise<void> {
		if (!(emailStatus === true && !isCheckingEmail)) {
			console.log('Invalid email');
			cancel();
			return;
		}
		await goto('/join/verification');
	}

	function getStatusMessage(): string {
		if (emailStatus === 'checking') {
			return 'Checking';
		}
		if (emailStatus === 'rate-limited') return ERROR_MESSAGES.rateLimited;
		if (emailStatus === true) return ERROR_MESSAGES.valid;
		if (emailStatus === false) return ERROR_MESSAGES.invalid;
		return '';
	}

	const by_email_status = $derived({
		isValid: emailStatus === true && !isCheckingEmail,
		statusColor:
			emailStatus === 'checking' ? '' : emailStatus === true ? 'text-green-500' : 'text-red-500'
	});
</script>

<div class="flex h-full w-full flex-col items-center justify-between gap-5">
	<div class="flex w-full grow flex-col items-center justify-center gap-10 md:max-w-xl">
		<div class="flex w-full flex-col items-center space-y-8">
			<div class="flex w-full flex-col items-center space-y-2 text-center">
				<h1 class="text-2xl font-semibold tracking-tight">Create your Seller Account</h1>
				<p class="text-muted-foreground text-sm">
					Enter your email to get started. We'll send you a verification code.
				</p>
			</div>

			<div class="w-full max-w-md">
				<form method="POST" class="space-y-8" use:enhance>
					<Form.Field {form} name="email" class="flex w-full flex-col items-center">
						<Form.Control>
							{#snippet children({ props })}
								<div class="relative w-full">
									<Input
										type="email"
										placeholder="you@example.com"
										class="h-12 pl-10 pr-10 text-lg"
										spellcheck="false"
										autocorrect="off"
										autocapitalize="off"
										autocomplete="off"
										{...props}
										bind:value={$formData.email}
									/>
									<span class="text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2">
										<AtSign class="size-5" />
									</span>
									{#if emailStatus === true && !isCheckingEmail}
										<div class="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
											<CheckCircle class="size-5" />
										</div>
									{/if}
								</div>
								{#if emailStatus !== null}
									<p
										class="mt-2 w-full text-xs {emailStatus === 'checking'
											? 'loading-dots'
											: ''} {by_email_status.statusColor}"
									>
										{getStatusMessage()}
									</p>
								{/if}
							{/snippet}
						</Form.Control>
						<Form.FieldErrors class="text-destructive w-full" />
						<Form.Description>We'll never share your email with anyone else.</Form.Description>
					</Form.Field>
					<div class="space-y-4">
						<Form.Button class="w-full" disabled={!by_email_status.isValid}>Get Started</Form.Button
						>
						<p class="text-muted-foreground text-balance text-center text-xs leading-normal">
							By continuing, you have read and agree to our
							<a
								href="/terms"
								class="text-brand/60 hover:text-brand/80 underline underline-offset-4"
							>
								Service Agreement</a
							>,
							<a
								href="/terms"
								class="text-brand/60 hover:text-brand/80 underline underline-offset-4"
							>
								Free Membership Agreement
							</a>
							and
							<a
								href="/privacy"
								class="text-brand/60 hover:text-brand/80 underline underline-offset-4"
							>
								Privacy Policy</a
							>.
						</p>
					</div>
				</form>
			</div>
		</div>
	</div>
</div>

<style>
	.loading-dots::after {
		content: '';
		animation: dots 1.5s infinite;
	}

	@keyframes dots {
		0%,
		20% {
			content: '';
		}
		40% {
			content: '.';
		}
		60% {
			content: '..';
		}
		80%,
		100% {
			content: '...';
		}
	}
</style>
