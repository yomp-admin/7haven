<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import * as Form from '$lib/components/ui/form';
	import { Card } from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { formSchema, otpFormSchema } from './schema';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { superForm } from 'sveltekit-superforms';
	import { slide, fade } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { toast } from 'svelte-sonner';
	import { BrandIcon } from '$lib/components/icons/logo';
	import { FingerprintIcon, EyeIcon, EyeOffIcon, LockIcon, AtSign } from 'lucide-svelte';
	import { Password } from 'phosphor-svelte';
	import { goto } from '$app/navigation';
	import { auth2fa, passwordSignIn } from '$lib/services/auth';
	import { Button } from '$lib/components/ui/button';
	import * as InputOTP from '$lib/components/ui/input-otp';
	import { getUserService } from '@repo/shared';

	let { data } = $props();

	let showPassword = $state(false);
	let selected = $state<'passkey' | 'password'>('passkey');
	let showOTPForm = $state(false);
	let userId = $state<string | null>(null);
	
	
	const COUNTDOWN = {
		DURATION: 60,
		INTERVAL: 1000
	} as const;

	let countdown = $state(COUNTDOWN.DURATION);
	let isCounting = $state(false);
	let isResending = $state(false);

	const signInForm = superForm(data.form, {
		validators: zodClient(formSchema),
		multipleSubmits: 'prevent',
		onSubmit: ({ cancel }) => {
			if (selected === 'passkey') {
				cancel();
				toast.info('Passkey authentication coming soon');
			}
		},
		onUpdate: async ({ form: f, cancel }) => {
			if (f.valid) {
				const res = await passwordSignIn(f.data.email, f.data.password);

				if (!res.ok) {
					cancel();

					const errorData = await res.json();

					if (errorData.message.includes('Too Many Requests')) {
						$signInFormData.email = '';
					}

					$signInFormData.password = '';
					toast.error(errorData.message ?? 'Sign in failed');
				}

				userId = (await res.json()).id;
			}
		},
		onUpdated: async ({ form: f }) => {
			if (f.valid) {
				showOTPForm = true;
				startCountdown();
			}
		},
		onError: ({ result }) => {
			toast.error('Connection Lost..Please try again!');
			console.log('Client validation error:', result);
		}
	});

	const otpForm = superForm(data.otpForm, {
		validators: zodClient(otpFormSchema),
		multipleSubmits: 'prevent',
		onUpdate: async ({ form: f, cancel }) => {
			if (f.valid && userId) {
				const res = await auth2fa(userId, f.data.verification_code);
				if (!res.ok) {
					cancel();
					const errorData = await res.json();
					$otpFormData.verification_code = '';
					toast.error(errorData.message ?? 'Invalid verification code');
				}
			}
		},
		onUpdated: async ({ form: f }) => {
			if (f.valid) {
				toast.success('Signed in successfully');
				goto('/', { replaceState: true });
			}
		},
		onError: ({ result }) => {
			toast.error('Connection Lost..Please try again!');
			console.log('Client validation error:', result);
		}
	});

	function startCountdown() {
		countdown = COUNTDOWN.DURATION;
		isCounting = false;

		const interval = setInterval(() => {
			countdown--;
			if (countdown <= 0) {
				isCounting = true;
				clearInterval(interval);
			}
		}, COUNTDOWN.INTERVAL);

		return () => clearInterval(interval);
	}

	async function resendCode() {
		if (!isCounting || isResending || !userId) return;

		isResending = true;
		const res = await getUserService().user.resend_2fa(userId, 'auth');

		if (!res.success) {
			toast.error(res.message ?? 'Failed to resend code');
		} else {
			startCountdown();
		}

		isResending = false;
	}

	const {
		form: signInFormData,
		enhance: signInFormEnhance,
		submitting: signInFormSubmitting
	} = signInForm;

	const {
		form: otpFormData,
		enhance: otpFormEnhance,
		submitting: otpFormSubmitting,
	} = otpForm;

	const setSelected = (value: 'passkey' | 'password') => (selected = value);
</script>

<div
	class="container min-h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0"
>
	<div class="relative hidden h-full flex-col bg-muted p-10 dark:border-r lg:flex">
		<div class="absolute inset-0 bg-gradient-to-b from-secondary to-secondary/90"></div>
		<div class="z-20 flex items-center">
			<BrandIcon />
		</div>
		<div class="z-20 mt-auto">
			<blockquote class="space-y-4">
				<p class="text-base font-medium leading-relaxed text-muted-foreground/90">
					7Haven has transformed how we manage our online store. The platform's simplicity and
					powerful features make it the perfect choice for serious sellers.
				</p>
				<footer class="flex items-center gap-2">
					<div class="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
						<span class="text-lg font-semibold text-primary">S</span>
					</div>
					<div class="flex flex-col">
						<span class="font-medium text-sm">Sarah</span>
						<span class="text-xs text-muted-foreground">Founder of Modern Essentials</span>
					</div>
				</footer>
			</blockquote>
		</div>
	</div>

	<div class="p-4 lg:p-8 h-full flex items-center">
		{#if !showOTPForm}
			<div class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
				<div class="flex flex-col space-y-2 text-center">
					<h1 class="text-2xl font-semibold tracking-tight">Welcome back</h1>
					<p class="text-muted-foreground text-sm">Sign in to your seller center</p>
				</div>

				<div class="w-full space-y-4">
					<form method="POST" action="?/signin" class="space-y-4" use:signInFormEnhance>
						<!-- Passkey Option -->
						<div
							role="button"
							tabindex="0"
							onclick={() => setSelected('passkey')}
							onkeydown={(e) => e.key === 'Enter' && setSelected('passkey')}
						>
							<Card
								class="transition-all duration-200 hover:shadow-sm {selected === 'passkey'
									? 'h-auto ring-2 ring-primary'
									: 'h-[60px]'}"
							>
								<div class={selected === 'passkey' ? 'p-4' : 'px-4 flex items-center h-full'}>
									<div class="flex w-full justify-between items-center">
										<div class="flex items-center gap-3">
											<div class="bg-primary/10 rounded-full p-2 flex items-center justify-center">
												<FingerprintIcon class="text-primary size-5" />
											</div>
											{#if selected !== 'passkey'}
												<span class="text-base font-medium" in:fade>Quick Sign In</span>
											{/if}
										</div>
										<Badge
											class="bg-brand/10 text-brand h-6 rounded-full px-2 cursor-default pointer-events-none"
										>
											Recommended
										</Badge>
									</div>

									{#if selected === 'passkey'}
										<div
											class="mt-4 flex flex-col text-start"
											in:slide={{ duration: 300, easing: cubicOut }}
										>
											<span class="text-base font-medium">Quick Sign In with Passkey</span>
											<p class="text-muted-foreground text-pretty text-xs mt-1">
												Use your device's security features for a faster, more secure sign-in
												experience.
											</p>
										</div>
									{/if}
								</div>
							</Card>
						</div>

						<!-- Password Option -->
						<div
							role="button"
							tabindex="0"
							onclick={() => setSelected('password')}
							onkeydown={(e) => e.key === 'Enter' && setSelected('password')}
						>
							<Card
								class="transition-all duration-200 hover:shadow-sm relative {selected === 'password'
									? 'h-auto ring-2 ring-primary'
									: 'h-[60px]'}"
							>
								<div class={selected === 'password' ? 'p-4' : 'px-4 flex items-center h-full'}>
									<div class="flex items-center gap-3">
										<Password class="size-5" weight="bold" />
										<span class="text-base font-medium">
											{selected === 'password' ? 'Sign In' : 'Use Password Instead'}
										</span>
									</div>

									{#if selected === 'password'}
										<div
											class="flex flex-col gap-4 mt-4"
											in:slide={{ duration: 300, easing: cubicOut }}
										>
											<Form.Field form={signInForm} name="email">
												<Form.Control>
													{#snippet children({ props })}
														<div class="relative">
															<AtSign
																class="text-muted-foreground absolute left-3 top-1/2 size-5 -translate-y-1/2"
															/>
															<Input
																{...props}
																bind:value={$signInFormData.email}
																type="email"
																class="h-11 pl-10 text-base"
																placeholder="Email address"
																autocomplete="email"
															/>
														</div>
													{/snippet}
												</Form.Control>
												<Form.FieldErrors class="text-xs" />
											</Form.Field>

											<Form.Field form={signInForm} name="password">
												<Form.Control>
													{#snippet children({ props })}
														<div class="relative">
															<LockIcon
																class="text-muted-foreground absolute left-3 top-1/2 size-5 -translate-y-1/2"
															/>
															<Input
																{...props}
																bind:value={$signInFormData.password}
																type={showPassword ? 'text' : 'password'}
																class="h-11 pl-10 pr-10 text-base"
																placeholder="Password"
																autocomplete="current-password"
															/>
															<button
																type="button"
																class="absolute right-3 top-1/2 -translate-y-1/2"
																onclick={() => (showPassword = !showPassword)}
															>
																{#if showPassword}
																	<EyeOffIcon class="text-muted-foreground size-5" />
																{:else}
																	<EyeIcon class="text-muted-foreground size-5" />
																{/if}
															</button>
														</div>
													{/snippet}
												</Form.Control>
												<Form.FieldErrors class="text-xs" />
											</Form.Field>
										</div>
									{/if}
								</div>
							</Card>
						</div>

						<div class="space-y-4">
							<Form.Button class="w-full h-11" disabled={$signInFormSubmitting}>
								{#if $signInFormSubmitting}
									<p class="loading-dots">
										Signing in
									</p>
								{:else}
									{selected === 'passkey' ? 'Continue with Passkey' : 'Sign In'}
								{/if}
							</Form.Button>

							<div class="flex items-center justify-between text-xs">
								<a
									href="/forgot-password"
									class="text-muted-foreground hover:text-primary transition-colors"
								>
									Forgot password?
								</a>
								<a
									href="/join"
									class="text-primary font-medium hover:text-primary/90 transition-colors"
								>
									Create an account
								</a>
							</div>
						</div>
					</form>
				</div>

				<p class="text-muted-foreground/80 px-8 text-center text-xs">
					By continuing, you agree to our{' '}
					<a href="/terms" class="hover:text-primary underline underline-offset-4"
						>Terms of Service</a
					>
					{' '}and{' '}
					<a href="/privacy" class="hover:text-primary underline underline-offset-4"
						>Privacy Policy</a
					>.
				</p>
			</div>
		{/if}
		{#if showOTPForm}
			<div class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
				<div class="flex flex-col items-center space-y-2 text-center">
					<h2 class="text-2xl font-semibold">Two-Factor Authentication</h2>
					<p class="text-muted-foreground text-sm">We've sent a verification code to your email</p>
				</div>

				<!-- OTP Input Form -->
				<form method="POST" action="?/verify" use:otpFormEnhance class="space-y-6">
					<Form.Field
						form={otpForm}
						name="verification_code"
						class="flex w-full flex-col items-center"
					>
						<Form.Control>
							{#snippet children({ props })}
								<InputOTP.Root
									maxlength={6}
									{...props}
									bind:value={$otpFormData.verification_code}
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
						<Form.Button class="w-full h-11" disabled={$otpFormSubmitting}>
							{#if $otpFormSubmitting}
								<p class="loading-dots">
									Verifying
								</p>
							{:else}
								Verify
							{/if}
						</Form.Button>
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
		{/if}
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
