/* eslint-disable @typescript-eslint/no-var-requires, import/no-commonjs */
import type TReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import type TForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';

const ForkTsCheckerWebpackPlugin =
	require('fork-ts-checker-webpack-plugin') as typeof TForkTsCheckerWebpackPlugin;
const ReactRefreshWebpackPlugin =
	require('@pmmmwh/react-refresh-webpack-plugin') as typeof TReactRefreshWebpackPlugin;

export const plugins: (
	| TForkTsCheckerWebpackPlugin
	| TReactRefreshWebpackPlugin
)[] = [new ForkTsCheckerWebpackPlugin({ logger: 'webpack-infrastructure' })];

if (process.env.DEV) plugins.push(new ReactRefreshWebpackPlugin());
