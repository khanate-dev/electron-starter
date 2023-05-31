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
	// ? https://github.com/serialport/node-serialport/issues/2464#issuecomment-1516887882
	externals: {
		serialport: 'serialport',
	},
};
