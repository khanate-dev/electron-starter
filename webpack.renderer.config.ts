/* eslint-disable require-unicode-regexp */
import path from 'path';

import { rules } from './webpack.rules';
import { plugins } from './webpack.plugins';

import type { Configuration } from 'webpack';

rules.push({
	test: /\.css$/,
	use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
});

rules.push({
	test: /\.(woff|woff2|eot|ttf|otf|png)$/i,
	type: 'asset/resource',
});

export const rendererConfig: Configuration = {
	module: { rules },
	plugins,
	resolve: {
		extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
		alias: {
			'~': path.join(__dirname, 'src'),
		},
	},
	devtool: 'inline-source-map',
};
