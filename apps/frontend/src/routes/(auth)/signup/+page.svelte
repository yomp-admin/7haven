<script lang="ts">
	import { Input } from '@repo/ui/components/ui/input';
	import { Button } from '@repo/ui/components/ui/button';
	import * as Card from '@repo/ui/components/ui/card';
	import { Label } from '@repo/ui/components/ui/label';
	import { goto } from '$app/navigation';
</script>

<div class="grid-rows grid gap-10 px-2">
	<Card.Root class="mx-auto w-5/12 p-3">
		<Card.Header class="mx-auto space-y-0 pb-8">
			<Card.Title class="text-3xl font-extrabold">7Haven Marketplace</Card.Title>
			<Card.Description class="text-[13px]"
				>Simplify Your Online Selling Experience with Us!</Card.Description
			>
		</Card.Header>
		<Card.Content class="mx-auto">
			<div class="grid gap-4">
				<div class="grid grid-cols-2 gap-4">
					<div class="grid gap-2">
						<Label for="first-name" class="text-[13px] font-bold">First Name</Label>
						<Input
							id="first-name"
							placeholder="Max"
							required
							class="font-medium shadow-none"
							autocomplete="given-name"
						/>
					</div>
					<div class="grid gap-2">
						<Label for="last-name" class="text-[13px] font-bold">Last Name</Label>
						<Input id="last-name" placeholder="Robinson" required class="font-medium shadow-none" />
					</div>
				</div>
				<div class="grid gap-2">
					<Label for="email" class="text-[13px] font-bold">Email</Label>
					<Input
						id="email"
						type="email"
						placeholder="Enter your email"
						required
						class="font-medium shadow-none"
						autocomplete="email"
					/>
				</div>
				<div class="grid gap-2">
					<Label for="password" class="text-[13px] font-bold">Password</Label>
					<Input
						id="password"
						type="password"
						placeholder="Enter password "
						class="font-medium shadow-none"
					/>
				</div>
				<div class="grid gap-2">
					<Input
						id="confirm_password"
						type="password"
						placeholder="Re-enter password "
						class="font-medium shadow-none"
					/>
				</div>
				<div class="pt-3">
					<p class="text-muted-foreground text-xs">
						By clicking register, you have read and agree to our
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
			</div>
		</Card.Content>
	</Card.Root>
	<Card.Root class="mx-auto w-5/12 p-3">
		<div class="grid justify-end">
			<Button onclick={() => goto('/signup/verification')} class="w-full px-10 shadow-none"
				>Register</Button
			>
		</div>
	</Card.Root>
</div>
