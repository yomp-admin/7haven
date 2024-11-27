<script lang="ts">
	import { Button } from '@repo/ui/components/ui/button';
	import * as Form from '@repo/ui/components/ui/form';
	import * as InputOTP from '@repo/ui/components/ui/input-otp';
	import { formSchema } from './schema';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { superForm } from 'sveltekit-superforms';
	import { getUserService } from '@repo/shared';
	import { handleFetch } from '@/utils';

	let { data } = $props();

	const COUNTDOWN_DURATION = 60;
	const COUNTDOWN_INTERVAL = 1000;

	let countdown = $state(COUNTDOWN_DURATION);
	let isCountdownFinished = $state(false);
	let isResending = $state(false);
	let resendError = $state<string | null>(null);

	const form = superForm(data.form, {
		validators: zodClient(formSchema)
	});

	const { form: formData, enhance } = form;

	$effect.root(() => {
		startCountdown();
	});

	function startCountdown() {
		countdown = COUNTDOWN_DURATION;
		isCountdownFinished = false;
		resendError = null;

		const interval = setInterval(() => {
			countdown--;
			if (countdown <= 0) {
				isCountdownFinished = true;
				clearInterval(interval);
			}
		}, COUNTDOWN_INTERVAL);

		return () => clearInterval(interval);
	}

	async function resendCode() {
		if (!isCountdownFinished || isResending || !data.onboarding.userId) {
			return;
		}

		isResending = true;
		resendError = null;

		const [err] = await handleFetch(() =>
			getUserService().user.resend_verification(data.onboarding.userId)
		);

		if (err) {
			resendError = err.message;
		}

		isResending = false;
	}
</script>

<div class="flex h-full w-full flex-col items-center justify-between gap-5">
	<div class="flex w-full grow flex-col items-center justify-center gap-10 md:max-w-xl">
		<div class="flex w-full flex-col items-center space-y-8">
			<div class="flex w-full flex-col items-center space-y-2 text-center">
				<h1 class="text-2xl font-semibold tracking-tight">Verify your email</h1>
				<p class="text-muted-foreground text-sm">
					We've sent a verification code to your email,
					<br />
					<span class="text-foreground/90 font-medium">{data.onboarding.email}</span>
				</p>
			</div>

			<div class="w-full max-w-md">
				<form method="POST" use:enhance class="space-y-8">
					<Form.Field {form} name="verification_code" class="flex w-full flex-col items-center">
						<Form.Control>
							{#snippet children({ props })}
								<InputOTP.Root
									maxlength={6}
									{...props}
									bind:value={$formData.verification_code}
									spellcheck="false"
									autocapitalize="off"
								>
									{#snippet children({ cells })}
										<InputOTP.Group>
											{#each cells.slice(0, 3) as cell}
												<InputOTP.Slot
													{cell}
													class="size-12 rounded-md border text-lg font-semibold shadow-sm"
												/>
											{/each}
										</InputOTP.Group>
										<InputOTP.Separator class="text-muted-foreground">-</InputOTP.Separator>
										<InputOTP.Group>
											{#each cells.slice(3, 6) as cell}
												<InputOTP.Slot
													{cell}
													class="size-12 rounded-md border text-center text-lg font-semibold shadow-sm"
												/>
											{/each}
										</InputOTP.Group>
									{/snippet}
								</InputOTP.Root>
							{/snippet}
						</Form.Control>
						<Form.FieldErrors class="text-destructive transition-opacity duration-150" />
						<Form.Description>Enter the 6-digit code we sent to your email</Form.Description>
					</Form.Field>
					<div class="space-y-4">
						<Form.Button class="h-10 w-full">Verify Email</Form.Button>
						<div class="text-center">
							<Button
								variant="link"
								class="text-muted-foreground text-xs"
								disabled={countdown > 0}
								onclick={() => resendCode()}
							>
								Resend code {countdown > 0 ? `in ${countdown}s` : ''}
							</Button>
						</div>
					</div>
				</form>
			</div>
		</div>
	</div>
</div>
