/* eslint-disable import/no-default-export */
import { defineConfig } from 'vitest/config';

// https://vitejs.dev/config https://vitest.dev/config
export default defineConfig({
	test: {
		globals: true,
		environment: 'jsdom',
		setupFiles: '.vitest/setup',
		include: ['**/*.test.{ts,tsx}'],
		clearMocks: true,
		typecheck: {
			include: ['**/*.test.{ts,tsx}'],
		},
	},
});
