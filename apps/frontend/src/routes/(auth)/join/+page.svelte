<script lang="ts">
	import { Input } from '@repo/ui/components/input';
	import { Button } from '@repo/ui/components/button';
	import { Tooltip } from 'bits-ui';
	import AtSignIcon from 'lucide-svelte/icons/at-sign';
	import TallyIcon from 'lucide-svelte/icons/tally-1';
	import { CheckCircle } from 'lucide-svelte';
	import * as Form from '@repo/ui/components/form';
	import { formSchema } from './schema';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { superForm } from 'sveltekit-superforms';
	import { userService } from '@repo/shared';

	let { data } = $props();
	let isCheckingEmail = $state(false);
	let emailStatus: null | boolean = $state(null);

	const form = superForm(data.form, {
		validators: zodClient(formSchema)
	});

	const { form: formData, enhance } = form;

	async function checkEmailAvailability(email: string) {
		isCheckingEmail = true;
		emailStatus = null;

		const result = formSchema.shape.email.safeParse(email);
		if (result.success) {
			emailStatus = await userService.user.isEmailAvailable(email);
		}

		isCheckingEmail = false;
	}
</script>

<div class="flex h-full w-full flex-col items-center justify-between">
	<div class="flex w-full grow flex-col items-center justify-center gap-10 pb-4 md:max-w-xl">
		<h1 class="mb-4 flex flex-col gap-2 text-center">
			<span class="pb-5 text-xl font-medium leading-none">Let's create your</span>
			<span class="text-3xl font-semibold leading-none">7Haven Seller Account</span>
		</h1>
		<h2 class="text-center text-xl font-semibold">Choose your username</h2>
		<div class="flex w-full flex-row justify-stretch gap-2">
			<div class="flex w-full">
				<Tooltip.Provider>
					<Tooltip.Root>
						<Tooltip.Trigger class="bg-accent-foreground h-2 w-full rounded"></Tooltip.Trigger>
						<Tooltip.Content>
							<Tooltip.Arrow class="border-t" />
							<div
								class="bg-background shadow-popover flex items-center justify-center rounded-sm border px-2 text-[11px] font-medium outline-none"
							>
								Choose your username
							</div>
						</Tooltip.Content>
					</Tooltip.Root>
				</Tooltip.Provider>
			</div>
			<div class="flex w-full">
				<div class="bg-accent h-2 w-full rounded"></div>
			</div>
			<div class="flex w-full">
				<div class="bg-accent h-2 w-full rounded"></div>
			</div>
			<div class="flex w-full">
				<div class="bg-accent h-2 w-full rounded"></div>
			</div>
		</div>
		<div class="flex flex-col gap-2">
			<p class="text-pretty text-center">
				Your username will be your unique identifier across the entire 7Haven ecosystem. It is
				exclusively yours and will enable you to use our services seamlessly.
			</p>
		</div>
		<div class="flex w-full flex-col gap-1">
			<form method="POST" use:enhance>
				<Form.Field {form} name="email">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Email</Form.Label>
							<div class="relative flex items-center">
								<Input
									{...props}
									bind:value={$formData.email}
									oninput={() => checkEmailAvailability($formData.email)}
									class="border-input data-[fs-error]:border-destructive pl-14 pr-24 text-[16px] font-medium shadow-none"
									placeholder="Enter your business email"
								/>
								<div class="absolute left-4 flex items-center gap-x-2.5 opacity-30">
									<AtSignIcon class="size-3.5" />
									<TallyIcon class="size-4" />
								</div>
								{#if emailStatus !== null}
									<div
										class="absolute right-4 flex items-center {emailStatus
											? 'text-green-500'
											: 'text-red-500'}"
									>
										<CheckCircle class="size-5" />
									</div>
								{/if}
							</div>
							{#if emailStatus !== null}
								<p
									class="absolute mt-2 text-[0.8rem] {emailStatus
										? 'text-green-500'
										: 'text-red-500'}"
								>
									{emailStatus ? 'Looks good!' : 'Not available!'}
								</p>
							{/if}
						{/snippet}
					</Form.Control>
					<Form.Description />
					<Form.FieldErrors class="text-destructive" />
				</Form.Field>
			</form>
		</div>
		<div class="flex w-full flex-col gap-1">
			<p class="text-muted-foreground text-balance text-center text-xs leading-normal">
				By continuing, you have read and agree to our
				<a
					href="/terms"
					class="text-brand hover:text-primary underline underline-offset-4 opacity-80"
				>
					Service Agreement</a
				>,
				<a
					href="/terms"
					class="text-brand hover:text-primary underline underline-offset-4 opacity-80"
				>
					Free Membership Agreement
				</a>
				and
				<a
					href="/privacy"
					class="text-brand hover:text-primary underline underline-offset-4 opacity-80"
				>
					Privacy Policy</a
				>.
			</p>
		</div>
		<div class="mt-3 flex w-full flex-col gap-2">
			<Button class="w-full px-10 shadow-none" disabled={emailStatus !== true || isCheckingEmail}>
				{#if isCheckingEmail}
					Checking...
				{:else}
					Next
				{/if}
			</Button>
		</div>
	</div>
</div>
