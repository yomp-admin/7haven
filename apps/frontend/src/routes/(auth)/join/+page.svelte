<script lang="ts">
	import { handleFetch } from '../../../utils/handleFetch';
	import { Input } from '$lib/components/ui/input';
	import { AtSign, CheckCircle } from 'lucide-svelte';
	import * as Form from '$lib/components/ui/form';
	import { formSchema } from './schema';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { superForm } from 'sveltekit-superforms';
	import { getUserService } from '@repo/shared';
	import debounce from 'debounce';

	type EmailStatus = null | boolean | 'rateLimited' | 'checking';

	const Status = {
		checking: 'Checking',
		rateLimited: 'Too many requests. Please try again after 30 minutes.',
		true: 'Looks good!',
		false: 'Not available!'
	} as const;

	let { data } = $props();
	let emailStatus = $state<EmailStatus>(null);

	const form = superForm(data.form, {
		validators: zodClient(formSchema),
		onSubmit: ({ cancel }) =>
			(!emailStatus || emailStatus === 'checking' || emailStatus === 'rateLimited') && cancel()
	});

	const { form: formData, enhance } = form;

	const validateEmail = debounce(async (email: string) => {
		if (!email?.length || !formSchema.shape.email.safeParse(email).success) {
			emailStatus = null;
			return;
		}

		emailStatus = 'checking';

		const [err, res] = await handleFetch(async () =>
			getUserService().user.is_email_available(email)
		);

		emailStatus = err ? (err.message.includes('Too Many Requests') ? 'rateLimited' : null) : res;
	}, 500);

	const getStatusMessage = () => Status[emailStatus as keyof typeof Status] ?? '';

	const by_email_status = $derived({
		isValid: emailStatus === true,
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
										class="h-12 pl-10 pr-10 text-base"
										spellcheck="false"
										autocorrect="off"
										autocapitalize="off"
										autocomplete="off"
										{...props}
										bind:value={$formData.email}
										oninput={() => validateEmail($formData.email)}
									/>
									<span class="text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2">
										<AtSign class="size-5" />
									</span>
									{#if emailStatus === true}
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
						<Form.Button class="h-10 w-full" disabled={!by_email_status.isValid}
							>Get Started</Form.Button
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
