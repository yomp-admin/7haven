<script lang="ts">
	import { Input } from '@repo/ui/components/input';
	import { Button } from '@repo/ui/components/button';
	import * as Card from '@repo/ui/components/card';
	import { Label } from '@repo/ui/components/label';
	import { goto } from '$app/navigation';
</script>

<div class="grid-rows grid px-2">
	<Card.Root class="mx-auto w-[450px] p-3">
		<Card.Header>
			<Card.Title class="text-center text-2xl font-extrabold">Verify email address</Card.Title>
			<Card.Description class="flex flex-col text-center"
				><span>Verification code has been sent to your email,</span><span class="font-semibold"
					>***t@g***</span
				></Card.Description
			>
		</Card.Header>
		<Card.Content>
			<div class="grid gap-2">
				<Label for="verification-code" class="text-[13px]">Verification Code</Label>
				<Input
					id="verification-code"
					type="text"
					placeholder="Enter verification code"
					required
					class="font-medium"
				/>
			</div>
		</Card.Content>
		<Card.Footer class="mt-1 flex flex-col">
			<Button
				class="bg-brand dark:hover:text-primary-foreground w-full text-white"
				onclick={() => goto('/business_reg')}>Confirm</Button
			>
			<div class="flex items-center space-x-1">
				<Label for="terms" class="text-xs">Didn't get the email?</Label>
				<Button
					id="terms"
					variant="link"
					class="text-brand p-0 text-xs font-medium opacity-80"
					disabled>Resend in 00:41</Button
				>
			</div>
		</Card.Footer>
	</Card.Root>
</div>
