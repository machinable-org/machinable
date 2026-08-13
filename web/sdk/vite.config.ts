import { resolve } from 'node:path';

import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [svelte()],
	server: { cors: true },
	build: {
		outDir: resolve(__dirname, '../../src/machinable/assets'),
		emptyOutDir: false,
		lib: {
			entry: resolve(__dirname, 'src/main.ts'),
			formats: ['es'],
			fileName: () => 'widget-sdk.js',
			cssFileName: 'widget-sdk'
		},
		rollupOptions: {
			output: { inlineDynamicImports: true }
		}
	}
});
