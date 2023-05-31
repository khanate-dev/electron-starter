import path from 'path';

import { rules } from './webpack.rules';

import type { Configuration } from 'webpack';

export const mainConfig: Configuration = {
	/**
	 * This is the main entry point for your application, it's the first file
	 * that runs in the main process.
	 */
	entry: './src/electron/main.ts',
	// Put your normal webpack config below here
	module: { rules },
	resolve: {
		extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json'],
		alias: {
			'~': path.join(__dirname, 'src'),
		},
	},
	// ! This is needed for webpack to not mess up `serialport`
	externals: {
		serialport: 'commonjs2 serialport',
	},
};
