/* eslint-disable import/no-default-export */
import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config https://vitest.dev/config
export default defineConfig({
	plugins: [tsconfigPaths()],
	test: {
		globals: true,
		environment: 'happy-dom',
		setupFiles: '.vitest/setup',
		include: ['**/*.test.{ts,tsx}'],
		clearMocks: true,
		typecheck: {
			include: ['**/*.test.{ts,tsx}'],
		},
	},
});
