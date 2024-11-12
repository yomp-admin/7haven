<script lang="ts">
	import { Button } from '@repo/ui/components/button';
	import * as Card from '@repo/ui/components/card';
	import { Input } from '@repo/ui/components/input';
	import { FacebookIcon } from '$lib/components/icons/facebook-icon';
	import { GoogleIcon } from '$lib/components/icons/google-icon';
	import { XIcon } from '$lib/components/icons/x-icon';
	import Fingerprint from 'lucide-svelte/icons/fingerprint';
	import { BrandIcon } from '$lib/components/icons/logo';
	import EyeIconOn from 'lucide-svelte/icons/eye';
	import EyeIconOff from 'lucide-svelte/icons/eye-off';
	import BriefcaseIcon from 'lucide-svelte/icons/briefcase-business';
	import MoveRightIcon from 'lucide-svelte/icons/move-right';

	let show_password = $state(true);
	let type = $derived(show_password ? 'password' : 'text');
	let value = $state('');

	function togglePasswordVisibility() {
		show_password = !show_password;
	}

	function onInput(event: InputEvent) {
		value = (event.target as HTMLInputElement).value;
	}
</script>

<div class="flex h-screen w-full items-center justify-center">
	<Card.Root class="mx-auto w-full min-w-max max-w-sm rounded-3xl shadow-none">
		<Card.Header class="m-3">
			<Card.Title class="flex items-center justify-center text-2xl"
				><span class="mr-2">Sign in to</span><span class="pt-2"><BrandIcon /></span></Card.Title
			>
			<Card.Description class="text-md flex justify-center text-center"
				><BriefcaseIcon class="mr-1 mt-[2px] size-4" />Seller Center</Card.Description
			>
		</Card.Header>
		<Card.Content>
			<div class="grid gap-4">
				<div class="grid gap-2">
					<Input
						id="email"
						type="email"
						placeholder="Email"
						autocomplete="email"
						class="rounded-full px-4 py-6 text-lg font-medium shadow-none"
						required
					/>
				</div>
				<div class="relative grid items-center gap-2">
					<Input
						id="password"
						{type}
						{value}
						placeholder="Password"
						class="rounded-full py-6 pl-4 {value !== ''
							? 'pr-10'
							: 'pr-4'} text-lg font-medium shadow-none"
						required
					/>
					{#if value !== ''}
						<Button
							class="absolute right-4"
							onclick={togglePasswordVisibility}
							onkeydown={togglePasswordVisibility}
						>
							{#if show_password}
								<EyeIconOn class="size-5 opacity-50" />
							{:else}
								<EyeIconOff class="size-5 opacity-50" />
							{/if}
						</Button>
					{/if}
				</div>
				<div class="grid gap-3 pt-2">
					<Button class="w-full rounded-full py-6 font-bold shadow-none"
						>Sign in<MoveRightIcon class="ml-2 size-5" /></Button
					>
					<div class="relative my-5 flex items-center px-10">
						<div class="flex-grow border-t border-dotted"></div>
						<span
							class="bg-card text-muted-foreground absolute left-1/2 -translate-x-1/2 transform px-5 text-[12px]"
							>Sign in with
						</span>
						<div class="flex-grow border-t border-dotted"></div>
					</div>
					<Button variant="outline" class="w-full rounded-full py-6 font-bold shadow-none"
						><Fingerprint class="mr-2 size-5" />Face or fingerprint</Button
					>
				</div>
			</div>
			<div class="mx-auto mt-8 flex w-full justify-center space-x-6">
				<Button variant="outline" size="icon" class="size-11 rounded-full border-dotted shadow-none"
					><FacebookIcon size="w-6" /></Button
				>
				<Button
					variant="outline"
					size="icon"
					class="size-11 rounded-full border-dotted p-2.5 shadow-none"
					><GoogleIcon size="w-6" /></Button
				>
				<Button
					variant="outline"
					size="icon"
					class="size-11 rounded-full border-dotted p-3 shadow-none"><XIcon size="w-6" /></Button
				>
			</div>
			<div class="text-muted-foreground mt-5 text-center text-sm">
				New to 7Haven?
				<a href="/signup" class=" text-brand hover:text-primary underline opacity-80">Sign up</a>
			</div>
		</Card.Content>
	</Card.Root>
</div>
