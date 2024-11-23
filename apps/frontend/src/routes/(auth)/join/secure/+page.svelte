<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button } from '@repo/ui/components/ui/button';
	import { Input } from '@repo/ui/components/ui/input';
	import * as Form from '@repo/ui/components/ui/form';
	import FingerprintIcon from 'lucide-svelte/icons/fingerprint';
	import EyeIcon from 'lucide-svelte/icons/eye';
	import EyeOffIcon from 'lucide-svelte/icons/eye-off';
	import { formSchema, calculatePasswordStrength } from './schema';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { superForm } from 'sveltekit-superforms';
	import { cn } from '@repo/ui/utils';

	let { data } = $props();
	let showPassword = $state(false);
	let showConfirmPassword = $state(false);
	let passwordStrength = $state(0);

	const form = superForm(data.form, {
		validators: zodClient(formSchema)
	});

	const { form: formData, enhance } = form;

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

	function getStrengthGradientColor(strength: number): string {
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
</script>

<div class="flex h-full w-full flex-col items-center justify-between gap-5">
	<div class="flex w-full grow flex-col items-center justify-center gap-10 md:max-w-xl">
		<div class="flex w-full flex-col items-center space-y-8">
			<div class="flex w-full flex-col items-center space-y-2 text-center">
				<h1 class="text-2xl font-semibold tracking-tight">Secure your account</h1>
				<p class="text-muted-foreground text-sm">Choose how you want to sign in to your account</p>
			</div>

			<div class="w-full max-w-md space-y-6">
				<div class="rounded-lg border p-4">
					<div class="flex items-center justify-between">
						<div class="flex items-center space-x-4">
							<div class="bg-primary/10 rounded-full p-2">
								<FingerprintIcon class="text-primary size-5" />
							</div>
							<div>
								<h3 class="text-sm font-medium">Passkey</h3>
								<p class="text-muted-foreground text-xs">Recommended: Fast and secure sign-in</p>
							</div>
						</div>
						<Button variant="outline" size="sm" onclick={() => goto('/join/secure/passkey')}>
							Use Passkey
						</Button>
					</div>
				</div>

				<div class="relative">
					<div class="absolute inset-0 flex items-center">
						<span class="w-full border-t"></span>
					</div>
					<div class="relative flex justify-center text-xs uppercase">
						<span class="bg-background text-muted-foreground px-2">Or continue with</span>
					</div>
				</div>

				<form method="POST" class="space-y-4" use:enhance>
					<div class="relative flex gap-4">
						<Form.Field {form} name="password" class="flex-1">
							<Form.Control>
								{#snippet children({ props })}
									<Form.Label class="data-[fs-error]:text-foreground">Password</Form.Label>
									<div class="relative">
										<Input
											{...props}
											type={showPassword ? 'text' : 'password'}
											bind:value={$formData.password}
											class="pr-10"
										></Input>
										<button
											type="button"
											class="absolute right-3 top-1/2 -translate-y-1/2"
											onclick={() => (showPassword = !showPassword)}
										>
											{#if showPassword}
												<EyeOffIcon class="text-muted-foreground size-4"></EyeOffIcon>
											{:else}
												<EyeIcon class="text-muted-foreground size-4"></EyeIcon>
											{/if}
										</button>
									</div>
									{#if $formData.password}
										<div class="mt-2 space-y-1">
											<div class="flex items-center gap-2 text-xs">
												<span class="text-muted-foreground">Strength:</span>
												<div class="flex flex-1 gap-1">
													<div
														class={cn(
															'h-[1px] flex-1 rounded-sm transition-all duration-300',
															passwordStrength > 0 && !meetsAllRequirements
																? 'from-destructive bg-gradient-to-r to-yellow-500'
																: meetsAllRequirements
																	? 'bg-green-500'
																	: 'bg-muted'
														)}
													></div>
													<div
														class={cn(
															'h-[1px] flex-1 rounded-sm transition-all duration-300',
															passwordStrength >= 30 && !meetsAllRequirements
																? 'bg-gradient-to-r from-yellow-500 to-yellow-400'
																: meetsAllRequirements
																	? 'bg-green-500'
																	: 'bg-muted'
														)}
													></div>
													<div
														class={cn(
															'h-[1px] flex-1 rounded-sm transition-all duration-300',
															meetsAllRequirements ? 'bg-green-500' : 'bg-muted'
														)}
													></div>
												</div>
												<span
													class="font-medium opacity-80 transition-colors duration-300"
													style={`color: ${getStrengthGradientColor(passwordStrength)}`}
												>
													{getStrengthText(passwordStrength)}
												</span>
											</div>
										</div>
									{/if}
								{/snippet}
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>

						{#if $formData.password && !meetsAllRequirements}
							<div
								class="bg-card text-card-foreground absolute -right-[10rem] top-6 w-auto rounded-lg border p-3 shadow-md"
							>
								<div class="absolute -left-2 top-4 h-4 w-4">
									<div
										class="border-border bg-card h-4 w-4 rotate-45 transform border-b border-l"
									></div>
								</div>
								<div class="space-y-1.5 text-[0.625rem]">
									<p class="font-medium leading-none">Password requirements:</p>
									<ul class="text-destructive space-y-0.5 leading-tight">
										<li class={$formData.password.length >= 8 ? 'text-muted-foreground' : ''}>
											• At least 8 characters
										</li>
										<li class={/[A-Z]/.test($formData.password) ? 'text-muted-foreground' : ''}>
											• One uppercase letter
										</li>
										<li class={/[a-z]/.test($formData.password) ? 'text-muted-foreground' : ''}>
											• One lowercase letter
										</li>
										<li class={/[0-9]/.test($formData.password) ? 'text-muted-foreground' : ''}>
											• One number
										</li>
										<li
											class={/[^A-Za-z0-9]/.test($formData.password) ? 'text-muted-foreground' : ''}
										>
											• One special character
										</li>
									</ul>
								</div>
							</div>
						{/if}
					</div>

					<Form.Field {form} name="confirmPassword">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label class="data-[fs-error]:text-foreground">Confirm Password</Form.Label>
								<div class="relative">
									<Input
										{...props}
										type={showConfirmPassword ? 'text' : 'password'}
										bind:value={$formData.confirmPassword}
										class="pr-10"
									/>
									<button
										type="button"
										class="absolute right-3 top-1/2 -translate-y-1/2"
										onclick={() => (showConfirmPassword = !showConfirmPassword)}
									>
										{#if showConfirmPassword}
											<EyeOffIcon class="text-muted-foreground size-4" />
										{:else}
											<EyeIcon class="text-muted-foreground size-4" />
										{/if}
									</button>
								</div>
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
					<Form.Button class="w-full">Create Account</Form.Button>
				</form>
			</div>
		</div>
	</div>
</div>
