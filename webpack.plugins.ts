/* eslint-disable @typescript-eslint/no-var-requires, import/no-commonjs */
import type TForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import type TReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';

const ForkTsCheckerWebpackPlugin: typeof TForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const ReactRefreshWebpackPlugin: typeof TReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

export const plugins: (
	| TForkTsCheckerWebpackPlugin
	| TReactRefreshWebpackPlugin
)[] = [new ForkTsCheckerWebpackPlugin({ logger: 'webpack-infrastructure' })];

if (process.env.DEV) plugins.push(new ReactRefreshWebpackPlugin());
