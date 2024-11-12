type MenuItem = {
	name: string;
	href: string;
};

const menuItems: MenuItem[] = [
	{
		name: 'Home',
		href: '/',
	},
	{
		name: 'Orders',
		href: '/orders'
	},
	{
		name: 'Products',
		href: '/products'
	},
	{
		name: 'Payments',
		href: '/payments'
	},
	{
		name: 'Settings',
		href: '/settings'
	},
	{
		name: 'More +',
		href: '/more'
	}
];

export {
  menuItems
}