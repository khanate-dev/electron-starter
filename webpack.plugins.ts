/* eslint-disable @typescript-eslint/no-var-requires, import/no-commonjs */
import type TReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import type TForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import type { Configuration } from 'webpack';

const ForkTsCheckerWebpackPlugin =
	require('fork-ts-checker-webpack-plugin') as typeof TForkTsCheckerWebpackPlugin;
const ReactRefreshWebpackPlugin =
	require('@pmmmwh/react-refresh-webpack-plugin') as typeof TReactRefreshWebpackPlugin;

export const plugins: NonNullable<Configuration['plugins']> = [
	new ForkTsCheckerWebpackPlugin({ logger: 'webpack-infrastructure' }) as never,
];

if (process.env.DEV) plugins.push(new ReactRefreshWebpackPlugin() as never);
