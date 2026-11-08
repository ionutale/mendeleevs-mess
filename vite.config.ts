import { defineConfig } from 'vitest/config';
import adapter from '@sveltejs/adapter-static';
import { withPwa } from '@vite-pwa/sveltekit';
import { svelteTesting } from '@testing-library/svelte/vite';

export default defineConfig({
	plugins: [
		...withPwa(
			{
				compilerOptions: {
					// Force runes mode for the project, except for libraries.
					runes: ({ filename }) =>
						filename.split(/[/\\]/).includes('node_modules') ? undefined : true
				},
				adapter: adapter({ fallback: '200.html' })
			},
			{
				registerType: 'prompt',
				pwaAssets: {
					preset: 'minimal-2023',
					image: 'static/favicon.svg',
					overrideManifestIcons: true
				},
				manifest: {
					name: "Mendeleev's Mess",
					short_name: 'Mendeleev',
					description: 'Forge the periodic table from a single hydrogen atom.',
					theme_color: '#FBF6E8',
					background_color: '#FBF6E8',
					display: 'standalone',
					orientation: 'portrait',
					start_url: '/',
					scope: '/'
				},
				generateSW: {
					globPatterns: ['client/**/*.{js,css,html,svg,png,ico,woff2}'],
					globStrict: false,
					navigateFallback: undefined,
					runtimeCaching: [
						{
							urlPattern: ({ request }) => request.mode === 'navigate',
							handler: 'NetworkFirst',
							options: { cacheName: 'pages', networkTimeoutSeconds: 3 }
						}
					]
				},
				kit: { includeVersionFile: true }
			}
		),
		svelteTesting()
	],
	test: {
		expect: { requireAssertions: true },
		environment: 'jsdom',
		environmentOptions: { jsdom: { url: 'http://localhost:3000' } },
		setupFiles: ['./src/test/setup.ts'],
		include: ['src/**/*.test.ts']
	}
});
