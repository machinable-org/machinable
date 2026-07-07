// Builds the SDK into src/machinable/assets/widget-sdk.{js,css} — the committed
// artifact the API serves (and the wheel ships). `npm run dev` serves the same
// source with HMR for development (the server's sdk_dev mode shims to it).
import { resolve } from 'node:path';

import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [svelte()],
	// dev server: importable cross-origin (the API's sdk_dev shim re-exports from here)
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
			// one self-contained file: anywidget injects _esm as inline source, so
			// relative chunk imports would not resolve in a notebook
			output: { inlineDynamicImports: true }
		}
	}
});
