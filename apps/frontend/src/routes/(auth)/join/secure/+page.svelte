<script lang="ts">
	import { Input } from '@repo/ui/components/ui/input';
	import * as Form from '@repo/ui/components/ui/form';
	import FingerprintIcon from 'lucide-svelte/icons/fingerprint';
	import EyeIcon from 'lucide-svelte/icons/eye';
	import EyeOffIcon from 'lucide-svelte/icons/eye-off';
	import LockIcon from 'lucide-svelte/icons/lock';
	import { formSchema, calculatePasswordStrength } from './schema';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { superForm } from 'sveltekit-superforms';
	import { cn } from '@repo/ui/utils';
	import { Card } from '@repo/ui/components/ui/card';
	import { Badge } from '@repo/ui/components/ui/badge';
	import { slide, fade } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import Password from 'phosphor-svelte/lib/Password';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';

	let { data } = $props();

	let showPassword = $state(false);
	let showConfirmPassword = $state(false);
	let passwordStrength = $state(0);

	const form = superForm(data.form, {
		validators: zodClient(formSchema),
		onResult: async ({ result }) => {
			if (result.type === 'success') {
				toast.success(result.data?.message);
				goto('/business_reg');
			}
		}
	});

	const { form: formData, enhance, allErrors } = form;

	let meetsAllRequirements = $derived(
		$formData.password
			? $formData.password.length >= 8 &&
					/[A-Z]/.test($formData.password) &&
					/[a-z]/.test($formData.password) &&
					/[0-9]/.test($formData.password) &&
					/[^A-Za-z0-9]/.test($formData.password)
			: false
	);

	$effect(() => {
		if ($formData.password) {
			passwordStrength = calculatePasswordStrength($formData.password);
		} else {
			passwordStrength = 0;
		}
	});

	function getStrengthColor(strength: number): string {
		if (!meetsAllRequirements) {
			return strength < 30 ? '' : '#eab308';
		}
		return '#22c55e';
	}

	function getStrengthText(strength: number): string {
		if (!meetsAllRequirements) {
			return strength < 30 ? 'Weak' : 'Medium';
		}
		return 'Strong';
	}

	let selected = $state<'passkey' | 'password'>('passkey');
	const setSelected = (value: 'passkey' | 'password') => (selected = value);
</script>

<div class="flex h-full w-full flex-col items-center justify-between gap-5">
	<div class="flex w-full grow flex-col items-center justify-center gap-10 md:max-w-xl">
		<div class="flex w-full flex-col items-center space-y-8">
			<div class="flex w-full flex-col items-center space-y-2 text-center">
				<h1 class="text-2xl font-semibold tracking-tight">Secure your account</h1>
				<p class="text-muted-foreground text-sm">Choose how you want to sign in to your account</p>
			</div>

			<div class="w-full max-w-md space-y-6">
				<form method="POST" class="space-y-6" use:enhance>
					<div
						role="button"
						tabindex="0"
						onclick={() => setSelected('passkey')}
						onkeydown={(e) => {
							if (e.key === 'Enter' || e.key === ' ') {
								setSelected('passkey');
							}
						}}
					>
						<Card class={selected === 'passkey' ? 'h-auto' : 'h-[60px]'}>
							<div class="p-3">
								<div class="flex w-full justify-between">
									<div class="flex items-center gap-2">
										<div class="bg-primary/10 rounded-full p-2">
											<FingerprintIcon class="text-primary size-5" />
										</div>
										{#if selected !== 'passkey'}
											<span class="text-base font-semibold" in:fade>Passkey</span>
										{/if}
									</div>
									<Badge class="text-foreground h-6 rounded-full bg-green-500  p-2 font-normal"
										>Most Secure</Badge
									>
								</div>

								{#if selected === 'passkey'}
									<div
										class="mt-3 flex flex-col text-start"
										in:slide={{ duration: 1000, easing: cubicOut }}
									>
										<span class="text-base font-semibold">Passkey</span>
										<p class="text-muted-foreground text-pretty text-sm">
											A passkey is the fastest and safest way to access your account than a
											password. Proceed with passkey or choose another option.
										</p>
									</div>
								{/if}
							</div>
						</Card>
					</div>
					<div
						role="button"
						tabindex="0"
						onclick={() => setSelected('password')}
						onkeydown={(e) => {
							if (e.key === 'Enter' || e.key === ' ') {
								setSelected('password');
							}
						}}
					>
						<Card class="ralative {selected === 'password' ? 'h-auto' : 'h-[60px]'}">
							<div class="flex flex-col justify-center gap-4 p-4">
								<div class="flex items-center gap-x-2">
									<Password size={32} weight="bold" />
									<span class="text-base font-semibold">
										{selected === 'password' ? 'Password' : 'Use a password instead'}
									</span>
								</div>

								{#if selected === 'password'}
									<div
										class="relative flex flex-col gap-2"
										in:slide={{ duration: 1000, easing: cubicOut }}
									>
										<Form.Field {form} name="password" class="w-full">
											<Form.Control>
												{#snippet children({ props })}
													<div class="relative">
														<LockIcon
															class="text-muted-foreground absolute left-3 top-1/2 size-5 -translate-y-1/2"
														/>
														<Input
															{...props}
															type={showPassword ? 'text' : 'password'}
															bind:value={$formData.password}
															class="h-12 pl-10 pr-10 text-base"
															placeholder="Password"
														/>
														<button
															type="button"
															class="absolute right-3 top-1/2 -translate-y-1/2"
															onclick={() => (showPassword = !showPassword)}
														>
															{#if showPassword}
																<EyeOffIcon class="text-muted-foreground size-5"></EyeOffIcon>
															{:else}
																<EyeIcon class="text-muted-foreground size-5"></EyeIcon>
															{/if}
														</button>
													</div>
												{/snippet}
											</Form.Control>
										</Form.Field>

										{#if $formData.password && !meetsAllRequirements}
											<div
												class="bg-card text-card-foreground absolute -right-[10.5rem] w-auto rounded-lg border p-3 shadow-md"
												transition:fade
											>
												<div class="absolute -left-2 top-4 h-4">
													<div
														class="border-border bg-card h-4 w-4 rotate-45 transform border-b border-l"
													></div>
												</div>
												<div class="space-y-1.5 text-[0.625rem]">
													<p class="font-medium leading-none">Password requirements:</p>
													<ul class="text-destructive space-y-0.5 leading-tight">
														<li
															class={$formData.password.length >= 8 ? 'text-muted-foreground' : ''}
														>
															• At least 8 characters
														</li>
														<li
															class={/[A-Z]/.test($formData.password)
																? 'text-muted-foreground'
																: ''}
														>
															• One uppercase letter
														</li>
														<li
															class={/[a-z]/.test($formData.password)
																? 'text-muted-foreground'
																: ''}
														>
															• One lowercase letter
														</li>
														<li
															class={/[0-9]/.test($formData.password)
																? 'text-muted-foreground'
																: ''}
														>
															• One number
														</li>
														<li
															class={/[^A-Za-z0-9]/.test($formData.password)
																? 'text-muted-foreground'
																: ''}
														>
															• One special character
														</li>
													</ul>
												</div>
											</div>
										{/if}

										<Form.Field {form} name="confirmPassword" class="w-full">
											<Form.Control>
												{#snippet children({ props })}
													<div class="relative">
														<LockIcon
															class="text-muted-foreground absolute left-3 top-1/2 size-5 -translate-y-1/2"
														/>
														<Input
															{...props}
															type={showConfirmPassword ? 'text' : 'password'}
															bind:value={$formData.confirmPassword}
															class="h-12 pl-10 pr-10 text-base"
															placeholder="Confirm Password"
														/>
														<button
															type="button"
															class="absolute right-3 top-1/2 -translate-y-1/2"
															onclick={() => (showConfirmPassword = !showConfirmPassword)}
														>
															{#if showConfirmPassword}
																<EyeOffIcon class="text-muted-foreground size-5" />
															{:else}
																<EyeIcon class="text-muted-foreground size-5" />
															{/if}
														</button>
													</div>

													{#if $formData.password}
														<div class="mt-2 space-y-1" transition:fade>
															<div class="flex items-center gap-2">
																<div class="flex flex-1 gap-1">
																	{#each Array(5) as _, i}
																		<span
																			class={cn(
																				'h-1 flex-1 rounded-sm transition-all duration-300',
																				passwordStrength >= (i + 1) * 20
																					? !meetsAllRequirements
																						? 'bg-yellow-500'
																						: 'bg-green-500'
																					: 'bg-muted'
																			)}
																		></span>
																	{/each}
																</div>
																<span
																	class="flex w-12 justify-end text-xs font-medium opacity-80 transition-colors duration-300"
																	style={`color: ${getStrengthColor(passwordStrength)}`}
																>
																	{getStrengthText(passwordStrength)}
																</span>
															</div>
														</div>
													{/if}
												{/snippet}
											</Form.Control>
										</Form.Field>
										{#if $allErrors.length}
											<ul transition:fade>
												{#each $allErrors as error}
													<li class="text-destructive text-[0.8rem] font-medium" transition:fade>
														{error.messages}
													</li>
												{/each}
											</ul>
										{/if}
									</div>
								{/if}
							</div>
						</Card>
					</div>
					<Form.Button class="h-10 w-full">Create Account</Form.Button>
				</form>
			</div>
		</div>
	</div>
</div>
