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

	type EmailStatus = undefined | boolean | string;

	const Status = {
		checking: 'Checking',
		true: 'Looks good!',
		false: 'Not available!'
	} as const;

	let { data } = $props();
	let emailStatus = $state<EmailStatus>(undefined);

	const form = superForm(data.form, {
		validators: zodClient(formSchema),
		onSubmit: ({ cancel }) => (!emailStatus || emailStatus !== Status.true) && cancel()
	});

	const { form: formData, enhance } = form;

	const validateEmail = debounce(async () => {
		if (formSchema.shape.email.safeParse($formData.email).error) {
			emailStatus = undefined;
			return;
		}

		emailStatus = 'checking';

		const [err, res] = await handleFetch(async () =>
			getUserService().user.is_email_available($formData.email)
		);

		emailStatus = err ? (err.message.includes('Too Many Requests') ? err.message : undefined) : res;
	}, 500);

	const getStatusMessage = () => Status[emailStatus as keyof typeof Status] ?? emailStatus;

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
										oninput={() => validateEmail()}
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
							{/snippet}
						</Form.Control>
						{#if emailStatus !== undefined}
							<p
								class="w-full text-xs {emailStatus === 'checking'
									? 'loading-dots'
									: ''} {by_email_status.statusColor}"
							>
								{getStatusMessage()}
							</p>
						{:else}
							<Form.FieldErrors class="w-full font-normal text-xs" />
						{/if}
						<Form.Description>We'll never share your email with anyone else.</Form.Description>
					</Form.Field>
					<div class="space-y-4">
						<Form.Button class="h-10 w-full" disabled={!by_email_status.isValid}
							>Get Started</Form.Button
						>
						<p class="text-muted-foreground/80 text-balance text-center text-xs leading-normal">
							By continuing, you have read and agree to our
							<a href="/" class="hover:text-primary underline underline-offset-4">
								Service Agreement</a
							>,
							<a href="/" class="hover:text-primary underline underline-offset-4">
								Free Membership Agreement
							</a>
							and
							<a href="/" class="hover:text-primary underline underline-offset-4">
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
