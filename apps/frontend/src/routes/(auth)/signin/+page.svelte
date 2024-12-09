<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import * as Form from '$lib/components/ui/form';
	import { Card } from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { formSchema } from './schema';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { superForm } from 'sveltekit-superforms';
	import { slide, fade } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { toast } from 'svelte-sonner';
	import { BrandIcon } from '$lib/components/icons/logo';
	import { FingerprintIcon, EyeIcon, EyeOffIcon, LockIcon, AtSign } from 'lucide-svelte';
	import { Password } from 'phosphor-svelte';
	import { goto } from '$app/navigation';
	import { passwordSignIn } from '@/services/auth';

	let { data } = $props();

	let showPassword = $state(false);
	let selected = $state<'passkey' | 'password'>('passkey');

	const form = superForm(data.form, {
		validators: zodClient(formSchema),
		multipleSubmits: 'prevent',
		resetForm: false,
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
					const errorData = await res.json();
					cancel();

					if (errorData.message.includes('Too Many Requests')) {
						$formData.email = '';
					}

					$formData.password = '';

					toast.error(errorData.message ?? 'Login failed');
				}
			}
		},
		onUpdated: async ({ form: f }) => {
			if (f.valid) {
				toast.success('Signed in successfully');
				goto('/', {
					replaceState: true
				});
			}
		},
		onError: ({ result }) => {
			toast.error('Connection Lost..Please try again!');
			console.log('Client validation error:', result);
		}
	});

	const { form: formData, enhance, submitting } = form;

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
		<div class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
			<div class="flex flex-col space-y-2 text-center">
				<div class="flex justify-center items-center gap-2 lg:hidden mb-4">
					<BrandIcon class="h-8 w-8" />
					<span class="text-xl font-semibold">Haven</span>
				</div>
				<h1 class="text-2xl font-semibold tracking-tight">Welcome back</h1>
				<p class="text-muted-foreground text-sm">Sign in to your seller center</p>
			</div>

			<div class="w-full space-y-4">
				<form method="POST" class="space-y-4" use:enhance>
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
										<Form.Field {form} name="email">
											<Form.Control>
												{#snippet children({ props })}
													<div class="relative">
														<AtSign
															class="text-muted-foreground absolute left-3 top-1/2 size-5 -translate-y-1/2"
														/>
														<Input
															{...props}
															bind:value={$formData.email}
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

										<Form.Field {form} name="password">
											<Form.Control>
												{#snippet children({ props })}
													<div class="relative">
														<LockIcon
															class="text-muted-foreground absolute left-3 top-1/2 size-5 -translate-y-1/2"
														/>
														<Input
															{...props}
															bind:value={$formData.password}
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
						<Form.Button class="w-full h-11" disabled={$submitting}>
							{#if $submitting}
								Signing in...
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
				<a href="/terms" class="hover:text-primary underline underline-offset-4">Terms of Service</a
				>
				{' '}and{' '}
				<a href="/privacy" class="hover:text-primary underline underline-offset-4">Privacy Policy</a
				>.
			</p>
		</div>
	</div>
</div>
