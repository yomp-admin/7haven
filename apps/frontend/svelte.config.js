import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter(),
		alias: {
			'@repo/ui': '../../packages/ui/src/*',
			'@': 'src/lib',
			'@/*': 'src/lib/*'
		}
	}
};

export default config;
