<script lang="ts" module>
	import ChartPie from 'lucide-svelte/icons/chart-pie';
	import Ellipsis from 'lucide-svelte/icons/ellipsis';
	import LifeBuoy from 'lucide-svelte/icons/life-buoy';
	import Send from 'lucide-svelte/icons/send';
	import Settings2 from 'lucide-svelte/icons/settings-2';
	import { House, ShoppingCart, Package } from 'phosphor-svelte';

	const data = {
		businesses: [
			{
				name: "Kelly's Fashion",
				logo: Command,
				plan: 'Enterprise'
			},
			{
				name: 'Galaxy Pro',
				logo: AudioWaveform,
				plan: 'Startup'
			},
			{
				name: 'Bachelors Republic',
				logo: Command,
				plan: 'Free'
			}
		],
		navMain: [
			{
				title: 'Overview',
				url: '/',
				icon: House,
				isActive: true
			},
			{
				title: 'Orders',
				url: '/orders',
				icon: ShoppingCart,
				items: [
					{
						title: 'Genesis',
						url: '#'
					},
					{
						title: 'Explorer',
						url: '#'
					},
					{
						title: 'Quantum',
						url: '#'
					}
				]
			},
			{
				title: 'Products',
				url: '/products',
				icon: Package,
				items: [
					{
						title: 'Add New',
						url: '#'
					},
					{
						title: 'Get Started',
						url: '#'
					},
					{
						title: 'Tutorials',
						url: '#'
					},
					{
						title: 'Changelog',
						url: '#'
					}
				]
			},
			{
				title: 'Customers',
				url: '#',
				icon: Users
			}
		],
		navBusiness: [
			{
				title: 'Settings',
				url: '/settings',
				icon: Settings2,
				items: [
					{
						title: 'General',
						url: '#'
					},
					{
						title: 'Team',
						url: '#'
					},
					{
						title: 'Billing',
						url: '#'
					},
					{
						title: 'Limits',
						url: '#'
					}
				]
			},
			{
				title: 'Sales & Marketing',
				url: '#',
				icon: ChartPie
			},
			{
				title: 'More',
				url: '/more',
				icon: Ellipsis
			}
		],
		navSecondary: [
			{
				title: 'Support',
				url: '#',
				icon: LifeBuoy
			},
			{
				title: 'Feedback',
				url: '#',
				icon: Send
			}
		]
	};
</script>

<script lang="ts">
	import NavMain from '$lib/components/nav-main.svelte';
	import NavBusiness from '$lib/components/nav-business.svelte';
	import NavSecondary from '$lib/components/nav-secondary.svelte';
	import NavUser from '$lib/components/nav-user.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import Command from 'lucide-svelte/icons/command';
	import type { ComponentProps } from 'svelte';
	import { AudioWaveform, Users } from 'lucide-svelte';
	import { useSidebar } from '$lib/components/ui/sidebar';
	import BusinessSwitcher from '$lib/components/business-switcher.svelte';

	const sidebar = useSidebar();

	let { ref = $bindable(null), ...restProps }: ComponentProps<typeof Sidebar.Root> = $props();
</script>

<Sidebar.Root bind:ref variant="inset" {...restProps}>
	<Sidebar.Header>
		<BusinessSwitcher businesses={data.businesses} />
	</Sidebar.Header>
	<Sidebar.Content>
		<NavMain items={data.navMain} />
		<NavBusiness items={data.navBusiness} />
		<NavSecondary items={data.navSecondary} class="mt-auto" />
	</Sidebar.Content>
	{#if sidebar.isMobile}
		<Sidebar.Footer>
			<NavUser />
		</Sidebar.Footer>
	{/if}
</Sidebar.Root>
