import path from 'path';

import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	},
	build: {
		commonjsOptions: {
			include: [/@repo\/ui/, /node_modules/]
		}
	},
	resolve: {
		alias: {
			'@repo/ui': path.resolve('../../packages/ui/src')
		}
	}
});
