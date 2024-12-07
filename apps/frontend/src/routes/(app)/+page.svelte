<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as Table from '$lib/components/ui/table';
	import { Badge } from '$lib/components/ui/badge';
	import {
		Package,
		ArrowUpRight,
		DollarSign,
		Percent,
		Star,
		Boxes,
		TrendingDown,
		TrendingUp
	} from 'lucide-svelte';

	const timeRanges = ['Today', 'Last 7 Days', 'Last 30 Days', 'Last 90 Days'];
	let selectedTimeRange = 'Last 30 Days';
</script>

<div class="flex flex-col">
	<div class="space-y-6 p-4 md:p-8 md:pr-3 md:pt-0">
		<!-- Header Section -->
		<div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
			<div>
				<h2 class="text-2xl font-bold tracking-tight md:text-3xl">Overview</h2>
				<p class="text-muted-foreground">Welcome back, Nigel!</p>
			</div>
			<select
				bind:value={selectedTimeRange}
				class="w-full rounded-lg border bg-card px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 md:w-auto"
				name="time_range"
			>
				{#each timeRanges as range}
					<option value={range}>{range}</option>
				{/each}
			</select>
		</div>

		<!-- Stats Overview -->
		<div class="grid gap-4 sm:gap-6 lg:grid-cols-6">
			<Card.Root class="lg:col-span-4">
				<Card.Content class="p-4 sm:p-6">
					<div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
						<div class="w-full sm:w-1/6">
							<div class="relative aspect-square">
								<img
									src="https://avatar.vercel.sh/kelly.png"
									alt="Kelly Logo"
									class="h-full w-full rounded-xl object-cover"
								/>
							</div>
						</div>
						<div class="w-full space-y-6 sm:w-5/6">
							<div>
								<h2 class="text-2xl font-bold tracking-tight">Kelly's Fashion</h2>
								<p class="text-muted-foreground mt-1">
									Track your business growth and sales metrics
								</p>
							</div>
							<div>
								<div class="grid gap-3 md:grid-cols-3">
									<div class="relative flex items-center gap-3 rounded-xl border border-dashed p-3">
										<span class="rounded-full bg-emerald-50/50 p-2.5 dark:bg-emerald-500/10">
											<Boxes class="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
										</span>
										<div>
											<p class="text-lg font-bold">156</p>
											<p class="text-sm text-muted-foreground">All Orders</p>
										</div>
										<span
											class="text-emerald-600 dark:text-emerald-400 absolute right-3 top-3 flex items-center text-xs font-medium"
										>
											<TrendingUp class="mr-1 h-3 w-3" />
											1.75%
										</span>
									</div>
									<div class="relative flex items-center gap-3 rounded-xl border border-dashed p-3">
										<div class="rounded-full bg-purple-50/50 p-2.5 dark:bg-purple-500/10">
											<Percent class="h-5 w-5 text-purple-600 dark:text-purple-400" />
										</div>
										<div>
											<p class="text-lg font-bold">3.2%</p>
											<p class="text-sm text-muted-foreground">Conversion Rate</p>
										</div>
										<span
											class="text-red-600 dark:text-red-400 absolute right-3 top-3 flex items-center text-xs font-medium"
										>
											<TrendingDown class="mr-1 h-3 w-3" />
											12%
										</span>
									</div>
									<div class="relative flex items-center gap-3 rounded-xl border border-dashed p-3">
										<div class="rounded-full bg-amber-50/50 p-2.5 dark:bg-amber-500/10">
											<Star class="h-5 w-5 text-amber-600 dark:text-amber-400" />
										</div>
										<div>
											<p class="text-lg font-bold">4.8</p>
											<p class="text-sm text-muted-foreground">Customer Rating</p>
										</div>
										<span
											class="text-emerald-600 dark:text-emerald-400 absolute right-3 top-3 flex items-center text-xs font-medium"
										>
											<TrendingUp class="mr-1 h-3 w-3" />
											14.36%
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</Card.Content>
			</Card.Root>

			<!-- Balance Card -->
			<Card.Root class="lg:col-span-2">
				<Card.Content class="p-6">
					<div class="flex flex-col space-y-6">
						<div class="space-y-2">
							<h3 class="text-lg font-medium text-muted-foreground">Current Balance</h3>
							<div class="flex items-baseline gap-1">
								<p class="text-4xl font-bold tracking-tight">$476.3k</p>
								<span class="text-muted-foreground">USD</span>
							</div>
						</div>

						<Button class="bg-emerald-600 hover:bg-emerald-700 text-white w-full rounded-xl py-6">
							<DollarSign class="mr-2 h-4 w-4" />
							Withdraw Now
						</Button>
					</div>
				</Card.Content>
			</Card.Root>
		</div>
		<!-- Performance Analytics -->
		<div class="grid gap-6 lg:grid-cols-7">
			<Card.Root class="lg:col-span-4 rounded-2xl">
				<Card.Content class="p-6">
					<div class="mb-6 flex items-center justify-between">
						<div>
							<h3 class="text-lg font-semibold">Revenue Analytics</h3>
							<p class="text-sm text-muted-foreground">Daily revenue trends and patterns</p>
						</div>
					</div>
					<div class="relative h-[300px] w-full">
						<div
							class="absolute inset-0 rounded-lg bg-gradient-to-b from-blue-500/20 to-transparent"
						></div>
						<div
							class="absolute bottom-0 left-0 right-0 h-[100px] bg-gradient-to-t from-background to-transparent"
						></div>
					</div>
					<div class="mt-4 flex justify-between text-sm text-muted-foreground">
						{#each ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as day}
							<span>{day}</span>
						{/each}
					</div>
				</Card.Content>
			</Card.Root>

			<!-- Top Products -->
			<Card.Root class="lg:col-span-3 rounded-2xl">
				<Card.Content class="p-6">
					<div>
						<h3 class="text-lg font-semibold">Best Sellers</h3>
						<p class="text-sm text-muted-foreground">Top performing categories</p>
					</div>
					<div class="mt-4 space-y-6">
						{#each [{ name: 'Oil Filter Pro X', sales: 52, revenue: '15,600 USD', growth: 12 }, { name: 'Premium Brake Pads', sales: 45, revenue: '13,500 USD', growth: 8 }, { name: 'Engine Oil 5W-30', sales: 38, revenue: '11,400 USD', growth: -3 }] as product}
							<div class="relative">
								<div class="flex items-center justify-between">
									<div class="space-y-1">
										<p class="font-medium">{product.name}</p>
										<div class="flex items-center gap-3 text-sm text-muted-foreground">
											<span class="flex items-center gap-1">
												<Package class="h-4 w-4" />
												{product.sales} units
											</span>
											<span>•</span>
											<span class="flex items-center gap-1">
												<DollarSign class="h-4 w-4" />
												{product.revenue}
											</span>
										</div>
									</div>
									<Badge
										variant="secondary"
										class={product.growth > 0
											? 'bg-emerald-100 text-emerald-700'
											: 'bg-red-100 text-red-700'}
									>
										{product.growth > 0 ? '+' : ''}{product.growth}%
									</Badge>
								</div>
							</div>
						{/each}
					</div>
				</Card.Content>
			</Card.Root>
		</div>

		<!-- Recent Orders -->
		<Card.Root>
			<Card.Content class="p-4 sm:p-6">
				<div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<h3 class="text-lg font-semibold">Recent Orders</h3>
						<p class="text-sm text-muted-foreground">Monitor and manage your latest orders</p>
					</div>
					<Button variant="outline" class="gap-2 sm:w-auto">
						<Package class="h-4 w-4" />
						View All Orders
					</Button>
				</div>

				<div class="relative overflow-x-auto rounded-lg border">
					<Table.Root>
						<Table.Header>
							<Table.Row class="bg-muted/50">
								<Table.Head>Order ID</Table.Head>
								<Table.Head>Customer</Table.Head>
								<Table.Head>Product</Table.Head>
								<Table.Head>Amount</Table.Head>
								<Table.Head>Date</Table.Head>
								<Table.Head>Status</Table.Head>
								<Table.Head class="text-right">Actions</Table.Head>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{#each [{ id: '#ORD-7352', customer: 'Nur Alom', product: 'Body Parts Kit', amount: '900 USD', date: '15 Mar 2024', status: 'Processing' }, { id: '#ORD-7351', customer: 'S A Sams', product: 'Auxiliary Battery', amount: '16,600 USD', date: '15 Mar 2024', status: 'Shipped' }, { id: '#ORD-7350', customer: 'Sadek Rahman', product: 'Car Interior Set', amount: '800 USD', date: '14 Mar 2024', status: 'Delivered' }] as order}
								<Table.Row class="hover:bg-muted/50">
									<Table.Cell class="font-medium">{order.id}</Table.Cell>
									<Table.Cell>{order.customer}</Table.Cell>
									<Table.Cell>{order.product}</Table.Cell>
									<Table.Cell>{order.amount}</Table.Cell>
									<Table.Cell>{order.date}</Table.Cell>
									<Table.Cell>
										<Badge
											variant="secondary"
											class={order.status === 'Processing'
												? 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400'
												: order.status === 'Shipped'
													? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400'
													: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400'}
										>
											{order.status}
										</Badge>
									</Table.Cell>
									<Table.Cell class="text-right">
										<Button variant="ghost" size="sm" class="hover:bg-background">
											View Details
										</Button>
									</Table.Cell>
								</Table.Row>
							{/each}
						</Table.Body>
					</Table.Root>
				</div>
			</Card.Content>
		</Card.Root>
	</div>
</div>
